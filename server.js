/*********************************************************************************
*  WEB322 – Assignment 6
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Sepehr Alipour Student ID: 107296212 Date: 08/05/2022
*
*  Heroku Web App URL: https://tranquil-hamlet-98141.herokuapp.com
*
*  GitHub Repository URL: https://github.com/sepehr-alipour/web322-app
*
********************************************************************************/ 



require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
const stripJs = require("strip-js");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
var blog = require("./blog-service.js");
const streamifier = require("streamifier");
let authData = require("./auth-service.js");
let clientSessions = require("client-sessions");

var app = express();
var PATH = require("path");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  clientSessions({
    cookieName: "session",
    secret: "assignment6",
    duration: 10 * 60 * 1000,
    activeDuration: 50000 * 60,
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

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
      safeHTML: function (context) {
        return stripJs(context);
      },
      formatDate: function (dateObj) {
        let year = dateObj.getFullYear();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

function ensureLogin(req, res, next) {
  if (!req.session.user) res.redirect("/login");
  else next();
}

app.get("/", function (req, res) {
  res.redirect("/blog");
});
app.get("/about", function (req, res) {
  res.render("about", {});
});
app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blog.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blog.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest post from the front of the list (element 0)
    let post = posts[0];

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
    viewData.post = post;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blog.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});
app.get("/blog/:id", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blog.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blog.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the post by "id"
    viewData.post = await blog.getPostById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blog.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});
app.get("/posts", ensureLogin, function (req, res) {
  if (req.query.category) {
    blog
      .getPostsByCategory(req.query.category)
      .then((response) => {
        if (response.length > 0) {
          res.render("posts", { posts: response });
        } else {
          res.render("posts", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("posts", { message: error });
      });
  } else if (req.query.minDate) {
    blog
      .getPostsByMinDate(req.query.minDate)
      .then((response) => {
        if (response.length > 0) {
          res.render("posts", { posts: response });
        } else {
          res.render("posts", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("posts", { message: response });
      });
  } else {
    blog
      .getAllPosts()
      .then((response) => {
        if (response.length > 0) {
          res.render("posts", { posts: response });
        } else {
          res.render("posts", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("posts", { message: error });
      });
  }
});

app.get("/categories", ensureLogin, function (req, res) {
  blog
    .getCategories()
    .then((response) => {
      console.log(response);

      if (response.length > 0) {
        res.render("categories", { categories: response });
      } else {
        res.render("categories", { message: "no results" });
      }
    })
    .catch((error) => {
      res.render("categories", { message: error });
    });
});
app.get("/posts/add", ensureLogin, function (req, res) {
  blog
    .getCategories()
    .then((response) => {
      res.render("addPost", { categories: response });
    })
    .catch((error) => {
      res.render("addPost", { categories: {} });
    });
});

app.get("/categories/add", ensureLogin, function (req, res) {
  res.render("addCategory", {});
});

app.get("/categories/delete/:id", ensureLogin, function (req, res) {
  blog
    .deleteCategoryById(req.params.id)
    .then((response) => {
      res.redirect("/categories");
    })
    .catch((error) => {
      res
        .status(500)
        .render("Unable to Remove Category / Category not found)", {});
    });
});

app.get("/posts/delete/:id", ensureLogin, function (req, res) {
  blog
    .deletePostById(req.params.id)
    .then((response) => {
      res.redirect("/posts");
    })
    .catch((error) => {
      res.status(500).render("Unable to Remove Post / Post not found)", {});
    });
});

app.post("/categories/add", ensureLogin, (req, res) => {
  blog
    .addCategory(req.body.category)
    .then((response) => {
      res.redirect("/categories");
    })
    .catch((error) => {
      res.status(500).render("Unable to Add Category", {});
    });
});
app.post(
  "/posts/add",
  ensureLogin,
  upload.single("featureImage"),
  (req, res) => {
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
  }
);
app.get("/login", function (request, response) {
  response.render("login", {
    defaultLayout: false,
  });
});

app.get("/register", function (request, response) {
  response.render("register", {
    defaultLayout: false,
  });
});

app.post("/register", function (request, response) {
  authData
    .registerUser(request.body)
    .then(function () {
      response.render("register", {
        successMessage: "User created",
      });
    })
    .catch(function (error) {
      response.render("register", {
        errorMessage: error,
        userName: request.body.userName,
      });
    });
});

app.post("/login", function (request, response) {
  request.body.userAgent = request.get("User-Agent");
  authData
    .checkUser(request.body)
    .then((user) => {
      request.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };

      response.redirect("/posts");
    })
    .catch(function (err) {
      response.render("login", {
        errorMessage: err,
        userName: request.body.userName,
      });
    });
});

app.get("/userHistory", ensureLogin, function (request, response) {
  response.render("userHistory");
});

app.get("/logout", function (request, response) {
  request.session.reset();
  response.redirect("/login");
});

app.use((req, res) => {
  res.status(404).render("not_found", {});
});

blog
  .initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(PORT, onHttpStart);
  })
  .catch((error) => {
    res.send({ message: error });
  });
