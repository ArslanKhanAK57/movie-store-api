

module.exports = function (movieModel, errorCodes) {

    var movieController = {
        findMovies : function(req, res) {
            var searchCriteria = req.query.searchCriteria;
            var searchString = req.query.searchString;

            if ( !searchCriteria ) {
                res.sendResponse("COMM_ERR_0001", "ERROR", null, errorCodes["COMM_ERR_0001"] + ". searchCriteria is required", 400);
            }

            if ( searchCriteria === 'ALL' ) {
                movieModel.find({}, function(err, movies) {
                    if ( err ) {
                        res.sendResponse("MOV_ERR_0001", "ERROR", null, errorCodes["MOV_ERR_0001"], 200)
                    }
                    else {
                        res.sendResponse("0", "OK", movies, errorCodes["0"], 200)
                    }            })
            }
            else {
                if ( !searchString ) {
                    res.sendResponse("COMM_ERR_0001", "ERROR", null, errorCodes["COMM_ERR_0001"] + ". searchString is required", 400);
                }
                else {
                    var query = {};
                    query[searchCriteria] = searchString;
                    movieModel.find(query, function (err, movies) {
                        if (err) {
                            res.sendResponse("MOV_ERR_0001", "ERROR", null, errorCodes["MOV_ERR_0001"], 200)
                        }
                        else {
                            res.sendResponse("0", "OK", movies, errorCodes["0"], 200)
                        }
                    });
                }
            }
        },

        addNewMovie : function(req, res) {
            var movieToBeAdded = req.body;

            var newMovie = new movieModel({
                name : movieToBeAdded.name,
                writer : movieToBeAdded.writer,
                director : movieToBeAdded.director,
                producer : movieToBeAdded.producer,
                editor : movieToBeAdded.editor,
                actors : movieToBeAdded.actors,
                year : movieToBeAdded.year,
                status : 'AVAILABLE',
                timesRented : 0,
                currentlyRentedBy : null,
                createdDate : new Date(),
                updateDate : new Date()
            });

            newMovie.save(newMovie, function(err) {
                if ( err ) {
                    res.sendResponse("MOV_ERR_0002", "ERROR", null, errorCodes["MOV_ERR_0002"], 200);
                }
                else {
                    res.sendResponse("0", "OK", newMovie, errorCodes["0"], 201);
                }
            });
        },

        editMovie : function(req, res) {
            var movieId = req.params.id;
            var movieToBeEdited = req.body;

            movieToBeEdited.updateDate = new Date();

            movieModel.findOneAndUpdate({_id : movieId}, {$set: movieToBeEdited}, function(err, movie) {
                if ( err ) {
                    res.sendResponse("MOV_ERR_0003", "ERROR", null, errorCodes["MOV_ERR_0003"], 200);
                }
                else {
                    res.sendResponse("0", "OK", "Successfully updated movie", errorCodes["0"], 200);
                }
            });
        },

        removeMovieById : function(req, res) {
            var movieId = req.params.id;

            movieModel.remove({_id : movieId}, function(err) {
                if ( err ) {
                    res.sendResponse("MOV_ERR_0004", "ERROR", null, errorCodes["MOV_ERR_0004"], 200);
                }
                else {
                    res.sendResponse("0", "OK", "Successfully deleted movie " + movieId, errorCodes["0"], 200);
                }
            })
        },

        findOne : function(query, next) {
            movieModel.findOne(query, function(err, movie){
                next(err, movie);
            });
        }
    };

    return movieController;
};