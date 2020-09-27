const { urlencoded } = require("body-parser");

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

//Connecting to db yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

//make connection with db
const db = mongoose.connection;

//connection functions: on error and once open.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB Connected!!")
});

app.use(bodyParser.urlencoded({extended: true}));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {name: "Antoine Triplett", 
//     image:"https://images.unsplash.com/photo-1531097517181-3de20fd3f05c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
//     }, (err,campground)=>{
//         if(!err){
//             console.log(campground);
//         }else{
//             console.log("Something went wrong");
//         }
//     });


//Array not needed as now we're storing data in db
// var campgrounds = [
//     {name: "Skye", image:"https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
//     {name: "Philip J. Coulson", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
//     {name: "", image:""},
//     {name: "", image:""},
//     {name: "", image:""},
// ];

app.get("/", (req,res)=>{
    res.render("landing.ejs");
});

app.get("/campgrounds", (req,res)=>{
    Campground.find({},(err, campground)=>{
        if(!err){
            res.render("campgrounds.ejs", {campgrounds: campground});
        }else{
            console.log("Some error occured");
        }
    })
    // res.render("campgrounds.ejs", {campgrounds: campgrounds});      //passing data from array to html page
});

app.post("/campgrounds",(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("new.ejs");
});

app.listen(3000, ()=>{
    console.log("YelpCamp server is listening");
});