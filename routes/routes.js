

module.exports = function(express, app, controllers, jstoxml) {

    var router = express.Router();

    router.post('/login', controllers.authController.login);

    router.post('/signup', controllers.userController.signup);

    /*
    * ########################################### MOVIE ROUTES ###############################################
    * */

    // get movies
    router.get('/api/v1/movies', function(req, res){
        controllers.movieController.findMovies(req.query.searchCriteria, req.query.searchString, function(movies){
            res.json(movies);
            // res.sendData(movies);
        });
    });

    // add movie
    router.post('/api/v1/movies', function(req, res) {
        controllers.movieController.addNewMovie(req.body, function(response){
            res.json(response);
        })
    });

    // delete movie
    router.delete('/api/v1/movies/:id', function(req, res) {
        controllers.movieController.removeMovieById(req.params.id, function(deleted) {
            res.json(deleted);
        });
    });

    // edit movie
    router.put('/api/v1/movies/:id', function(req, res) {
        controllers.movieController.editMovie({_id : req.params.id}, req.body, function(err, movie) {
            res.send(movie);
        });
    });

    // app.use(function(req, res, next) {
    //     res.sendData = function(obj) {
    //
    //         if (req.accepts('application/xml')) {
    //             res.header('Content-Type', 'text/xml');
    //             res.send(jstoxml.toXML(obj));
    //         }
    //         else {
    //             res.header('Content-Type', 'application/json');
    //             res.send(obj);
    //         }
    //     };
    //
    //     next();
    // });

    app.use('/', router);
};