let express      = require(`express`),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose'),
    Campground   = require('./models/campground'),
    Comment      = require('./models/comment'),
    seedDB       = require('./seeds')
    app          = express();

//Connecting to db yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
seedDB();

app.get("/", (req,res)=>{
    res.render("landing.ejs");
});

app.get("/campgrounds", (req,res)=>{
    Campground.find({},(err, campground)=>{
        if(!err){
            res.render("./campgrounds/index.ejs", {campgrounds: campground});
        }else{
            console.log("Some error occured");
        }
    })
});

app.post("/campgrounds",(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err,campground)=>{
                if(!err){
                    res.redirect("/campgrounds");
                }else{
                    console.log("Something went wrong");
                }});
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("./campgrounds/new.ejs");
});

app.get("/campgrounds/:id", (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(!err){
            res.render("./campgrounds/show.ejs",{campground: foundCampground});
        }else{
            console.log(err);
        }
    });
})

app.get('/campgrounds/:id/comments/new', (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err)
		} else {
			res.render('./comments/new.ejs',{campground: campground})
		}
	});
});

app.post('/campgrounds/:id/comments', (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			Comment.create(req.body.comments, (err, comment) => {
				if (err) {
					console.log(err)
				} else {
                    console.log(comment);
					campground.comments.push(comment);
                    campground.save();
                    console.log(campground);
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	})
})

app.listen(3000, ()=>{
    console.log("YelpCamp server is listening");
});