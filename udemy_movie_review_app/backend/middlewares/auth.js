const { sendError } = require("../utils/helper")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.isAuth = async (req, re, next) => {
    //console.log(req.headers.authorization)
    const token = req.headers?.authorization
    //console.log(token);

    const jwtToken = token.split("Bearer ")[1]

    if (!jwtToken) return sendError(res, 'Invalid token')
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET)
    //res.json({ jwtRes });
    const { userId } = decode;

    const user = await User.findById(userId)
    if (!user) return sendError(res, "Invalid token user not found", 404);

   // res.json({ user: { id: user._id, name: user.name, email: user.email } });
    
    //middleware
    //everything goes well
    //adding user inside req.user
    //now can acces the user in req.user
    req.user = user;
    next()
}