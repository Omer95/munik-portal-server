const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/signup')
.post((req, res, next) => {

})
userRouter.route('/login')
.post((req, res, next) => {

})
userRouter.route('/logout')
.get((req, res, next) => {

})

module.exports = userRouter;