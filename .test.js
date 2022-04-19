"use strict";

const { JEngine } = require("jms-engine");
const util = require("util");
const module_file = "telnet.js";

async function main() {
    const JENGINE = new JEngine();
    const jmodule = await JENGINE.load(module_file);
    await util.promisify(setTimeout)(1000);
    if (jmodule.connected && jmodule.channel) {
        await JENGINE.unload(jmodule);
    } else {
        throw "Failed to load module " + module_file;
    }
}

main().then(() => console.log("Test Ok\n")).catch(e => console.log("Test error:", e));