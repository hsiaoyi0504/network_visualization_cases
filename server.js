var express = require("express");
var ip   = "127.0.0.1";
var app = express();
var fs = require('fs');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
function start(){


    app.get('/', function (req, res) {
        res.render('index', { title: 'Supporting Info'});
    });

    app.get('/1', function(req, res){
    	data = fs.readFileSync('data/Positive-ReDraw-.json', 'utf8');
        elements = JSON.parse(data);
        elements = elements.elements;
        res.render('template', { title: 'Network1', cy_data: elements});
    });

    app.get('/2', function(req, res){
    	data = fs.readFileSync('data/Positive-ReDraw--.json', 'utf8');
        elements = JSON.parse(data);
        elements = elements.elements;
        res.render('template', { title: 'Network2', cy_data: elements});
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}
console.log("Server has started.");

exports.start = start;