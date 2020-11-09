require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const bodyParser = require('body-parser');
const http = require('http');
const passport = require('passport');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

//Helpers
const mongoDb = require('./helpers/mongoClient')();
const redisStore = require('./helpers/redisStore');


//express session
app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    //Https kullanılacagı zaman secure=true olacak
    cookie: { secure: false, maxAge: 14 * 24 * 3600000 }
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
const question = require('./routes/question');
const auth = require('./routes/auth');

app.use('/api/auth', auth);
app.use('/api/question', passport.authenticate('jwt'), question);

app.set('port', 3200);

const server = http.createServer(app);
server.listen(3200);