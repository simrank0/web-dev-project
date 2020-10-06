let express         = require(`express`),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    flash           = require("connect-flash"),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    methodOverride  = require("method-override"),
    User            = require('./models/user'),
    app             = express();

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
//Connecting to db yelp_camp

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, ()=>{
    console.log("YelpCamp server is listening");
});