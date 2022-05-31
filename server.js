var express  = require("express");
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

app.listen(PORT,onHttpStart);