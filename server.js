require("dotenv").config();
require("dotenv").config();

var express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
var blog = require("./blog-service.js");
const streamifier = require("streamifier");

var app = express();
var PATH = require("path");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
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
    .getPublishedPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});

app.get("/posts", function (req, res) {
  if (req.query.category) {
    blog.getPostsByCategory(req.query.category).then((response) => {
      res.json(response);
    });
  } else if (req.query.minDate) {
  blog
    .getAllPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
  }
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
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req)
      .then((uploaded) => {
        processPost(uploaded.url);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    blog
      .addPost(req.body)
      .then((response) => {
        res.redirect("/posts");
      })
      .catch((rejectMessage) => {
        "message:" + rejectMessage;
      });
  }
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
