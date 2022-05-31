var express  = require("express");
var blog = require("./blog-service.js");

var app = express();
var PATH = require ("path");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));

function onHttpStart() {
  console.log("Express http server listening on " + PORT);
}

app.get("/",function(req,res){

    res.sendFile(PATH.join(__dirname,"/views/about.html"));
});

app.get("/blog",function(req,res){

    res.send(blog.getBlog());
});

app.get("/posts",function(req,res){

    res.send(blog.getPosts());
});

app.get("/categories",function(req,res){

    res.send(blog.getCategories());
});

app.listen(PORT,onHttpStart);