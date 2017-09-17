

module.exports = function (movieModel) {

    var findMovies = function(searchCriteria, searchString, next) {
        if ( searchCriteria === 'ALL' ) {
            movieModel.find({}, function(err, movies) {
                next(movies);
            })
        }
        else {
            var query = {};
            query[searchCriteria] = searchString;
            movieModel.find(query, function(err, movies) {
                next(movies);
            })
        }
    };

    var findOne = function(query, next) {
        movieModel.findOne(query, function(err, movie){
            next(err, movie);
        });
    };

    var addNewMovie = function(movieToBeAdded, next) {
        var newMovie = new movieModel({
            name : movieToBeAdded.name,
            writer : movieToBeAdded.writer,
            director : movieToBeAdded.director,
            producer : movieToBeAdded.producer,
            editor : movieToBeAdded.editor,
            actors : movieToBeAdded.actors,
            year : movieToBeAdded.year,
            status : 'ACTIVE',
            timesRented : 0,
            currentlyRentedBy : null,
            createdDate : new Date(),
            updateDate : new Date()
        });

        newMovie.save(function(err) {
            next();
        });
    };

    var removeMovieById = function(movieId, next) {
        movieModel.remove({_id : movieId}, function(err) {
            next();
        })
    };

    var editMovie = function(movieId, movieToBeEdited, next) {
        movieModel.findOneAndUpdate({_id : movieId}, {
            $set: {
                name: movieToBeEdited.name,
                writer: movieToBeEdited.writer,
                director: movieToBeEdited.director,
                producer: movieToBeEdited.producer,
                editor: movieToBeEdited.editor,
                actors: movieToBeEdited.actors,
                year: movieToBeEdited.year,
                status: movieToBeEdited.status,
                updateDate: new Date()
            }
        }, function(err, movie) {
            next();
        });
    };

    return {
        findMovies : findMovies,
        findOne : findOne,
        addNewMovie : addNewMovie,
        removeMovieById: removeMovieById,
        editMovie : editMovie
    };

};