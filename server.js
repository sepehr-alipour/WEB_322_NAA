var express = require("express");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
var blog = require("./blog-service.js");
const streamifier = require('streamifier')


var app = express();
var PATH = require("path");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
cloudinary.config({
  cloud_name: 'SenecaWeb322',
  api_key: '893155491545128',
  api_secret: 'SFNgepI3K8TbYBzUj_U_NB7maq0',
  secure: true  
});
const upload = multer();
function onHttpStart() {
  console.log("Express http server listening on " + PORT);
}

app.get("/", function (req, res) {
  res.redirect("/about");
});
app.get("/about", function (req, res) {
  res.sendFile(PATH.join(__dirname, "/views/about.html"));
});
app.get("/blog", function (req, res) {
  blog
    .getAllPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});

app.get("/posts", function (req, res) {
  blog
    .getPublishedPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});

app.get("/categories", function (req, res) {
  blog
    .getCategories()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});
app.get("/posts/add", function (req, res) {
  res.sendFile(PATH.join(__dirname, "/views/addPost.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(PATH.join(__dirname, "/views/not_found.html"));
});

blog
  .initialize()
  .then(() => {
    app.listen(PORT, onHttpStart);
  })
  .catch((rejectMessage) => {
    console.log(rejectMessage);
  });
