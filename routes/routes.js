

module.exports = function(express, app, controllers, jstoxml, swaggerSpec) {

    var router = express.Router();

    router.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    router.get('/', function(req, res) {
        res.send('Movie Store API running');
    });

    router.post('/login', controllers.authController.login);

    router.post('/signup', controllers.userController.signup);

    /*
    * ########################################### MOVIE ROUTES ###############################################
    * */

    // get movies

    /**
     * @swagger
     *
     * definition:
     *   Movie:
     *     properties:
     *       name:
     *         type: string
     *       writer:
     *         type: string
     *       director:
     *         type: string
     *       producer:
     *         type: string
     *       editor:
     *         type: string
     *       actors:
     *         type: string
     *       year:
     *         type: integer
     *       status:
     *         type: string
     *       timesRented:
     *         type: integer
     *       createdDate:
     *         type: string
     *       updateDate:
     *         type: string
     *
     *   GetMoviesResponse:
     *     properties:
     *       responseCode:
     *         type: string
     *       responseStatus:
     *         type: string
     *       responseMessage:
     *         type: integer
     *       responseData: {
     *         $ref: '#/definitions/Movie'
     *       }
     */

    /**
     * @swagger
     * /api/v1/movies:
     *   get:
     *     tags:
     *       - Movies
     *     description: Returns all movies
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of movies
     *         schema:
     *           type: array
     *           $ref: '#/definitions/GetMoviesResponse'
     */
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