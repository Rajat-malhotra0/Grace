const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const authMiddleware = require("../middleware/authMiddleware");
const { route } = require("./donationRoutes");

router.post('/register',async (req,res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ success : true, data : user });
    } catch (error) {
        res.status(400).json({ success : false , error : error.message });
    }
});

router.post('/login',async (req,res) => {
    try {
        const { email , password } = req.body;
        const { user , accessToken , refreshToken } = await authService.loginUser(email, password);

        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000,
        });

        res.json({
            success : true,
            data : {user,accessToken}
        });
    } catch (error) {
        res.status(401),json({success : false, error : error.message})
    }
});

router.post('/refresh',async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const accessToken = await authService.refreshAccessToken(refreshToken);
        res.json({success : true, accessToken});F    
    } catch (error) {
        res.sendStatus(403);
    }  
});

router.post('/logout', authMiddleware, async (req,res) => {
    try {
        await authService.logoutUser(req.user.id);
        res.clearCookie('refreshToken');
        res.json({success : true});
    } catch (error) {
        res.status(500).json({success : false , error : error.message})
    }
});

router.get('/me', authMiddleware, async (req,res) => {
    res.json({success : true, data : req.user});
});

module.exports = router;