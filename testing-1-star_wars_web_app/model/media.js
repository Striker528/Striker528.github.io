const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema(
    {
        media_title: { type: String, unique: true, required: true},
        media_super_heading: {type: String, unique: false, required: false},
        number_in_series: {type: Number, unique: false, required: false},
        author: {type: String, unique: false, required: true},
        publisher: { type: String, unique: false, required: false },
        published_date: { type: Date, unique: false, required: true },
        
        begin_date_num : {type: Number, unique: false, required: true},
		begin_time_period : {type: String, unique: false, required: true},
		end_date_num : {type: Number, unique: false, required: true},
		end_time_period : {type: String, unique: false, required: true}        
    },
    {collection: 'media'}
)

const media_model = mongoose.model('mediaSchema', mediaSchema)

module.exports = media_model