

module.exports = function(express, app, controllers, jstoxml, swaggerSpec) {

    var router = express.Router();

    router.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    router.get('/', function(req, res) {
        res.send('Movie Store API running');
    });

    /**
     * @swagger
     *
     * definition:
     *
     *   LoginBody:
     *     properties:
     *       username:
     *         type: string
     *       password:
     *         type: string
     *
     *   Token:
     *     properties:
     *       token:
     *         type: string
     *       userId:
     *         type: string
     *       isDeleted:
     *         type: boolean
     *       createdDate:
     *         type: string
     *
     *   ErrorResponse:
     *     properties:
     *       responseCode:
     *         type: string
     *       responseStatus:
     *         type: string
     *       responseMessage:
     *         type: integer
     *       responseData:
     *         type: object
     *
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
     *   LoginResponse:
     *     properties:
     *       responseCode:
     *         type: string
     *       responseStatus:
     *         type: string
     *       responseMessage:
     *         type: integer
     *       responseData:
     *         type: array
     *         items: {
     *           $ref: '#/definitions/Token'
     *         }
     *
     *   GetMoviesResponse:
     *     properties:
     *       responseCode:
     *         type: string
     *       responseStatus:
     *         type: string
     *       responseMessage:
     *         type: integer
     *       responseData:
     *         type: array
     *         items: {
     *           $ref: '#/definitions/Movie'
     *         }
     */

    /**
     * @swagger
     * /login:
     *   post:
     *     tags:
     *       - Auth
     *     description: Login to movie store
     *     parameters:
     *       - in: body
     *         name: body
     *         description: username and password of user who wants to login
     *         required: true
     *         schema:
     *           $ref: '#/definitions/LoginBody'
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: If responseCode '0' then signature token in response | If responseCode 'AUTH_ERR_0002' then error searching user | if responseCode 'AUTH_ERR_0004' then error generating signature token
     *         schema:
     *           type: array
     *           $ref: '#/definitions/LoginResponse'
     *       400:
     *         description: If responseCode 'AUTH_ERR_0001' then missing username or password
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       401:
     *         description: If responseCode 'AUTH_ERR_0003' then user not found
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     */
    router.post('/login', controllers.authController.login);

    router.post('/signup', controllers.userController.signup);

    /*
    * ########################################### MOVIE ROUTES ###############################################
    * */

    /**
     * @swagger
     * /api/v1/movies:
     *   get:
     *     tags:
     *       - Movies
     *     description: Returns all movies
     *     parameters:
     *       - name: signatureToken
     *         description: signature token to authenticate and authorize your request
     *         in: header
     *         required: true
     *         type: string
     *       - name: searchCriteria
     *         description: column name to perform search on
     *         in: query
     *         required: true
     *         type: string
     *       - name: searchString
     *         description: column value to search with. Required only if searchCriteria is other than 'ALL'
     *         in: query
     *         required: false
     *         type: string
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: If responseCode '0' then an array of movies in responseData object | If responseCode 'MOV_ERR_0001' then unable to perform movies search
     *         schema:
     *           type: array
     *           $ref: '#/definitions/GetMoviesResponse'
     *       400:
     *         description: If responseCode 'COMM_ERR_0001' then insufficient input parameters
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
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