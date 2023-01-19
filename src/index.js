const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const express_session = require('express-session');

// Constantes
const CONST = {
    PORT: 5000,
};

// Initializations
const app = express();
require('./lib/passport');


// settings
app.set('port', process.env.PORT || CONST.PORT);


// middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express_session({ secret: 'SECRET' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



// Global variables
app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes/authentication'));
app.use(require('./routes/places/farms'));
app.use('/farm', require('./routes/places/sheds'));
app.use('/farm', require('./routes/places/lots'));
app.use('/farm', require('./routes/places/costs'));
app.use('/farm', require('./routes/places/weight_history'));
app.use('/farm',require('./routes/inventory/daily_reports'));
app.use('/farm/foods',require('./routes/inventory/foods'));
app.use('/farm',require('./routes/inventory/food_inventory'));
app.use('/farm', require('./routes/places/reportFarm'));
app.use('/farm',require('./routes/inventory/eating_history'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('server on port ' + app.get('port'));
});

module.exports = CONST;