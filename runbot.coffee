#!/usr/bin/env coffee

fs = require 'fs'
argv = require('optimist').
	usage("Usage: $0 robot0 robot1 robotN [--host=hostname] [--port=port]").
	default('p', 4321).
	alias('p', 'port').alias('h', 'hostname').
	argv

for filename in argv._
	robotext = fs.readFileSync("#{__dirname}/#{filename}", 'utf8')
	throw new Error("No robots") unless robotext

	console.log robotext

