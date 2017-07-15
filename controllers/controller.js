//Node Dependencies 
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); //web scraping 
var cheerio = require('cheerio'); //web scraping 


//Import the Comment and Article models 
var Article = require('../models/Article.js');
var Note = require('../models/Note.js');

router.get("/", function(req, res){
	res.render("index");
});

// router.get("/", function(req, res) {
// 	Article.find({saved: false}).limit(15).sort({date: -1}).exec(function(err, doc) {
// 		res.render("home", {doc}); 
// 	})
// 	res.render("index");
// }); 





// Web Scrape route 
//A GET request to scrape the WSJ website 
router.get("/scrape", function(req, res) {
	//First, we grab the body of the html with request 
	request("https://www.wsj.com/news/whats-news", function(error, response, html) {
		//Then, load that into cheerio and save it to the $ for a shorthand selector 
		var $ = cheerio.load(html); 

		var result = []; 

		var totalArticles; 
		
		//Now, grab every h3 within the wsj-headline 
		 $("h3.headline").each(function(i, element) {

			
			var title = $(this).text(); 
			var link = $(element).children().attr("href"); 
			// var image = $("a.headline-img").attr("img");
				// console.log(title); 
			 // console.log(link); 
			// console.log(image); 

			//Save these results in an object that we'll push into the result array we defined earlier
			result= {
				title: title, 
				link: link
			};

			console.log (result);

		 var entry = new Article(result); 

		 entry.save(function(err, doc){
		 	if(err) {
		 		console.log(err);
		 	} else {
		 		console.log(doc); 
		 	}
		 });

		 totalArticles = i; 

			});
		 //Redirect to home page once scrape is complete
		 console.log("Total number scraped: "+ totalArticles); 
});
	// Tell the browser that we finised scraping the text 
	console.log ("Scrape Complete"); 
	res.redirect("/"); 
});

//get the articles we scraped from the mongoDB
router.get("/articles", function(req, res){
	Article.find({}, function(err, doc){
		if(err){
			console.log(err);
		} else {
			res.json(doc);
		}
	}); 
});

//grab an article by it's ObjectId 
router.get("/articles/:id", function(req,res){
	console.log("ID is getting read" + req.params.id); 
	//using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	Article.findOne({"_id": req.params.id})
	//..and populate all of the notes associated with it 
	.populate("note")
	//execute query
	.exec(function(err,doc){
		if(err){
			//Log any errors 
			console.log(err);
		} else {
			//Otherwise, send the doc to the browser as a json object 
				res.json(doc);
		}
	});
});

//Create a new note or replace an existing note 
router.post("/articles/:id", function(req, res) {
	//Create a new note and pass the req.body to the entry 
	var newNote = new Note(req.body);

	//And save the new note the db 
	newNote.save(function(error, doc) { 
		//Log any errors 
		if(error) {
			console.log(error); 
		}
		//Otherwise
		else {
			//Use the article id to find and update it's note
			Article.findOneAndUpdate({"_id": req.params.id}, { $push: {"note": doc._id} })
			//Execute the aboive query
			.exec(function(err,doc) {
				//Log any errors
				if(err) {
					console.log(err);
				} else {
					//or send the document to the browser
					res.send(doc); 
				}
			});
		}
	});
});

module.exports = router;