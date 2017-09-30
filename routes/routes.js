

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
     *   MovieBody:
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
     *   UserBody:
     *     properties:
     *       email:
     *         type: string
     *       password:
     *         type: string
     *       role:
     *         type: string
     *       address:
     *         type: string
     *       name:
     *         type: string
     *
     *   Customer:
     *     properties:
     *       userId:
     *         type: string
     *       totalRented:
     *         type: integer
     *       createdDate:
     *         type: string
     *       updateDate:
     *         type: string
     *
     *   SignupResponse:
     *     properties:
     *       responseCode:
     *         type: string
     *       responseStatus:
     *         type: string
     *       responseMessage:
     *         type: integer
     *       responseData:
     *         $ref: '#/definitions/Customer'
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
     *           $ref: '#/definitions/Token'
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
     *
     *   AddMoviesResponse:
     *     properties:
     *       responseCode:
     *         type: string
     *       responseStatus:
     *         type: string
     *       responseMessage:
     *         type: integer
     *       responseData:
     *         $ref: '#/definitions/Movie'
     *
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

    /**
     * @swagger
     * /signup:
     *   post:
     *     tags:
     *       - Signup
     *     description: Signup as a customer in movie store
     *     parameters:
     *       - in: body
     *         name: body
     *         description: Customer information to signup
     *         required: true
     *         schema:
     *           $ref: '#/definitions/UserBody'
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: If responseCode '0' then newly created customer in response | If responseCode 'USR_ERR_0002' then error occurred while searching for existing username | if responseCode 'USR_ERR_0003' then unable to create new user | if responseCode 'USR_ERR_0004' then unable to create customer
     *         schema:
     *           type: array
     *           $ref: '#/definitions/SignupResponse'
     *       400:
     *         description: If responseCode 'USR_ERR_0005' then invalid user role
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       409:
     *         description: If responseCode 'USR_ERR_0001' then username already exists
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     */
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
     *       - in: header
     *         name: signatureToken
     *         description: signature token to authenticate and authorize your request
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
     *         description: If responseCode '0' then an array of movies in responseData object | If responseCode 'MOV_ERR_0001' then unable to perform search on movies
     *         schema:
     *           $ref: '#/definitions/GetMoviesResponse'
     *       400:
     *         description: If responseCode 'AUTH_ERR_0007' then signature token missing | If responseCode 'COMM_ERR_0001' then insufficient input parameters
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       401:
     *         description: If responseCode 'AUTH_ERR_0005' then signature token expired | if responseCode 'AUTH_ERR_0006' then invalid signature token | If responseCode 'AUTH_ERR_0010' then unauthorized user role to call this API
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       404:
     *         description: If responseCode 'AUTH_ERR_0008' then signature token not found in database | If responseCode 'AUTH_ERR_0009' then user not found
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     */
    router.get('/api/v1/movies', controllers.movieController.findMovies);

    /**
     * @swagger
     * /api/v1/movies:
     *   post:
     *     tags:
     *       - Movies
     *     description: Create a new movie
     *     parameters:
     *       - in: header
     *         name: signatureToken
     *         description: signature token to authenticate and authorize your request
     *         required: true
     *         type: string
     *       - in: body
     *         name: body
     *         description: information of movie to be created
     *         required: true
     *         schema:
     *           $ref: '#/definitions/MovieBody'
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: If responseCode 'MOV_ERR_0002' then unable to add new movie
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       201:
     *         description: If responseCode '0' then newly created movie in responseData object
     *         schema:
     *           $ref: '#/definitions/AddMoviesResponse'
     *       400:
     *         description: If responseCode 'AUTH_ERR_0007' then signature token missing | If responseCode 'COMM_ERR_0001' then insufficient input parameters
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       401:
     *         description: If responseCode 'AUTH_ERR_0005' then signature token expired | if responseCode 'AUTH_ERR_0006' then invalid signature token | If responseCode 'AUTH_ERR_0010' then unauthorized user role to call this API
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       404:
     *         description: If responseCode 'AUTH_ERR_0008' then signature token not found in database | If responseCode 'AUTH_ERR_0009' then user not found
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     */
    router.post('/api/v1/movies', controllers.movieController.addNewMovie);

    /**
     * @swagger
     * /api/v1/movies/{id}:
     *   put:
     *     tags:
     *       - Movies
     *     description: Edit movie information
     *     parameters:
     *       - in: header
     *         name: signatureToken
     *         description: signature token to authenticate and authorize your request
     *         required: true
     *         type: string
     *       - in: path
     *         name: id
     *         description: id of movie to be updated
     *         required: true
     *         type: string
     *       - in: body
     *         name: body
     *         description: information of movie to be created
     *         required: true
     *         schema:
     *           $ref: '#/definitions/MovieBody'
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: If responseCode '0' successfully updated movie | If responseCode 'MOV_ERR_0003' then unable to update movie
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       400:
     *         description: If responseCode 'AUTH_ERR_0007' then signature token missing | If responseCode 'COMM_ERR_0001' then insufficient input parameters
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       401:
     *         description: If responseCode 'AUTH_ERR_0005' then signature token expired | if responseCode 'AUTH_ERR_0006' then invalid signature token | If responseCode 'AUTH_ERR_0010' then unauthorized user role to call this API
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     *       404:
     *         description: If responseCode 'AUTH_ERR_0008' then signature token not found in database | If responseCode 'AUTH_ERR_0009' then user not found
     *         schema:
     *           $ref: '#/definitions/ErrorResponse'
     */
    router.put('/api/v1/movies/:id', controllers.movieController.editMovie);

    // delete movie
    router.delete('/api/v1/movies/:id', controllers.movieController.removeMovieById);

    // add admin user
    router.post('/api/v1/users', controllers.userController.addAdminUser);

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