var express = require('express');
const app = express();
const req = require('request');
const ejs = require('ejs');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const {ensureAuthenticated, forwardAuthenticated} = require('./ensureAuth');

//require('../spsf_service/googleauth');

var port = process.env.PORT || 3000;   
//var spsfServiceUrl = 'https://spsfservice.us-south.cf.appdomain.cloud';
var spsfServiceUrl = 'http://localhost:8080';
const uri = "mongodb+srv://sit780:sit780@vaccinetracker.4wro0.mongodb.net/account?retryWrites=true&w=majority";

app.use(express.static(__dirname +'/public'));
//use express boady parser to get view data
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var loggedIn=false;
var loggedUsername ='';

//passport google 
require('./googleauth');

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
    uri,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
        () => console.log(" Mongoose is connected...")
    ); } catch (e) {
    console.log("could not connect...");
  }


//express session
app.use(session({
    secret: "key to cookie",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//spsf index page to sign in (landing or the signin page)
app.get('/', (request,response) => {
    if(loggedIn){
        response.render('displayDashboard', {title: 'SPSF - Dashboard',username:loggedUsername,loggedIn:loggedIn, signIn:false});

    }else{
        response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
    }    
})

// sign in page after user attempt to sign - process form data
app.post('/', function(request,response){
 
    reqObject = spsfServiceUrl+"/authenticate?username="+request.body.Username+"&password="+request.body.Password;

    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        }
        if(JSON.parse(result.body).authorisation==='true'){
            console.log('logged in!');
            loggedIn=true;
            loggedUsername = request.body.Username;
            response.render('displayDashboard', {title: 'SPSF - Dashboard',username:loggedUsername,loggedIn:loggedIn, signIn:false});
        }else{
            let message=JSON.parse(result.body).message;
            response.render('index', {title: 'SPSF - Home',username:loggedUsername,password:'',message:message,loggedIn:loggedIn, signIn:false});
        }              
    });
})

// get registration form when user try to register
app.get('/displayRegister', function(request,response){
    if(loggedIn){
        response.render('displayDashboard', {title: 'SPSF - Dashboard',username:loggedUsername,loggedIn:loggedIn, signIn:false});

    }else{
        response.render('displayRegister', {title: 'SPSF - Registration', username:loggedUsername,email:'',password:'',confirmpassword:'',message:'', loggedIn:loggedIn, signIn:true});
    }
})

// process register form post data to register and send data to service for registration process
app.post('/displayRegister',function(request,response){

    reqObject = spsfServiceUrl+"/register?username="+request.body.Username+"&password="+request.body.Password+"&email="+request.body.Email+"&confirmpassword="+request.body.ConfirmPassword;
    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        }

        if(JSON.parse(result.body).registration ==='true'){
            response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
        }else{
            let message= JSON.parse(result.body).message;
            response.render('displayRegister', {title: 'SPSF - Registration', username:loggedUsername,email:'',password:'',confirmpassword:'',message:message,loggedIn:loggedIn, signIn:true});
        }              
    });
})

// get forget password page to recover password
app.get('/displaySendPassword',function(request,response){
    if(loggedIn){
        response.render('displayDashboard', {title: 'SPSF - Dashboard',username:loggedUsername,loggedIn:loggedIn, signIn:false});

    }else{
        response.render('displaySendPassword', {title: 'SPSF - Forgot Password', username:loggedUsername,email:'',message:'',loggedIn:loggedIn, signIn:true});
    }false
})

// process password recovery from posted data and ask service to send the recovery email
app.post('/displaySendPassword',function(request,response){

    reqObject = spsfServiceUrl+"/sendpassword?email="+request.body.Email;
    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        }

        if(JSON.parse(result.body).registration ==='true'){
            response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
        }else{
            let message= JSON.parse(result.body).message;
            response.render('displaySendPassword', {title: 'SPSF - Forgot Password', username:loggedUsername,email:'',message:message,loggedIn:loggedIn, signIn:true});
        }              
    });
})

