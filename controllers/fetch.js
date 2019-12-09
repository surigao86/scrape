'use strict';

const express = require("express");
const db = require("../models");
const cheerio = require('cheerio');
const request = require('request');
const moment = require('moment');
const router = express.Router();
// var exports = module.exports = {}

// Home page
// exports.homePage = 
router.get('/',function (req, res) {
    db.Headline.find({}, null, {sort: {createdAt: 1}}, (err, data) => {
        if (data.length === 0) {

            let articlesNotScraped = {
                message: 'Whoops. No articles scraped yet',
                btn: 'Scrape the Onion',
                route: '#',
                customGoogleFont: 'Oxygen',
                customCss: './css/style.css',
                customJS: './javascript/scrape.js'
            }

            res.render("placeholder", articlesNotScraped);

        } else {

            // console.log(data);

        let articlesScraped = {
            results: data,
            customGoogleFont: 'Oxygen',
            customCss: './css/style.css',
            customJS: './javascript/scrape.js'
        }


        res.render("index", articlesScraped);

        }
    })
});

// Scrape data from one site and place it into the mongodb db
// exports.scrape = 
router.get("/scraped", (req, res) => {
    // Make a request to LA Times
    request("https://www.theonion.com/", function(error, response, html) {
        // Load the html body from request into cheerio

        const $ = cheerio.load(html);
        console.log($)
        let result = {}

        $('article.postlist__item').each((i, element) => {
            result.link = (($(element).find('a.js_entry-link').attr('href')));
            console.log(element);
            console.log(result.link + "FOUND LINK")
            result.headline = $(element).find('h1').find('a').text().trim();
            // console.log(result.headline)
            result.summary = $(element).find('p').text().trim();
            // console.log(result.summary)
            result.img = $(element).find('picture').find('source').attr('data-srcset');
            // console.log(result.img)
            result.createdAt = $(element).find('time.meta__time updated').attr('datetime');
            // console.log(result.createdAt)

            let entry = new db.Headline(result);
            // console.log(entry);

            db.Headline.find({headline: result.headline}, (err, data) => {
                // if (data.length === 0) {
                    entry.save((err, data) => {
                        if (err) throw err;
                    });
                // }
            });
        });
        console.log("success");
        res.redirect("/");
    });
});

// exports.savedArticles = 
router.get("/saved", (req, res) => {
    db.Headline.find({saved: true}, null, {sort: {createdAt: 1}}, (err, data) => {
        if (data.length === 0) {

            let articlesNotSaved = {
                message: 'Whoops. No saved articles yet, try saving some articles',
                btn: 'Return to Home Page',
                route: "/",
                customGoogleFont: 'Oxygen',
                customCss: './css/style.css',
                customJS: './javascript/scrape.js'
            }

            res.render("placeholder", articlesNotSaved);

        } else {

            let articlesSaved = {
            results: data,
            customGoogleFont: 'Oxygen',
            customCss: './css/style.css',
            customJS: './javascript/scrape.js'
            }

            res.render("saved", articlesSaved)
        }
    })
});

// exports.getId =
router.get("/:id", (req, res) => {
    db.Headline.findById(req.params.id, (err, data) => {
        res.json(data);
    });
});


// exports.note =
router.get("/note/:id", (req, res) => {
    const id = req.params.id;

    db.Headline.findById(id).populate("Notes").exec((err, data) => {
        res.json(data.comments);
        console.log(data.comments + "nothing");
    });
});


// exports.noteCreatePost = 
router.post("/note/:id", (req, res) => {
    const comment = new db.Note(req.body);
    comment.save((err, doc) => {
        if (err) throw err;
        db.Headline.findByIdAndUpdate(req.params.id, {$set: {"Notes": doc._id}}, {new: true}, (err, data) => {
            if (err) throw err;
            else {
                res.send(data);
                console.log('WHAT IS THIS POSTING ' + data)
            }
        });
    });
});

// exports.savedPost = 
router.post("/saved/:id", (req, res) => {
    db.Headline.findById(req.params.id, (err, data) => {
        if (data.saved) {
            db.Headline.findByIdAndUpdate(req.params.id, {$set: {saved: false}}, {new: true}, (err,data) => {
                res.redirect("/");
                console.log('post is saved to database');
            });
        } else {
            db.Headline.findByIdAndUpdate(req.params.id, {$set: {saved: true}}, {new: true}, (err, data) => {
                res.redirect("/saved");
                console.log('post is working');
            });
        }
    });
});

module.exports = router;