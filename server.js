var express = require("express");
var app = express();
const path = require("path");
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var multer  = require('multer')
var Schema = mongoose.Schema;
var usrModule = require("./models/userModule");
var bnbModule = require("./models/bnbModule");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");


app.use(express.static(__dirname + "/"));


const { response } = require("express");
const clientSessions = require("client-sessions");
mongoose.Promise = require("bluebird");

const config = require("./js/config");
const connectionString = config.database_connection_string;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// log when the DB is connected
mongoose.connection.on("open", () => {
  console.log("Database connection open.");
});

var HTTP_PORT = process.env.PORT || 8080;

const STORAGE = multer.diskStorage({
  destination: './public/photos/',
  filename: function(req, file, cb) {
      console.log("Uploading Photo")
      cb(null, Date.now() + path.extname(file.originalname));   
  }
  
});

const UPLOAD = multer({storage: STORAGE});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vacationroyal4", //your email account
    pass: "vacROYAL@1984", // your password
  },
});

app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(
  clientSessions({
    cookieName: "session",
    secret: "dbs311_as_royalvac",
    duration: 5 * 60 * 1000, //5 min
    activeDuration: 1000 * 60, //1min
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("homepage", {
    user: req.session.user,
    layout: false,
  });
});
app.get("/homepage", function (req, res) {
  res.render("homepage", {
    user: req.session.user,
    layout: false,
  });
});

app.get("/dashboard", function (req, res) {
  res.render("dashboard", {
    user: req.session.user,
    layout: false,
  });
});

app.get("/registration", function (req, res) {
  res.render("registration", {
    user: req.session.user,
    layout: false,
  });
});

app.get("/roomlist", function (req, res) {
  res.render("roomlist", {
    user: req.session.user,
    bnb: req.bnb,
    layout: false,
  });
});

app.get("/bnbCreate", function (req, res) {
  res.render("bnbCreate", {
    user: req.session.user,
    layout: false,
  });
});

app.get("/bnbEdit", function (req, res) {
  // console.log(bnbModule);
  bnbModule.find({})
  .lean()
  .exec()
  .then((bnbs)=>{res.render("bnbEdit", {
    user: req.session.user,
    details: bnbs,
    layout: false,
  });})
});

app.get("/detailspage", function (req, res) {
  res.render("detailspage", {
    user: req.session.user,
    layout: false,
  });
});
app.post("/searchres", (req, res) => {
  bnbModule.find({})
  .lean()
  .exec()
  .then((bnbs)=>{res.render("searchres", {
    user: req.session.user,
    details: bnbs,
    layout: false,
  });})
});

// app.post("/edit", UPLOAD.single("photo"), (req, res)=>{
//   const DETAILS = req.body;
//   const FORM_FILE = req.file;
//   console.log(FORM_FILE.filename);
//   const roomId = req.params._id
// })

app.post("/bnbCreate", UPLOAD.single("photo"), (req, res) => {
  const BNB_DET = req.body;
  const FORM_FILE = req.file;
  console.log(FORM_FILE.filename);
  var bnb = new bnbModule({
    title: BNB_DET.title,
    desc: BNB_DET.desc,
    price: BNB_DET.price,
    services: BNB_DET.amenities,
    location: BNB_DET.location,
    fileName: FORM_FILE.path,
    city: BNB_DET.city
  });
  bnb.save().then((response) => {
    console.log(response);
    console.log("I am here");
    res.render("bnbCreate", { layout: false });
  });
});

app.post("/dashboard", (req, res) => {
  const FORM_DATA = req.body;
  var user = new usrModule({
    firstName: FORM_DATA.firstName,
    lastName: FORM_DATA.lastName,
    email: FORM_DATA.email,
    password: FORM_DATA.pwd,
  });
  user
    .save()
    .then((response) => {
      console.log(response);
      console.log("I am here");
      res.render("dashboard", {
        user: FORM_DATA,

        layout: false,
      });
    })
    .catch((err) => {
      if (err.code == 11000) {
        errorMsg = "This email is already exists";
      }
      res.render("registration", {
        errorMsg: errorMsg,
        layout: false,
      });
      console.log(err);
      // const emailErr;
      // const pwdErr;
    });
  var mailOptions = {
    from: "vacationroyal4@gmail.com",
    to: FORM_DATA.email,
    subject: "Registration at Royal Vacation",
    html:
      "<p>Hello, " +
      FORM_DATA.fName +
      " " +
      FORM_DATA.lName +
      ":</p><p>Thank-you for joining to our family. We will try to fulfill all your wishes during the trip.</p>",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("ERROR: " + error);
    } else {
      console.log("SUCCESS: " + info.response);
    }
  });
});
app.get("/login", function (req, res) {
  res.render("login", {
    user: req.session.user,
    layout: false,
  });
});
app.post("/login", async (req, res) => {
  const username = req.body.email;
  const password = req.body.pwd;
  if (username === "" || password === "") {
    return res.render("login", {
      errorMsg: "Missing Credentials.",
      layout: false,
    });
  }
  try {
    const user = await usrModule.findByCredentials(username, password);
    req.session.user = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    };
    res.render("dashboard", { user: req.session.user, layout: false });
  } catch (e) {
    res.render("login", {
      errorMsg: "login does not exist!",
      layout: false,
    });
  }
});

app.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect("/login");
});

app.listen(HTTP_PORT);
