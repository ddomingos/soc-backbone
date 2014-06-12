// The database technology we will be using.
var MONGOHQ_URL="mongodb://optaros:o123123@oceanic.mongohq.com:10002/movies";
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var BSON = mongodb.BSONPure;

// Finds all movies.
exports.findAll = function(request, response) {
    MongoClient.connect(MONGOHQ_URL, function(err, db) {
        var collection = db.collection('movies');
        var query = {};

        if (typeof(request.query.y1) != 'undefined') {
            query = {'year':request.query.y1};
            if (typeof(request.query.y2) != 'undefined') {
                if (request.query.y2 > request.query.y1) {
                    query = {'year': { $gte: request.query.y1, $lte: request.query.y2}};
                } else {
                    query = {'year': { $lte: request.query.y1, $gte: request.query.y2}};
                }
            }
        }

        if (typeof(request.query.q) != 'undefined') {
            query = {'title': {$regex: request.query.q, $options: 'i' }};
        }
        if (typeof(request.query.rating) != 'undefined') {
            console.log(request.query.rating == 0);
            if (request.query.rating == 0) {
                query = { $or: [{'rating': {$exists: false}}, {'rating': Number(request.query.rating)}]};
            } else {
                query = {'rating': Number(request.query.rating)};
            }
        }
        collection.find(query).toArray(function(error, movies) {
            console.log(error);
            console.log(movies);
            response.json(movies);
        });
    });
};

// Finds only one movie based on the id it has received.
exports.findById = function (request, response) {
    MongoClient.connect(MONGOHQ_URL, function(err, db) {
        var collection = db.collection('movies');

        collection.find({_id: new BSON.ObjectID(request.params.id)}).toArray(function(err, movie) {
            response.json(movie);
        });
    });
};

// Adds a new movie to the database.
exports.addMovie = function (request, response) {
    var movie = request.body;
    console.log('Adding Movie: ' + JSON.stringify(movie));

    MongoClient.connect(MONGOHQ_URL, function(error, db) {
        var collection = db.collection('movies');

        collection.insert(movie, function(error, result) {
            if (error) {
                response.send({'error':'An error has occurred'});
            } else {
                console.log('Successfully inserted movie: ' + JSON.stringify(result[0]));
                response.json(result[0]);
            }
        });
    });
};


// Updates a movie
exports.updateMovie = function (request, response) {
    var movie = request.body;

    MongoClient.connect(MONGOHQ_URL, function(err, db) {
        var collection = db.collection('movies');

        collection.update({_id: new BSON.ObjectID(request.params.id)}, movie, function(error, result) {
            console.log(request.params.id);
            if (error) {
                response.send({'error':'An error has occurred'});
            } else {
                console.log(result + ' document(s) updated');
                movie._id = request.params.id;
                response.json(movie);
            }
        });
    });
};


// Deletes a movie
exports.deleteMovie = function (request, response) {
    MongoClient.connect(MONGOHQ_URL, function(err, db) {
        var collection = db.collection('movies');

        collection.remove({'_id':new BSON.ObjectID(request.params.id)}, function(error, result) {
            if (error) {
                ressponse.send({'error':'An error has occurred - ' + error});
            } else {
                console.log(result + ' document(s) deleted');
                response.send(request.body);
            }
        });
    });
};