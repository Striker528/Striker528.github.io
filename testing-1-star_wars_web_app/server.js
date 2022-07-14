const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const User = require('./model/user')
//For the different schema
const Media = require('./model/media')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'j;aijsd;lkjwiej@oijldijfdbsakldhflsjdiqo*&*%*()#**%&KJLJLI'
const ejs = require('ejs');
const { kStringMaxLength } = require('buffer');

const url = "mongodb+srv://Striker528:FirstTime742022@cluster0.mizvf.mongodb.net/collection?retryWrites=true&w=majority"
mongoose.connect(url, {
   //console.log('Connected to Mongo DB Successfully!!');
   useNewUrlParser: true,
   useUnifiedTopology: true
   //useCreateIndex: true
})
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

//connection to the database
//const db = MongoClient.db("collections");
//connecting to the specific collection
//const mediaCollection = db.collection("media");

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
//Middle ware for express to decode the body which is coming in
//if the body is not valid json, an error is thrown
app.use(bodyParser.json())

//Need for ejs -> js forms (like the search)
app.use(bodyParser.urlencoded({ extended: true }));

//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
	//secret:  a random unique string key used to authenticate a session. 
	//It is stored in an environment variable and can’t be exposed to the public. 
	//The key is usually long and randomly generated in a production environment.
	secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
	//saveUninitialized: this allows any uninitialized session to be sent to the store. 
	//When a session is created but not modified, it is referred to as uninitialized.
	saveUninitialized: true,
	//cookie: this sets the cookie expiry time. 
	//The browser will delete the cookie after the set duration elapses. 
	//The cookie will not be attached to any of the requests in the future.
	//In this case, we’ve set the maxAge to a single day as computed by the following arithmetic.
	cookie: { maxAge: oneDay },
	//resave: takes a Boolean value. 
	//It enables the session to be stored back to the session store, even if the session was never modified during the request.
	//This can result in a race situation in case a client makes two parallel requests to the server.
	//Thus modification made on the session of the first request may be overwritten when the second request ends.
	//The default value is true.However, this may change at some point.false is a better alternative.
    resave: false 
}));

//parsing the incoming data
//express.json == https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(express.json());

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// a variable to save a session
//Change later
var session;

//app.set('view engine', 'ejs');

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
        //For verifying and decoding
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
    //need to evaluate if the email, username, and password are correct or not
	const { email, username, password } = req.body
    //cannot use password in our findONE as we store it as a hash, not as PlainText which is what the req.body returns
	const user = await User.findOne({ username }).lean()
    const email_check = await User.findOne({ email }).lean()

	if (!user || !email_check) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

    //user.password == hash
    //password = plainText
	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
                email: user.email
			},
            //If the JWT_SECRET gets leakes, all the JSON object could be manipulated
            //signed again by the end user
			JWT_SECRET
		)

		/*
		session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
		*/

        //this res.json({status: 'ok, data: 'COMING SOON})
        //is what is going to be sent over
        //just need to change data to be the actual token instead of a personal creation
		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})


//Client -> Server: Your client *somehow* has to authicate who it is
// WHY -> Server is a central computer which YOU control
// Client -> a computer which you do not control
//client has to prove that it is saying what it is saying
//1. Client proves itself somehow on the secret/data is NON CHANGEABLE (JWT)
// JWT.io
// look at website
// Client use the JWT token and the server automatically knows that the client is okay and who the client says it is
//2. Client-Server share a secret (Cookie)

