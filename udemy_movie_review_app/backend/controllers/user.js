//to change a name across all files: highlight then F2
exports.create = (req, res) => {
    console.log(req.body)
    
    //res.send('<h1>I will create later</h1>');
    //send body back to front end user
    res.json({user: req.body})
};

//have many different exports for singing in, changing passwords, etc
//so module.exports = createUser; will not work
//create an object so we can export many things
//module.exports = { createUser }
//or could do exports.createUser