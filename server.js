const express = require("express");
const { engine } = require("express-handlebars");
const { connect } = require("mongoose");
const { join } = require("path");
const Handlebars = require("handlebars");
const passport = require("passport");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const EmployeeRoute = require("./Route/employee");
const { PORT, MONGODB_URL } = require("./config");
const AuthRouter = require("./Route/auth");
const app = express();
require("./middelware/passport")(passport);

//? connection to database starts here
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("database connected");
};
DatabaseConnection();
//? connection to database ends here

//? template engine starts here
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//? template engine ends here

//?Builtin middelware starts here
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//?Builtin middelware ends here

// sessionn middelware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// connect flash middelware
app.use(flash());

//? handlebars helpers
Handlebars.registerHelper("trimString", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

// ? set global variables
app.use((req, res, next) => {
  res.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  res.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;
  next();
});

//?  routing starts here
app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRouter);

//?  routing ends here

//? creating port

app.listen(PORT, error => {
  if (error) throw error;
  console.log("server is running in port", PORT);
});