app.post('/api/register', async (req, res) =>{
    //see that request.body is actually empyt
    //because by default expres does not parse the JSON that is being sent in the request
    console.log(req.body)
    //A lot of people looking at the database:
        // Analysts
        // Scripts reading databases
    //database not place where store passwords
    // encrypts passwords somehow
    //also need to make sure others are able to authecate themselves easily
    // == hashing
    //using bcrypt
    // 1. Collision should be improbable
    // 2. The algorithm should be show == slow to brute force 

    const { email, username, password: plainTextPassword } = req.body
    //called password 'plainTextPassword'
    //so from here on out, only call plainTextPassword, not password

    //Validation for later
    ///*

    if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be at least 6 characters'
		})
	}
    //*/

    // 10 for # of cycles, more == slower
    // 10 -15 usuually
    //console.log( await bcrypt.hash(password, 10))
	const password = await bcrypt.hash(plainTextPassword, 10)

    ///*
	try {
		const response = await User.create({
            //Remember to have all fields or it won't work
            email,
            username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
        //know that code 11000 is duplicate from printing the stringify error
		if (error.code === 11000) {
			// duplicate key
            //console.log(JSON.stringify(error))
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}
    //*/

    //To Automatically set the headers:
    res.json({status: 'ok'})
})

app.post('/api/register_media', async (req, res) =>{
    //console.log(req.body)

    const { 
		title: media_title, 
		series, 
		num_in_series,
		author,
		publisher,
		published_date,

		begin_date_num,
		begin_date_num_aby,
		begin_date_num_bby,
		end_date_num,
		end_date_num_aby,
		end_date_num_bby 
	} = req.body

	let begin_time_period = ""
	if (begin_date_num_aby === "ABY") {
		begin_time_period = "ABY"
	}
	else {
		begin_time_period = "BBY"
	}

	let end_time_period = ""
	if (end_date_num_aby === "ABY") {
		end_time_period = "ABY"
	}
	else {
		end_time_period = "BBY"
	}
	//check for num in series, proabbly make it null
	//console.log("Title is:" + media_title);
	//console.log("Series is:" + series);
	//console.log("Num in series: "+ num_in_series);
	//console.log("Author: " + author);
	//console.log("Publisher " + publisher);
	//console.log("Star Wars" + star_wars_date);
	//console.log("Published Date" + published_date);


    //Validation for later

	/*
    if (!title || typeof title !== 'string') {
		return res.json({ status: 'error', error: 'Invalid title' })
	}
	*/

	/*
	if (!author || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid author' })
	}
	*/

	try {
		const response = await Media.create({
            //Remember to have all fields or it won't work
            media_title, 
            series, 
			num_in_series,
			author,
			publisher,
			published_date,

			begin_date_num,
			begin_time_period,
			end_date_num,
			end_time_period
		})
		console.log('Media added successfully: ', response)
	} catch (error) {
        //know that code 11000 is duplicate from printing the stringify error
		if (error.code === 11000) {
			// duplicate key
            //console.log(JSON.stringify(error))
			return res.json({ status: 'error', error: 'Media already exists' })
		}
		throw error
	}
    res.json({status: 'ok'})
})

app.get('/main_display', async (req, res) =>{
	//app.set('view engine', 'ejs');
	app.set('view engine', 'ejs');
	//app.set('views', path.join(__dirname, 'views'));
	//app.use('/', express.static(path.join(__dirname, 'views')))
	//This would be my Media
	//const Movie = mongoose.model('Movie', moviesSchema);

	//mongoose.connect('mongodb+srv://Striker528:FirstTime742022@cluster0.mizvf.mongodb.net/collection?retryWrites=true&w=majority');
	
	Media.find({}, function(err, media) {
		//for ejs
		//res.render(ejs file)
		res.render('main_display', {
			//Javascript object
			//this gets pushed to the index.ejs file
			mediaList: media
		})
	})

	app.use('/', express.static(path.join(__dirname, 'static')))
})

//user's information
app.get('/dashboard', async (req, res) =>{
	//app.set('view engine', 'ejs');
	app.set('view engine', 'ejs');
	
	//Dashboard section from:
	// /https://www.youtube.com/watch?v=Ejg7es3ba2k&ab_channel=codedamn
	// https://github.com/codedamn/full-mern-stack-video/tree/part1/client/src/pages
	// Time: 32:42

	//https://stackoverflow.com/questions/62861269/attempted-import-error-usehistory-is-not-exported-from-react-router-dom
	//const navigate = useNavigate();
	//const history = useNavigate();
	var LocalStorage = require('node-localstorage').LocalStorage,
	localStorage = new LocalStorage('./scratch');
	const token = localStorage.getItem('token')
	if (token) {
		const user = jwt.decode(token)
		if (!user) {
			localStorage.removeItem('token')
			//history.replace('/login')
			window.location.href = '/main_display';
		}
	}

	console.log('user is logged in')
	
	Media.find({}, function(err, media) {
		//for ejs
		//res.render(ejs file)
		res.render('dashboard', {
			//Javascript object
			//this gets pushed to the index.ejs file
			mediaList: media
		})
	})

	app.use('/', express.static(path.join(__dirname, 'static')))
})

app.post("/search_media", async (req, res) => {
	app.set('view engine', 'ejs');
	//app.use(bodyParser.urlencoded({ extended: true }));

	console.log("Did post to search_media");
	console.log("Req.body is:")
	console.log(req.body);
	console.log("Req.body.title is:")
	console.log(req.body.title);

	const { 
		title: media_title, 
		series, 
		num_in_series,
		author,
		publisher,
		published_date,
		begin_date_num,
		begin_date_num_aby,
		begin_date_num_bby,
		end_date_num,
		end_date_num_aby,
		end_date_num_bby 
	} = req.body

	let begin_time_period = ""
	if (begin_date_num_aby === "ABY") {
		begin_time_period = "ABY"
	}
	else if (begin_date_num_bby === "BBY"){
		begin_time_period = "BBY"
	}
	else {
		begin_time_period = ""
	}

	let end_time_period = ""
	if (end_date_num_aby === "ABY") {
		end_time_period = "ABY"
	}
	else if(end_date_num_bby === "BBY"){
		end_time_period = "BBY"
	}
	else {
		end_time_period = ""
	}

	//https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs
	//https://www.geeksforgeeks.org/how-to-create-dictionary-and-add-key-value-pairs-dynamically/
	let what_to_find = {};

	if (media_title != null && media_title != '' && media_title != 'undefined'){
		what_to_find["media_title"] = media_title;
		console.log("media_title is:")
		console.log(media_title);
	}

	if(series != null && series != '' && series != 'undefined'){
		what_to_find["series"] = series;
		console.log("series is:")
		console.log(series);
	}

	if(num_in_series != null && num_in_series != '' && num_in_series != 'undefined'){
		what_to_find["num_in_series"] = num_in_series;
		console.log("num_in_series is:")
		console.log(num_in_series);
	}

	if(author != null && author != '' && author != 'undefined'){
		what_to_find["author"] = author;
		console.log("author is:")
		console.log(author);
	}

	if(publisher != null && publisher != '' && publisher != 'undefined'){
		what_to_find["publisher"] = publisher;
		console.log("publisher is:")
		console.log(publisher);
	}

	if(published_date != null && published_date != '' && published_date != 'undefined'){
		what_to_find["published_date"] = published_date;
		console.log("published_date is:")
		console.log(published_date);
	}

	//dates
	//Either:
		//Range between 2 dates
			// or the same date in the beginning and end for books that end on that date and other books that
			// begin on that date
		//1 date
			//Either the beginning or the end date
	//need to make sure the beginning date is smaller than the end date or both dates are equal
	if (
		(
			(begin_time_period == "BBY" && end_time_period == "ABY")
			&& (begin_date_num != '' && begin_date_num != 'undefined' && begin_date_num != null)
			&& (end_date_num != '' && end_date_num != 'undefined' && end_date_num != null)
		)
	) {
		let begin_date_bby_to_zero = { $lte: begin_date_num, $gte: 0 };
		let end_date_aby_to_zero = {$gte: 0, $lte: end_date_num,};

		//what_to_find[]
		what_to_find["begin_date_num"] = begin_date_bby_to_zero;
		what_to_find["begin_date_num_bby"] = begin_date_num_bby;
		what_to_find["end_date_num"] = end_date_aby_to_zero;
		what_to_find["end_date_num_aby"] = end_date_num_aby;

		
	}
	//2 dates, in the BBY time period
	else if (
		(begin_time_period == "BBY" && end_time_period == "BBY") && (begin_date_num >= end_date_num)
		&& (begin_date_num != '' && begin_date_num != 'undefined' && begin_date_num != null)
		&& (end_date_num != '' && end_date_num != 'undefined' && end_date_num != null)
	) {
		let begin_date_bby_to_smallest = {$lte: begin_date_num, $gte: end_date_num};
		let end_date_bby_to_largest = {$gte: end_date_num, $lte: begin_date_num};

		//what_to_find[]
		what_to_find["begin_date_num"] = begin_date_bby_to_smallest;
		what_to_find["begin_date_num_bby"] = begin_date_num_bby;
		what_to_find["end_date_num"] = end_date_bby_to_largest;
		what_to_find["end_date_num_bby"] = end_date_num_bby;
	}
	//2 dates, in the ABY Time period
	else if (
		(begin_time_period == "ABY" && end_time_period == "ABY") && (begin_date_num <= end_date_num)
		&& (begin_date_num != '' && begin_date_num != 'undefined' && begin_date_num != null)
		&& (end_date_num != '' && end_date_num != 'undefined' && end_date_num != null)
	) {
		let begin_date_aby_to_latest = {$gte: begin_date_num, $lte: end_date_num};
		let end_date_aby_to_earliest = {$gte: begin_date_num, $lte: end_date_num};

		//what_to_find[]
		what_to_find["begin_date_num"] = begin_date_aby_to_latest;
		what_to_find["begin_date_num_aby"] = begin_date_num_aby;
		what_to_find["end_date_num"] = end_date_aby_to_earliest;
		what_to_find["end_date_num_aby"] = end_date_num_aby;
	}
	else if(begin_date_num != null && begin_date_num != '' && begin_date_num != 'undefined'){
		//what_to_find["begin_date_num"] = begin_date_num;
		//console.log("begin_date_num is:")
		//console.log(begin_date_num);

		if(begin_date_num_aby != null && begin_date_num_aby != '' && begin_date_num_aby != 'undefined'){
			what_to_find["begin_date_num"] = begin_date_num;
			console.log("begin_date_num is:")
			console.log(begin_date_num);
			
			what_to_find["begin_date_num_aby"] = begin_date_num_aby;
			console.log("begin_date_num_aby is:")
			console.log(begin_date_num_aby);
		}
		else if(begin_date_num_bby != null && begin_date_num_bby != '' && begin_date_num_bby != 'undefined'){
			what_to_find["begin_date_num"] = begin_date_num;
			console.log("begin_date_num is:")
			console.log(begin_date_num);
			
			what_to_find["begin_date_num_bby"] = begin_date_num_bby;
			console.log("begin_date_num_bby is:")
			console.log(begin_date_num_bby);
		}
	}
	else if(end_date_num != null && end_date_num != '' && end_date_num != 'undefined'){
		//what_to_find["end_date_num"] = end_date_num;
		//console.log("end_date_num is:")
		//console.log(end_date_num);

		if(end_date_num_aby != null && end_date_num_aby != '' && end_date_num_aby != 'undefined'){
			what_to_find["end_date_num"] = end_date_num;
			console.log("end_date_num is:")
			console.log(end_date_num);
			
			what_to_find["end_date_num_aby"] = end_date_num_aby;
			console.log("end_date_num_aby is:")
			console.log(end_date_num_aby);
		}
		else if(end_date_num_bby != null && end_date_num_bby != '' && end_date_num_bby != 'undefined'){
			what_to_find["end_date_num"] = end_date_num;
			console.log("end_date_num is:")
			console.log(end_date_num);
			
			what_to_find["end_date_num_bby"] = end_date_num_bby;
			console.log("end_date_num_bby is:")
			console.log(end_date_num_bby);
		}
	}
	//case where they just selected the regions (ABY OR BBY)
	else if (begin_time_period != "" && end_time_period != "") {
		if(begin_date_num_aby != null && begin_date_num_aby != '' && begin_date_num_aby != 'undefined'){
			what_to_find["begin_date_num"] = begin_date_num;
			console.log("begin_date_num is:")
			console.log(begin_date_num);
			
			what_to_find["begin_date_num_aby"] = begin_date_num_aby;
			console.log("begin_date_num_aby is:")
			console.log(begin_date_num_aby);
		}
		else if(begin_date_num_bby != null && begin_date_num_bby != '' && begin_date_num_bby != 'undefined'){
			what_to_find["begin_date_num"] = begin_date_num;
			console.log("begin_date_num is:")
			console.log(begin_date_num);
			
			what_to_find["begin_date_num_bby"] = begin_date_num_bby;
			console.log("begin_date_num_bby is:")
			console.log(begin_date_num_bby);
		}
		if(end_date_num_aby != null && end_date_num_aby != '' && end_date_num_aby != 'undefined'){
			what_to_find["end_date_num"] = end_date_num;
			console.log("end_date_num is:")
			console.log(end_date_num);
			
			what_to_find["end_date_num_aby"] = end_date_num_aby;
			console.log("end_date_num_aby is:")
			console.log(end_date_num_aby);
		}
		else if(end_date_num_bby != null && end_date_num_bby != '' && end_date_num_bby != 'undefined'){
			what_to_find["end_date_num"] = end_date_num;
			console.log("end_date_num is:")
			console.log(end_date_num);
			
			what_to_find["end_date_num_bby"] = end_date_num_bby;
			console.log("end_date_num_bby is:")
			console.log(end_date_num_bby);
		}
	}



	console.log("Form submitting is:");
	console.log(what_to_find);

	//https://www.geeksforgeeks.org/mongodb-db-collection-find-method/
	//https://developerslogblog.wordpress.com/2019/10/15/mongodb-how-to-filter-by-multiple-fields/
	//can put the find as a dictionary of what was inputted so if the user only wants to look up 1 -> all things they can

	//sorting:
	//https://www.quackit.com/mongodb/tutorial/mongodb_sort_query_results.cfm#:~:text=In%20MongoDB%2C%20you%20can%20sort,the%20results%20should%20be%20sorted.
	
	Media.find(what_to_find, function(err, media) {
		res.render('search_media', {
			mediaList: media
		})
	}).sort({begin_date_num : 1})

	app.use('/', express.static(path.join(__dirname, 'static')))
});

//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
});

//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}