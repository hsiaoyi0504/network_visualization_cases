var express = require("express");
var ip   = "127.0.0.1";
var app = express();
var fs = require('fs');
app.set('view engine', 'jade');

function start(){


    app.get('/', function (req, res) {
        // var elements = [ // list of graph elements to start with
        //     { // node a
        //       data: { id: 'a' }
        //     },
        //     { // node b
        //       data: { id: 'b' }
        //     },
        //     { // node c
        //       data: { id: 'c' }
        //     },
        //     { // edge ab
        //       data: { id: 'ab', source: 'a', target: 'b' }
        //     },
        //     { // edge ba
        //       data: { id: 'ba', source: 'b', target: 'a' }
        //     }
        // ];
        data = fs.readFileSync('data/150.js', 'utf8');
        elements = JSON.parse(data);
        res.render('index', { title: 'HiDOS-Proteomics', message: 'HiDOS-Proteomics!', elements: elements});
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}
console.log("Server has started.");

exports.start = start;