const express = require('express');
const passwordJwt = require('../middelware/jwtAuth');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserShema = require('../models/User');


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (!user) {
            return res.status(400).json(info);
        }
        const { _id, username, email } = user;
        const payload = { _id, username, email };
        req.login(payload, (error) => {
            if (error) {
                return res.status(400).json(info);
            }
            const token = jwt.sign(JSON.stringify(payload), process.env.SESSION_SECRET_KEY);
            res.cookie('jwt', jwt, { httpOnly: true, secure: true });
            const result = {
                user: payload,
                token: token
            }
            return res.status(200).send(result);
        });
    })(req, res, next);
});

router.post('/register', (req, res, next) => {
    const user = req.body;
    if (user.password !== user.passwordControl) {
        return res.status(400).json({ message: "Parolanızı kontrol edip tekrar giriş yapınız" });
    }
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err || typeof err !== "undefined") {
            console.log(err);
            return res.status(400).json({ message: "Bir hata oluştu lütfen daha sonra tekrar deneyiniz" });
        }
        user.password = hash;
        UserShema.create(user, (err, data) => {
            if (err) {
                console.log('ldsvkds', err);
                return res.status(400).json({ message: "Bir hata oluştu lütfen daha sonra tekrar deneyiniz" });
            }
            return res.status(200).json({ message: "Kullanıcınız oluşturma talebiniz alınmıştır" });
        });
    });
});

module.exports = router;