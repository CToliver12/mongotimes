//Require mongoose 
var mongoose = require("mongoose"); 

//Create a Schema class with mongoose 
var Schema = mongoose.Schema; 

//Create article schema
var ArticleSchema = new Schema({
	//title is a required string
	title: {
		type: String, 
		trim: true, 
		required: true
	}, 
	//link is required a string 
	link: { 
		type: String, 
		required: true
	}, 
	//This only saves one note's ObjectID, ref refers to the Note model 
	note: { 
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

//Create the Article model with the ArticleSchema 
var Article = mongoose.model("Article", ArticleSchema); 

//Export the model
module.exports = Article; 
