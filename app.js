var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/',function(request,response){
	response.sendFile("index.html");
});


server.listen(port);

console.log('listening on port: ' +port);