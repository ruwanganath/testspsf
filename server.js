var express = require('express')
var app = express()

/*app.get('/',function(req,res){
    res.send('Hello world')
})*/

app.use(express.static(__dirname +'/public'));

var port =3000;
app.listen(port)
console.log('Server listening on : '+port)