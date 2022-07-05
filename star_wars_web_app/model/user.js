//const mongoose = require('mongoose');

/*
const userSchema = mongoose.Schema(
    {
    email: { type: String, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true }
    },
    {collection: 'users'}
)

module.exports = mongoose.model('User', userSchema);
*/
/*
const UserSchema = new mongoose.Schema(
    {
    email: { type: String, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true }
    },
    {collection: 'users'}
)

const model = mongoose.model('UserSchema', UserSchema)
model.exports = model
*/

/*
const star_wars_media_Schema = mongoose.Schema({
    media_title: { type: String, unique: true, required: true},
    media_super_heading: {type: String, unique: false, required: false},
    number_in_series: {type: String, unique: false, required: false},
    author: {type: String, unique: false, required: false},
    publisher: {type: String, unique: false, required: false},
    star_wars_date : {type: String, unique: false, required: true},
    published_date: {type: Date, unique: false, required: true}
})

module.exports = mongoose.model('Timeline', star_wars_media_Schema);
*/

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
        email: { type: String, unique: true, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model