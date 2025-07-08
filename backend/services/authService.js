const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class authService {
    constructor(){
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '1h';
    }
    async registerUser(email,password,name,role = 'volunteer') {
        try {
            const existingUser = await User.findOne({email});
            if(existingUser){
                throw new Error('Email already in Use');
            }
            const hashedPassword = await bcrypt.hash(password,12);
            const user = new User({email,password:hashedPassword,name,role});
            await user.save();
            return this.sanitizeUser(user);
        } catch (error) {
            throw error;
        }
    }

    async loginUser(email,password){
        try {
            const user = await User.findOne({email});
            if(!user) throw new Error('User Not Found');

            const password = await bcrypt.compare(password,user.password);
            if(!password) throw new Error('Invalid Credentials');

            const accessToken = this.generateToken(user,this.accessTokenSecret,this.accessTokenExpiry);
            const refreshToken = this.generateToken(user,this.refreshTokenSecret,this.refreshTokenExpiry);
            user.refreshTokens = user.refreshTokens.concat({token : refreshToken});
            await user.save();

            return {
                user: this.sanitizeUser(user), accessToken,refreshToken
            };
        } catch (error) {
            throw error;
        }
    }

    async refreshAccessToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken,this.refreshTokenSecret);
            const user = await User.findById(decoded.userId);

            if(!user || !user.refreshTokens.some(token => token.token ===refreshToken)){
                throw new Error("Invalid refresh token");
                return this.generateToken(user,this.accessToken,this.accessTokenExpiry);
            }
        } catch (error) {
            throw error;
        }
    }

    async logoutUser(userId,refreshToken){
        try {
            const user = await User.findById(userId);
            user.refreshTokens = user.refreshTokens.filter(token => token.token === refreshToken);
            await user.save();
        } catch (error) {
            throw error;
        }
    }

    generateToken(user,secret,expiresIn){
        return jwt.sign(
            {userId : user._id,role : user.role},
            secret,
            {expiresIn});
    };

    sanitizeUser(user){
        return {
        id : user._id,
        email : user.email,
        name : user.name,
        role : user.role
        };
    }
}

module.exports = new authService();