var express = require("express");
var app = express();
const path = require('path');
var nodemailer = require("nodemailer");
const hbs = require('express-handlebars');



var HTTP_PORT = process.env.PORT || 8080;



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
      user: 'vacationroyal4',  //your email account
      pass: 'vacROYAL@1984'  // your password
  }
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', hbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/'));

app.get("/", function(req,res){
  res.render('homepage', {
    layout:false
  })
})

app.get("/homepage", function(req,res){
  res.render('homepage', {
    layout:false
  })
})

app.get("/registration", function(req,res){
    res.render('registration', {
      layout:false
    })
})

app.get("/roomlist", function(req,res){
  res.render('roomlist', {
    layout:false
  })
})

app.get("/detailspage", function(req,res){
  res.render('detailspage', {
    layout:false
  })
})
app.post("/searchres", (req,res)=>{
  res.render('searchres', {
    layout:false
  })
})
app.post("/dashboard", (req,res)=>{
  const FORM_DATA = req.body;
  
  var mailOptions = {
    from: 'vacationroyal4@gmail.com',
    to: FORM_DATA.email,
    subject: 'Registration at Royal Vacation',
    html: '<p>Hello, ' + FORM_DATA.fName + " " + FORM_DATA.lName + ":</p><p>Thank-you for joining to our family. We will try to fulfill all your wishes during the trip.</p>"
}
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.log("ERROR: " + error);
  } else {
      console.log("SUCCESS: " + info.response);
  }
});
res.render('dashboard', {
  data: FORM_DATA,
  layout:false
})
})


app.listen(HTTP_PORT);