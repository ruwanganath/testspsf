var express = require('express'),
    app = express();

var port = process.env.PORT || 3000;   

app.use(express.static(__dirname +'/public'));

/*app.get('/',function(req,res){
    res.send('Hello world')
})*/

app.listen(port);
console.log('Server listening on : '+port);