// user sign off from the system
app.get('/logout',function(request,response){
    //response.redirect('/');
    loggedIn=response.loggedIn;
    loggedUsername = '';
    response.render('index', {title: 'SPSF - Home', username:'',password:'',message:'',loggedIn:loggedIn, signIn:false});
    console.log('signed off!');
});

app.get('/login',function(request,response){
    response.render('index', {title: 'SPSF - Home', username:'',password:'',message:'',loggedIn:loggedIn, signIn:false});
    console.log('Auth failed!');
});

app.post('/changepassword', function(req, res){
    reqObject = spsfServiceUrl+"/changepassword?oldpassword"+request.body.OldPassword+"&newpassword"+request.body.NewPassword+"&confirmpassword"+request.body.ConfirmPassword;
    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        }
        if(JSON.parse(result.body).changed ==='true'){
            response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
        }else{
            let message= JSON.parse(result.body).message;
            response.render('displayChangePassword', {title: 'SPSF - Change Password', username:loggedUsername,oldpassword:'',newpassword:'',confirmpassword:'',message:message,loggedIn:loggedIn, signIn:false});
        }              
    }); 
})

//process user dashboard funtionality and route the user to the dessired page
app.post('/displayDashboard',function(request,response){
    if(loggedIn){
        if(request.body.FindParking==='find'){
            response.render('displayParkingMap', {title: 'SPSF - Parking Availability', username:loggedUsername,loggedIn:loggedIn, signIn:false});
        }else if (request.body.FuturePrediction==='prediction'){
            response.render('displayFuturePrediction', {title: 'SPSF - Future Parking Availability', username:loggedUsername,loggedIn:loggedIn, signIn:false});
        }else if(request.body.ChangePassword==='change'){
            response.render('displayChangePassword', {title: 'SPSF - Change Password', username:loggedUsername,oldpassword:'',newpassword:'',confirmpassword:'',message:'',loggedIn:loggedIn, signIn:false});
        }else if(request.body.ParkingHistory==='history'){
            response.render('displayParkingHistory', {title: 'SPSF - Parking History', username:loggedUsername,loggedIn:loggedIn, signIn:false});
        }       
    }else{
        response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
    }   
})

//refresh parking availability map and bac to dash board handling
app.post('/parkingMapRoutesButtonPanel',function(request,response){
    if(loggedIn){
        if(request.body.Refresh==='refresh'){
            response.render('displayParkingMap', {title: 'SPSF - Parking Availability', username:loggedUsername,loggedIn:loggedIn, signIn:false});
        }else if (request.body.Dashboard==='dashboard'){
            response.render('displayDashboard', {title: 'SPSF - Dashboard',username:loggedUsername,loggedIn:loggedIn, signIn:false});
        }      
    }else{
        response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
    }   
})

//once user selected the parking this will route the user to navigation page for navigation
app.post('/parkingMapRoutesMidPanel',function(request,response){

    if(loggedIn){
        if (request.body.Navigate==='navigate'){
                response.render('displayNavigation', {title: 'SPSF - Display Navigation', username:loggedUsername,loggedIn:loggedIn, timer:'', signIn:false, navArray:request.body.NavArray, navArrayIndex: request.body.NavArrayIndex});
            }       
    }else{
        response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
    }   
})

//get all available parking data from the service
app.get('/getAllAvailableParkingData', function (request,response){

    reqObject = spsfServiceUrl+"/requestAllParkingData";
    req(reqObject,(err,result,body)=> {
        if(err){
            return console.log(err);
        } 
        response.send(result.body);
    })          
})

app.get('/google', (passport.authenticate('google', {scope: 'profile'})));

app.get('/google/callback', function(request, response) {
    authed= req.authed;
    if(authed){
        response.render('displayDashboard', {title: 'SPSF - Dashboard',username:loggedUsername,loggedIn:loggedIn, signIn:false});

    }else{
        response.render('index', {title: 'SPSF - Home', username:loggedUsername,password:'',message:'',loggedIn:loggedIn, signIn:false});
    }    
});

app.listen(port);
console.log('Server listening on : '+port);
