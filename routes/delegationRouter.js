const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Delegations = require('../models/delegations');

const delegationRouter = express.Router();
delegationRouter.use(bodyParser.json());

delegationRouter.route('/')
.get((req, res, next) => {
    Delegations.find({})
    .then((dels) => {
        res.statusCode = 200;
        res.setHeader('Response-Type', 'application/json');
        res.json(dels);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.post((req, res, next) => {
    Delegations.create(req.body)
    .then((del) => {
        res.statusCode = 200;
        res.setHeader('Response-Type', 'application/json');
        res.json(del);
    }, (err) => {next(err)})
    .catch((err) => {
        next(err);
    });
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /delegations');
})
.delete((req, res, next) => {
    Delegations.remove({})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
});
delegationRouter.route('/:delegationName')
.get((req, res, next) => {
    Delegations.find({ 'name': req.params.delegationName})
    .then((dels) => {
        console.log(dels);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'response/json');
        res.json(dels);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /delegations/${req.params.delegationName}`);
})
.put((req, res, next) => {
    Delegations.findOneAndUpdate({'name': req.params.delegationName}, {
        $set: req.body
    }, {new: true})
    .then((del) => {
        console.log(del);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(del);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.delete((req, res, next) => {
    Delegations.findOneAndRemove({'name': req.params.delegationName})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
});

module.exports = delegationRouter;