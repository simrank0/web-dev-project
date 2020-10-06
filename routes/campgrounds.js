var express     = require("express"),
    router      = express.Router();
var Campground  = require("../models/campground"),
    middleware  = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

router.post("/", middleware.isLoggedIn, (req,res)=>{
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
                    res.redirect("/campgrounds");
                }else{
                    console.log("Something went wrong");
                }});
});

router.get("/new", middleware.isLoggedIn ,(req,res)=>{
    res.render("./campgrounds/new");
});

router.get("/:id", (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(!err){
            res.render("./campgrounds/show",{campground: foundCampground});
        }else{
            console.log(err);
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
    Campground.findById(req.params.id, (err,foundCampground)=>{
        if(err){
            console.log(err);
        }else{ 
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(!err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            console.log(err);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    Campground.findByIdAndDelete(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;