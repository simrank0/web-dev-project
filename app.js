let express         = require(`express`),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    // Campground      = require('./models/campground'),
    // Comment         = require('./models/comment'),
    User            = require('./models/user'),
    seedDB          = require('./seeds'),
    app             = express();

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
//Connecting to db yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
seedDB();

app.use(require("express-session")({
    secret: "It's a magical world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, ()=>{
    console.log("YelpCamp server is listening");
});