/*
 * Dump stream to string.
 * Emits the event "dump" when dump is finished
 */
"use strict";

const { Writable } = require("stream");

class DumpStream extends Writable {
	constructor(options) {
		super(options);
    }
    
	_write(chunk, encoding, callback) {
		let dump = "";
		dump += chunk;
		callback();
		this.emit("dump", dump);
	}
}

module.exports = DumpStream;