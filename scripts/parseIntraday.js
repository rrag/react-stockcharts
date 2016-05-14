
if (process.argv.length !== 3) throw new Error("Need a ticker as argument")
const ticker = process.argv[2];

var fs = require('fs'),
	readline = require('readline');

var rd = readline.createInterface({
	input: fs.createReadStream(`../docs/data/${ticker}_INTRA_DAY.csv`),
	output: process.stdout,
	terminal: false
});

var stack = [];

var startTime;
const oneMin = 60 * 1000

rd.on('line', function(line) {
	if (line.startsWith("a")) {
		startTime = parseInt(line.replace("a", ""), 10) * 1000
		stack.push(buildRow(line, startTime, true))
	} else if (/^\d+,/.test(line)) {
		stack.push(buildRow(line, startTime, false))
	}
});

function buildRow(line, start, isStart) {
	var [date, close, high, low, open, volume] = line.split(",");
	if (isStart) {
		date = start;
	} else {
		date = start + parseInt(date, 10) * oneMin;
	}
	return `${date}	${open}	${high}	${low}	${close}	${volume}`;
}

var target = `../docs/data/${ticker}_INTRA_DAY.tsv`;


rd.on('close', function() {
	console.log('close', stack.length);

	fs.access(target, fs.F_OK, function(err) {
		if (!err) fs.unlinkSync(target);

		fs.appendFileSync(target, "date	open	high	low	close	volume" + "\n");
		while(stack.length > 0) {
			fs.appendFileSync(target, stack.shift() + "\n");
		}
	})
})