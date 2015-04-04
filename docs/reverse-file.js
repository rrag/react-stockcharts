var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('/home/dragon/Ragu/Work/GC/opensource/react-stockcharts/docs/data/AAPL_full-download.tsv'),
    output: process.stdout,
    terminal: false
});

var stack=new Array();

rd.on('line', function(line) {
    stack.push(line);
});

rd.on('close', function() {
    console.log('close', stack.length);
    while(stack.length > 0) {
        var line = stack.pop();
        fs.appendFileSync("/home/dragon/Ragu/Work/GC/opensource/react-stockcharts/docs/data/AAPL_full.tsv", line + "\n");
    }
})