var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

//Connecting to db yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error));

//make connection with db
const db = mongoose.connection;

app.use(bodyParser.urlencoded({extended: true}));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
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
            res.render("index.ejs", {campgrounds: campground});
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
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err,campground)=>{
                if(!err){
                    console.log(campground);
                    res.redirect("/campgrounds");
                }else{
                    console.log("Something went wrong");
                }});
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("new.ejs");
});

app.get("/campgrounds/:id", (req,res)=>{
    res.send("hello traveller");
})

app.listen(3000, ()=>{
    console.log("YelpCamp server is listening");
});