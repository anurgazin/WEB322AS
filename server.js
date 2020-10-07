var express = require("express");
var app = express();
const path = require('path');

var HTTP_PORT = process.env.PORT || 8080;
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"./views/homepage.html"));
  });
  app.use(express.static(__dirname + '/'));
app.listen(HTTP_PORT);