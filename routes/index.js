// var appController = require('../controllers/appcontroller.js');
const express = require('express');
const router = express.Router();
const fetchController = require('../controllers/fetch.js');

module.exports = function (app) {
  router.get('/', fetchController.homePage);
  console.log(router.get('/', fetchController.homePage))

  router.get("/scraped", fetchController.scrape);

  router.get("/saved", fetchController.savedArticles);

  router.post("/saved/:id", fetchController.savedPost);

  router.get("/:id",fetchController.getId);

  router.get("/comment/:id", fetchController.commentCreateGet);

  router.post("/comment/:id", fetchController.commentCreatePost);

 

}

module.exports = router;