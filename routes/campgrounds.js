var express     = require("express"),
    router      = express.Router();
var Campground  = require("../models/campground");

router.get("/", isLoggedIn, (req,res)=>{
    Campground.find({},(err, campground)=>{
        if(!err){
            res.render("./campgrounds/index.ejs", {campgrounds: campground, currentUser: req.user});
        }else{
            console.log("Some error occured");
        }
    })
});

router.post("/", isLoggedIn, (req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username   
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err,campground)=>{
                if(!err){
                    console.log(campground);
                    res.redirect("/campgrounds");
                }else{
                    console.log("Something went wrong");
                }});
});

router.get("/new", isLoggedIn ,(req,res)=>{
    res.render("./campgrounds/new.ejs");
});

router.get("/:id", (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(!err){
            res.render("./campgrounds/show.ejs",{campground: foundCampground});
        }else{
            console.log(err);
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;