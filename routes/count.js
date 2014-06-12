// The database technology we will be using.
var MONGOHQ_URL="mongodb://optaros:o123123@oceanic.mongohq.com:10002/movies";
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var BSON = mongodb.BSONPure;

// Finds all movies.
exports.countMovies = function(request, response) {
    MongoClient.connect(MONGOHQ_URL, function(err, db) {
        var collection = db.collection('movies');

        collection.find().count(function(error, count) {
            response.json(count);
        });
    });    
};