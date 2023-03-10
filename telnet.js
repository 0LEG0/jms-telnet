/**
 * JMS Telnet module
 * @author 0LEG0 <a.i.s@gmx.com>
 * @version 1.0.1
 */
"use strict";

const { connect, JMessage } = require("jms-engine");
const JENGINE = connect({trackname: "telnet", selftimeout: 5000});
const DumpStream = require("./dumpstream.js");
const dump = new DumpStream();
const { Console } = require("console");
const dump_console = new Console(dump);
const telnet = require("node-telnet-cli");
const CONF_FILE = process.env.JMS_PATH + "/conf/.telnet.js";
console.log("Load Telnet config", CONF_FILE);
/**
 * Default config options
 */
 const CONFIG = {
    host: "127.0.0.1",
    port: 8800,
	...require(CONF_FILE)
}

function dumpToString(src) {
	return new Promise((resolve) => {
		dump.once("dump", resolve);
		if (src instanceof Array) dump_console.table(src);
		else dump_console.log(src);
	});
}

function handler(cli) {
	cli.on("line", async (line) => {
		if (typeof line !== "string" || line == "") return;
		try {
			let ans = await JENGINE.dispatch(
				// new JMessage("jengine.command", { line: line.trim().toLowerCase() }, false, false)
				new JMessage("jengine.command", { line: line.trim() }, false, false)
			);
			if (
				typeof ans.result !== "undefined" &&
				ans.result !== null &&
				ans.result !== ""
			) {
				cli.log(await dumpToString(ans.result));
			} else {
				cli.log("Unknown command");
			}
		} catch (err) {
			JENGINE.error("Telnet console", err);
			cli.log(await dumpToString(err));
		}
	});
}

function main() {
	telnet.createServer(handler).listen(CONFIG, () => {
		JENGINE.info("Telnet console started on", JSON.stringify(CONFIG));
	});
	JENGINE.install("jengine.halt", () => {
		// JENGINE.warn("Telnet console halting...");
		process.exit(0);
	});
}

main();