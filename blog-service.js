const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d5iha5hi4vised",
  "emfwojcxtksqtn",
  "3ef3f283cfb72da4bd967f491bf9f45b4a32efc803a2cecb9bd8f40124b9abf4",
  {
    host: "ec2-3-222-74-92.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});
var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to sync the database");
      });
  });
};
module.exports.getAllPosts = function () {
  return new Promise(function (resolve, reject) {
    Post.findAll()
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};
module.exports.getPublishedPosts = function () {
  return new Promise(function (resolve, reject) {
    Post.findAll({ where: { published: true } })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results");
      });
  });
};
module.exports.getCategories = function (category) {
  return new Promise(function (resolve, reject) {
    Category.findAll()
      .then((categories) => {
        resolve(categories);
      })
      .catch((err) => {
        reject("no results");
      });
  });
};
module.exports.addPost = function (postData) {
  return new Promise(function (resolve, reject) {
    postData.published = postData.published ? true : false;
    for (var key in postData) {
      if (postData[key] === "") {
        postData[key] = null;
      }
    }
    postData.postDate = new Date();

    Post.create({
      body: postData.body,
      title: postData.title,
      postDate: postData.postDate,
      featureImage: postData.featureImage,
      published: postData.published,
      category: postData.category,
    })
      .then((post) => {
        resolve(post);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addCategory = function (categoryData) {
  return new Promise(function (resolve, reject) {
    for (var key in categoryData) {
      if (categoryData[key] === "") {
        categoryData[key] = null;
      }
    }
    Category.create({ category: categoryData })
      .then((category) => {
        resolve(category);
      })
      .catch((err) => {
        reject("unable to create category");
      });
  });
};

module.exports.deleteCategoryById = function (id) {
  return new Promise(function (resolve, reject) {
    Category.destroy({ where: { id: id } })
      .then((category) => {
        resolve(category);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.deletePostById = function (id) {
  return new Promise(function (resolve, reject) {
    Post.destroy({ where: { id: id } })
      .then((post) => {
        resolve(post);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};
module.exports.getPostsByCategory = function (category) {
  return new Promise(function (resolve, reject) {
    Post.findAll({ include: [Category], where: { category: category } })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};
module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise(function (resolve, reject) {
    Post.findAll({ where: { postDate: { [Sequelize.Op.gte]: minDateStr } } })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostById = function (id) {
  return new Promise(function (resolve, reject) {
    Post.findAll({ where: { id: id } })
      .then((posts) => {
        resolve(posts[0]);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise(function (resolve, reject) {
    Post.findAll({ where: { published: true, category: category } })
      .then((posts) => {
        resolve(posts);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};
