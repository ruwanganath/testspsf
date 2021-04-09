const { response } = require('express');

var express = require('express'),
    app = express();
const req = require('request');

var port = process.env.PORT || 3000;   

app.use(express.static(__dirname +'/public'));

app.get('/',function(request,response){
    response.send('Hello world-spsf')
})
/*
app.get('/sendUserLocation',function(request,response){
    let userCoord = encodeURI(resquest.query.text);
    console.log(userCoord);
    reqObject ="http://localhost:3000/getNearestNeighbours="+userCoord;
    req(reqObject,(err,result,neighbours)=>{
        if(err){
            return console.log(err);
        }
        console.log(result.neighbours)
        response.end(result.neighbours)
    });
})
*/

app.get('/service',function(request,response){
    reqObject ="http://localhost:8080/name";
    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        }
        console.log(result.body)
        response.end(result.body)
    });
})

app.listen(port);
console.log('Server listening on : '+port);