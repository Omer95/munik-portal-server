const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const delegationRouter = require('./routes/delegationRouter');
const mongoose = require('mongoose');
const Delegations = require('./models/delegations');

const url = 'mongodb://localhost:27017/munik';
const hostname = 'localhost';
const port = 3000;
const connect = mongoose.connect(url);

const app = express();
app.use(bodyParser.json());
app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new fileStore()
}));

function auth(req, res, next) {
    console.log(req.session);
    if (!req.session.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            // res.setHeader('WWW-Authenticate', 'Basic');
            // res.status = 401;
            res.writeHead(401, {"WWW-Authenticate": "Basic"});
            res.end('Authentication is needed');
            next(err);
            return;
        }
        const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        const password = auth[1];
        if (user === 'admin' && password === 'password') {
            // res.cookie('user', 'admin', {signed: true});
            req.session.user = 'admin';
            next();
        }
        else {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            res.status = 401;
            next(err);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session: ', req.session);
            next();
        }
        else {
            err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}
app.use(auth);
app.use('/delegation', delegationRouter);

connect.then((db) => {
    console.log('Connected correctly to server');
    
    // Delegations.create({
    //     id: 1,
    //     name: 'gen',
    //     school: 'Generations'
    // })

    
    //     .then((del) => {
    //         console.log(del);
    //         return Delegations.findByIdAndUpdate(del._id, {
    //             $set: {
    //                 school: 'City'
    //             }
    //         }, {
    //             new: true
    //         }).exec()
    //     })
    //     .then((del) => {
    //         console.log(del)
    //         del.delegates.push({
    //             name: 'omer farooq',
    //             committee: 'disec'
    //         });

    //         return del.save();
    //     })
    //     .then((del) => {
    //         console.log(del);
    //         // return db.collection('delegations').drop();
    //         return mongoose.connection.db.dropCollection('delegations');
    //     })
    //     .then(() => {
    //         // return db.close();
    //         return mongoose.connection.close();
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })
}, (err) => {
    console.log(err);
});
const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});