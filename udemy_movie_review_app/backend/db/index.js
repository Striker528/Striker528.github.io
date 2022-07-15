const mongoose = require('mongoose')

url = process.env.MONGODB_URL;
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