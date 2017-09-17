

module.exports = function(express, app, controllers, jsontoxml) {

    var router = express.Router();

    var secureRouts = function(req, res, next) {
        if ( req.isAuthenticated() ) {
            next();
        }
        else {
            res.redirect('/');
        }
    };

    /*
    * ########################################### MOVIE ROUTES ###############################################
    * */

    router.get('/movies', function(req, res){
        controllers.movieController.findMovies(req.query.searchCriteria, req.query.searchString, function(movies){
            // res.json(movies);
            console.log(movies);
            res.header('Content-Type', 'text/xml');
            console.log(jsontoxml(movies));
            res.send(jsontoxml(movies));
            // res.sendData(movies);
        });
    });

    router.post('/movies', function(req, res) {
        controllers.movieController.addNewMovie(req.body, function(){
            res.redirect('/dashboard');
        })
    });

    router.delete('/movies/:id', function(req, res) {
        controllers.movieController.removeMovieById(req.params.id, function() {
            res.redirect('/dashboard');
        });
    });

    router.put('/movies/:id', function(req, res) {
        controllers.movieController.editMovie({_id : req.params.id}, req.body, function(err, movie) {
            res.send();
        });
    });

    router.get('/movies/add', function(req, res) {
        res.render('admin/addmovie');
    });

    router.get('/movies/edit/:id', function(req, res) {
        controllers.movieController.findOne({_id : req.params.id}, function(err, movie) {
            res.render('admin/editmovie', {movie : movie});
        });
    });

    /*
    * ########################################### USER ROUTES ###############################################
    * */

    router.get('/signup', function(req, res) {
        res.render('signup');
    });

    router.post('/signup', function(req, res) {
        controllers.userController.signup(req.body, function(){
            res.redirect('/login');
        })
    });

    router.get('/dashboard', function(req, res) {
        if ( req.user.role === 'ADMIN' ) {
            res.render('admin/dashboard');
        }
        else {
            res.render('customer/dashboard');
        }
    });

    app.use(function(req, res, next) {
        res.sendData = function(obj) {
             if (req.accepts('application/xml')) {
                res.header('Content-Type', 'text/xml');
                var xml = xml(obj);
                res.send(xml);
            }
            else {
                res.header('Content-Type', 'application/json');
                res.send(obj);
            }
        };

        next();
    });

    app.use('/', router);
};