require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
var blog = require("./blog-service.js");
const streamifier = require("streamifier");

var app = express();
var PATH = require("path");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");
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

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    route == "/" ? "/" : "/" + route.replace(/\/(.*)/, "");
  app.locals.viewingCategory = req.query.category;
  next();
});

app.get("/", function (req, res) {
  res.redirect("/about");
});
app.get("/about", function (req, res) {
  res.render("about", {
    layout: false, // do not use the default Layout (main.hbs)
  });
});
app.get("/blog", function (req, res) {
  blog
    .getPublishedPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

app.get("/posts", function (req, res) {
  if (req.query.category) {
    blog
      .getPostsByCategory(req.query.category)
      .then((response) => {
        res.render("posts", { posts: response });
        //res.json(response);
      })
      .catch((error) => {
        res.render("posts", {message: error})
        //res.send({ message: error });
      });
  } else if (req.query.minDate) {
    blog
      .getPostsByMinDate(req.query.minDate)
      .then((response) => {
        res.render("posts", { posts: response });

        //  res.json(response);
      })
      .catch((error) => {
        res.render("posts", {message: response})

      //  res.send({ message: error });
      });
  } else {
    blog
      .getAllPosts()
      .then((response) => {
        res.render("posts", { posts: response });

        //res.json(response);
      })
      .catch((error) => {
        res.render("posts", {message: error})

      //  res.send({ message: error });
      });
  }
});

app.get("/categories", function (req, res) {
  blog
    .getCategories()
    .then((response) => {
      res.render("categories", { categories: response });
    })
    .catch((error) => {
      res.render("categories", {message: error})
    });
});
app.get("/posts/add", function (req, res) {
  res.render("addPost", {
    layout: false, // do not use the default Layout (main.hbs)
  });
});
app.get("/posts/:id", function (req, res) {
  blog
    .getPostById(req.params.id)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
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
        res.send({ message: error });
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
      .catch((error) => {
        res.send({ message: error });
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
  .catch((error) => {
    res.send({ message: error });
  });
