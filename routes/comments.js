var express = require("express"),
    router  = express.Router({mergeParams: true});
var Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
    middleware  = require("../middleware");

router.get('/new', middleware.isLoggedIn ,(req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err)
		} else {
			res.render('./comments/new',{campground: campground})
		}
	});
});

router.post('/', middleware.isLoggedIn ,(req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			Comment.create(req.body.comments, (err, comment) => {
				if (err) {
					req.flash("error", "Something went wrong")
					console.log(err)
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment")
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res)=>{
	Comment.findById(req.params.comment_id, (err,foundComment)=>{
		if(err){
			res.redirect("/campgrounds/"+req.params.id);
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,foundComment)=>{
		if(err){
			res.redirect("/campgrounds/"+req.params.id);
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
			req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;