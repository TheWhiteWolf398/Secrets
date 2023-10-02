//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb+srv://abhishekmukherjee399:Test-123@cluster0.ayowasa.mongodb.net/userDB", {useNewUrlParser: true});

console.log(process.env.API_KEY);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
  });

app.get("/register", function(req, res){
    res.render("register");
  }); 

app.post("/register", function(req,res){
  const newUser= new User({
    email: req.body.username,
    password: md5(req.body.password)
});

newUser.save().then(()=>{
  res.render("secrets");
}).catch((err)=>{
  console.log(err);
})
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);
  
  
User.findOne({email:username})
  .then(foundUser=>{
    if(foundUser){
      if(foundUser.password === password){res.render("secrets");}
    }
      
  }).catch(err=>{
      console.log(err);
    })
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
     
app.listen(port, function(){
  console.log("Server has started successfully.");
});