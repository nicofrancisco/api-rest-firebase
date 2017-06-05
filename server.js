var express = require('express');
var app = express();
var path = require('path');


// viewed at http://localhost:8080
app.get('', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use("/js", express.static(__dirname + '/js'));

app.use("/css", express.static(__dirname + '/css'));


app.listen(3000);
