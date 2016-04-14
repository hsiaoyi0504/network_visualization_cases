var express = require("express");
var ip   = "127.0.0.1";
var app = express();
var fs = require('fs');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
function start(){


    app.get('/', function (req, res) {
        data = fs.readFileSync('data/all.js', 'utf8');
        elements = JSON.parse(data);
        res.render('index', { title: 'HiDOS-Proteomics',elements: elements});
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}
console.log("Server has started.");

exports.start = start;