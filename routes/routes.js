

module.exports = function(express, app, controllers, jstoxml) {

    var router = express.Router();

    router.get('/', function(req, res) {
        res.send('Movie Store API running');
    });

    router.post('/login', controllers.authController.login);

    router.post('/signup', controllers.userController.signup);

    /*
    * ########################################### MOVIE ROUTES ###############################################
    * */

    // get movies
    router.get('/api/v1/movies', controllers.movieController.findMovies);

    // add movie
    router.post('/api/v1/movies', controllers.movieController.addNewMovie);

    // edit movie
    router.put('/api/v1/movies/:id', controllers.movieController.editMovie);

    // delete movie
    router.delete('/api/v1/movies/:id', controllers.movieController.removeMovieById);

    // add admin user
    router.post('/api/v1/users', controllers.userController.addAdminUser);

    // prepare response
    app.use(function(req, res, next) {
        res.sendResponse = function(responseCode, responseStatus, responseData, responseMessage, httpCode) {
            var response = {
                responseCode : responseCode,
                responseStatus : responseStatus,
                responseData : responseData,
                responseMessage : responseMessage
            };

            res.header('Content-Type', 'application/json');
            res.status(httpCode);
            res.json(response);
        };

        next();
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