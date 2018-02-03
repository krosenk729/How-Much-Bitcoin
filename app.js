var express = require('express');
var app = express();


app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));

app.get('/', function(req, res){
	// res.sendFile(__dirname + '/public/coffee-cards.html')
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function(){
	console.log('Node app running on local host');
});