
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleLoginAttempt } = require('../services/authService');


const handleLogin = async (req, res) => {

    const {email, password} = req.body;
    
    if(!email || !password){

        return res.status(400).json({'message':'Username and password required'});

    }
    
    // Check if user is a client first
    const Client = require('../models/Client');
    const clientUser = await Client.findOne({email}).exec();
    
    let foundUser;
    
    if (clientUser) {
        // Handle login attempt with rate limiting for clients
        const loginResult = await handleLoginAttempt(email, password);
        if (loginResult.error) {
            return res.status(401).json({ message: loginResult.error });
        }
        foundUser = loginResult.user;
    } else {
        // Handle admin/other user types normally
        foundUser = await User.findOne({email}).exec();
        
        if(!foundUser) return res.status(401).json({'message':'Invalid credentials'});
        
        const match = await bcrypt.compare(password, foundUser.password);
        if(!match) return res.status(401).json({'message':'Invalid credentials'});
    }
    
    if(!foundUser) return res.status(401).json({'message':'Invalid credentials'});

    if(!foundUser.isActive) {
        return res.status(403).json({'message':'User is not active'});
    }

    const roles = foundUser.type;
    
    //create jwt
    const accessToken = jwt.sign(
        {
            "UserInfo" : {
                "email" : foundUser.email,
                "roles" : roles
            }
        },
           
        process.env.ACCESS_TOKEN,
        {expiresIn:'1d'}
        
    );

    const refreshToken = jwt.sign(
        {"email" : foundUser.email},
        process.env.REFRESH_TOKEN,
        {expiresIn:'5d'}
    );
        // saving the refreshtoken
   foundUser.refreshToken = refreshToken;

   const result = await foundUser.save();
//    console.log(result)

    res.cookie('refreshToken', refreshToken, {httpOnly:true, sameSite:'None',  maxAge: 24 * 60 * 60 * 1000, secure:true });
    
    res.json({accessToken, user : foundUser, roles })
}

module.exports = {handleLogin}