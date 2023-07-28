const express = require("express");
const path = require("path");
var cookieParser = require('cookie-parser');
const app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
console.log(MongoClient);
var url = "mongodb://127.0.0.1:27017/";

var session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
// MongoDB Connection
// var db1;
// Check DB connection
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     db1 = db.db("signupdet");
//     console.log("Database Connected");
// });

const client = new MongoClient(url);
const db1 = client.db('signupdet');

// Body Parser Middleware
app.use(express.json());
app.use(express.static('path'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Bring in Model
const store = new MongoDBSession({
    uri: url + "sessions",
    collection: "mysessions",
});

app.use(cookieParser());
app.use(session({
    secret: "1a2b3c",
    resave: false,
    saveUninitialized: false,
    store: store
}));

const isAuth = (req, res, next) => {
        if (req.session.isAuth) {
            next()
        } else {
            res.redirect('/login.html');
        }
    }
    // Read responses
app.get("/signup", (req, res) => {
    //console.log(req.body.name);
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});
app.get("/loginup", (req, res) => {
    //console.log(req.body.name);
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/redirect.html", isAuth, (req, res) => {
    //console.log(req.body.name);
    res.sendFile(path.join(__dirname, "public", "redirect.html"));
});
app.get("/redirectsuc.html", isAuth, (req, res) => {
    //console.log(req.body.name);
    res.sendFile(path.join(__dirname, "public", "redirectsuc.html"));
});
app.get("/contactus.html", isAuth, (req, res) => {
    //console.log(req.body.name);
    res.sendFile(path.join(__dirname, "public", "contactus.html"));
});
/* app.get("/", (req, res) => {
    //console.log(req.body.name);
    res.sendFile(path.join(__dirname, "public", "index.html"));
}); */
app.post('/signup', function(req, res) {
    var data = { username: req.body.username, email: req.body.email, Password: req.body.password, name: req.body.name, branch: req.body.branch, reg_no: req.body.reg };

    db1.collection('signup').insertOne(data, function(err, result) {
        if (err) throw err;
        console.log("credentials saved!");
    });
    return res.redirect('/');
});
app.post('/loginup', function(req, res) {
    var loginData = { username: req.body.username, Password: req.body.password };
    db1.collection('signup').findOne(loginData, function(err, result) {
        if (err) throw err;
        if (result != null) {
            req.session.isAuth = true;
            return res.redirect('/redirectsuc.html');
        } else {
            res.redirect('login.html');
        }

    });

});
app.post('/query', function(req, res) {
    var data = { name: req.body.Name, email: req.body.email, message: req.body.message };
    db1.collection('queries').insertOne(data, function(err, result) {
        if (err) throw err;
        console.log("credentials saved!");
    });
    return res.redirect('/contactus.html');
});
app.post('/logout', function(req, res) {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    });
});
// Static server
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log("Server started on port ${PORT}"));
//console.log(db.users.find().pretty());