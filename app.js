const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 3002;

//load the our application routes
const ideasRoutes = require('./routes/ideas');
const usersRoutes = require('./routes/users');
const passport = require('passport');
//our engine layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Map global promise ;so avoid mongo warning
mongoose.Promise = global.Promise;


//Passport config
require('./config/passport')(passport);

//connect mongoose database (local)
// mongoose.connect('mongodb://localhost/idea-dev').then(()=> console.log('MongoDB Connceted'))
//   .catch(err=>console.log(err));

//DB Selection
const db = 	require('./config/database');
//connect mongoose database (live)
mongoose.connect(db.mongoURI).then(()=> console.log('MongoDB Connceted'))
  .catch(err=>console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//Define our assets file folder
app.use(express.static(path.join(__dirname,'public')));


//middleware
// app.use(function(req,res,next){
// 	console.log(Date.now());
// 	next();
// });

//Method overridemiddleware
app.use(methodOverride('_method'));

//Express session meddleware
app.use(session({
  secret: 'idea',
  resave: true,
  saveUninitialized: true,
}));

//Place our passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash messages middleware
app.use(flash());

//Global variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//Index route
app.get('/',function(req,res){
	res.render('home');
});

//About route
app.get('/about',function(req,res){
	res.render('about');
});

//Bring to life our application rotes
app.use('/ideas',ideasRoutes);
app.use('/users',usersRoutes);


app.listen(port,()=>{
	console.log(`Server start listening on port ${port}`);
});