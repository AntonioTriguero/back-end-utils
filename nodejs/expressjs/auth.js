const express = require('express');
const jwt = require('jsonwebtoken');

const Auth = {
    build(usersCollection, payloadData) {
        const users = usersCollection;
        const accessTokenSecret = 'youraccesstokensecret';
        const refreshTokenSecret = 'yourrefreshtokensecrethere';
        const refreshTokens = [];

        const router = express.Router();

        router.post('/login', (req, res) => {
            const { id } = req.body;
            const user = users.find(u => { return u.id === id });
        
            if (user) {
                payloadData['uid'] = user.id;
                const accessToken = jwt.sign(payloadData, accessTokenSecret, { algorithm: "HS256", expiresIn: '20m' });
                const refreshToken = jwt.sign(payloadData, refreshTokenSecret);
        
                refreshTokens.push(refreshToken);
        
                res.json({ accessToken, refreshToken});
            } else {
                res.send('Username or password incorrect');
            }
        });

        router.use(function (req, res, next) {
            const authHeader = req.headers.authorization;
        
            if (authHeader) {
                const token = authHeader.split(' ')[1];
        
                jwt.verify(token, accessTokenSecret, (err, user) => {
                    if (err) {
                        return res.sendStatus(403);
                    }
        
                    req.user = user;
                    next();
                });
            } else {
                res.sendStatus(401);
            }
        });
        
        router.post('/token', (req, res) => {
            const { token } = req.body;
        
            if (!token) return res.sendStatus(401)
            if (!refreshTokens.includes(token)) return res.sendStatus(403)
        
            jwt.verify(token, refreshTokenSecret, (err, user) => {
                if (err) return res.sendStatus(403);
        
                const accessToken = jwt.sign({ username: user.username, role: user.role }, 
                                               accessTokenSecret, 
                                               { expiresIn: '20m' });
        
                res.json({ accessToken });
            });
        });
        
        router.post('/logout', (req, res) => {
            const { token } = req.body;
            refreshTokens = refreshTokens.filter(t => t !== token);
            res.send("Logout successful");
        });

        return router;
    }
};

module.exports = Auth;
