const mongoose = require('mongoose')

const url = "mongodb+srv://Striker528:FirstTime742022@cluster0.mizvf.mongodb.net/udemy_collection?retryWrites=true&w=majority"
mongoose.connect(url, {
   //console.log('Connected to Mongo DB Successfully!!');
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => {
    console.log('db is connected')
})
//if the connection to the database is not successful
    .catch((ex) => {
    console.log('db connection failed!', ex)
});
//const mongo = require('mongodb');