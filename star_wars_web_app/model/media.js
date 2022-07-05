const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema(
    {
        media_title: { type: String, unique: true, required: true},
        media_super_heading: {type: String, unique: false, required: false},
        number_in_series: {type: String, unique: false, required: false},
        author: {type: String, unique: false, required: true},
        publisher: {type: String, unique: false, required: false},
        star_wars_date : {type: String, unique: false, required: true},
        published_date: {type: Date, unique: false, required: true}
    },
    {collection: 'media'}
)

const media_model = mongoose.model('mediaSchema', mediaSchema)

module.exports = media_model