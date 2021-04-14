var express = require('express');
app = express();

const req = require('request');
const ejs = require('ejs');

var port = process.env.PORT || 3000;   
//var spsfServiceUrl = 'https://spsfservice.mybluemix.net';
var spsfServiceUrl = 'http://localhost:8080';

app.use(express.static(__dirname +'/public'));
app.set('view engine', 'ejs');

app.get('/',function(request,response){
    response.render('index', {title: 'SPSF - Home', user:'',username:'',password:'',message:''});
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
    reqObject = spsfServiceUrl+"/name?name=Ruwan";
    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        }
        console.log(result.body)
        response.end(result.body)
    });
})

app.get('/dashboard',function(request,response){
    response.render('dashboard', {title: 'SPSF - Dashboard',reply:request.query.reply});
})

app.get('/displayDashboard',function(request,response){
    response.render('displayDashboard', {title: 'SPSF - Dashboard', user:'',username:'',password:'',message:''});
})

app.get('/displayRegister',function(request,response){
    response.render('displayRegister', {title: 'SPSF - Registration', user:'',username:'',email:'',password:'',confirmpassword:'',message:''});
})

app.get('/displaySendPassword',function(request,response){
    response.render('displaySendPassword', {title: 'SPSF - Forgot Password', user:'',email:'',message:''});
})

app.get('/displayChangePassword',function(request,response){
    response.render('displayChangePassword', {title: 'SPSF - Forgot Password', user:'',oldpassword:'',newpassword:'',confirmpassword:'',message:''});
})

app.get('/displayParkingMap',function(request,response){
    response.render('displayParkingMap', {title: 'SPSF - Parking Availability', user:''});
})

app.get('/displayNavigation',function(request,response){
    response.render('displayNavigation', {title: 'SPSF - Navigation', user:''});
})

app.listen(port);
console.log('Server listening on : '+port);