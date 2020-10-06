var Campground = require("../models/campground"),
    Comment    = require("../models/comment")

module.exports = {
    checkCampgroundOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, (err,foundCampground)=>{
                if(err){
                    res.redirect("/campgrounds");
                }else{
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                   }else{
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                }
            })
        }else{
            res.redirect("/login");
        } 
    },
    checkCommentOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, (err,foundComment)=>{
                if(err){
                    req.flash("error", "Campground Not Found")
                    res.redirect("/campgrounds");
                }else{
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error", "You don't have the permission to do that")
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                }
            })
        }else{
            req.flash("error", "You need to be logged in to do that!")
            res.redirect("/login");
        } 
    },
    isLoggedIn: function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("/login");
    }
};