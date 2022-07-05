const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'j;aijsd;lkjwiej@oijldijfdbsakldhflsjdiqo*&*%*()#**%&KJLJLI'


const url = "mongodb+srv://Striker528:FirstTime742022@cluster0.mizvf.mongodb.net/collection?retryWrites=true&w=majority"
mongoose.connect(url, {
   //console.log('Connected to Mongo DB Successfully!!');
   useNewUrlParser: true,
   useUnifiedTopology: true
   //useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
//Middle ware for express to decode the body which is coming in
//if the body is not valid json, an error is thrown
app.use(bodyParser.json())


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

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});