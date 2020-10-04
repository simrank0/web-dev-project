var express = require("express"),
    router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");

router.get("/", (req,res)=>{
    res.render("landing.ejs");
});

router.get("/register", (req,res)=>{
    res.render("register.ejs");
});

router.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err,user)=>{
        if(!err){
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/campgrounds");
            })
        }else{
            console.log(err);
            res.render("register.ejs");
        }
    });
});

router.get("/login", (req,res)=>{
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,(req,res)=>{
});

router.get("/logout", (req,res)=>{
    req.logOut();
    res.redirect("/campgrounds");
});

module.exports = router;