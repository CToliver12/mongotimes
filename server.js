// Require Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");  
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var path = require("path"); 
//===================================================

//debugging tool 
var logger = require("morgan");

//Scraping 
var request = require("request");
var cheerio = require("cheerio");

//require Article and Note models 
var Article = require("./models/Article.js");
var Note = require("./models/Note.js"); 

//Set up port 
var PORT = process.env.PORT || 3000;

//Initialize Express 
var app = express();

//Set up an Express Router
var router = express.Router(); 

//Require routes file
var routes = require("./controllers/controller.js");

//Path for static content 
app.use(express.static(process.cwd() || _dirname + "/public"));

//Connect handlebars to Express app 
app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//use morgan (for logging) and body parser 
app.use(logger("dev")); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.text()); 
app.use(bodyParser.json({ type: "application/vnd.api+json"})); 

//Have every request go through router middleware 
app.use("/", routes); 

//Set mongoose to leverage built in JavaScript ES6 Promises 
mongoose.Promise = Promise; 

mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection; 

db.on("error", function(error){
 	console.log("Mongoose Error: ", error);
 });

 db.once("open", function() {
 	console.log("Mongoose connection successful.");
 });

//var databaseURL = "scraper";
//var collections = ["scrapedData"]; 

// var db = mongojs(databaseURL, collections); 
// db.on("error", function(error) {
// 	console.log("Database Error:", error);
// });

// app.get("/", function(req,res){
// 	res.send("Hello world");
// });

// app.get("/all", function(req, res){
// 	db.scrapedData.find({}, function (err, found) {
// 		if(err) {
// 			console.log(err);
// 		}
// 		else{
// 			res.json(found);
// 		}
// 	});
// });

// app.get("/scrape", function(req, res){

// 	request("https://news.ycombinator.com/", function(error, response, html){
// 		var $ = cheerio.load(html); 

// 		$(".title").each(function(i, element){
// 			var title = $(this).children("a").text();
// 			var link = $(this).children("a").attr("href");

// 			if(title && link) {
// 				db.scrapedData.save({
// 					title: title,
// 					link: link
// 				}, 
// 				function(error, saved) {
// 					if(error) {
// 						console.log(error);
// 					}

// 					else {
// 						console.log(saved); 
// 					}
						
			
// 				});
			
// 			}
// 		});

// 	});

// 		res.send("Scrape Complete");

// });



app.listen(PORT, console.log("App running on port 3000!"));