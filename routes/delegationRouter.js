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
delegationRouter.route('/:delegationName/delegates')
.get((req, res, next) => {
    Delegations.findOne({"name": req.params.delegationName})
    .then((del) => {
        console.log(del.delegates);
        if (del != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(del.delegates);
        } else {
            err = new Error('Delegation ' + req.params.delegationName + ' not found');
            err.status = 404;
            return next(error);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})
.post((req, res, next) => {
    Delegations.findOne({"name": req.params.delegationName})
    .then((del) => {
        if (del != null) {
            del.delegates.push(req.body);
            del.save()
            .then((del) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(del);
            }, (err) => next(err));
        } else {
            err = new Error('Delegation ' + req.params.delegationName + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /delegation/${req.params.delegationName}/delegates`);
})
.delete((req, res, next) => {
    Delegations.findOne({"name": req.params.delegationName})
    .then((del) => {
        if (del != null) {
            // for (let i=0; i<=del.delegates.length; i++) {
            //     del.delegates.id(del.delegates[i]._id).remove();
            //     del.delegates.pop();
            // }
            del.delegates = [];
            del.save()
            .then((del) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(del);
            }, (err) => next(err))
        } else {
            err = new Error('Delegation ' + req.params.delegationName + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
});
delegationRouter.route('/:delegationName/delegates/:delegateName')
.get((req, res, next) => {
    Delegations.findOne({"name": req.params.delegationName})
    .then((del) => {
        let index = -1;
        for (let j=0; j<del.delegates.length; j++) {
            if (del.delegates[j].name === req.params.delegateName)
                index = j;
        }
        if (del != null && index != -1) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(del.delegates[index]);
        }
        else if (del == null) {
            err = new Error('Delegation ' + req.params.delegationName + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Delegate '+ req.params.delegateName + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /delegation/${req.params.delegationName}/delegates/${req.params.delegateName}`);
})
.put((req, res, next) => {
    Delegations.findOne({"name": req.params.delegationName})
    .then((del) => {
        let index = -1;
        for (let j=0; j<del.delegates.length; j++) {
            if (del.delegates[j].name === req.params.delegateName)
                index = j;
        }
        if (del != null && index != -1) {
            del.delegates[index].committee = req.body.committee;
            del.save()
            .then((del) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(del.delegates[index]);
            }, (err) => next(err))
        }
        else if (del == null) {
            err = new Error('Delegation ' + req.params.delegationName + ' not found');
            err.status = 404;
            return next(err);
        } 
        else {
            err = new Error('Delegate '+ req.params.delegateName + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.delete((req, res, next) => {
    Delegations.findOne({'name': req.params.delegationName})
    .then((del) => {
        let index = -1;
        for (let j=0; j<del.delegates.length; j++) {
            if (del.delegates[j].name === req.params.delegateName)
                index = j;
        }
        if (del != null && index != -1) {
            del.delegates.splice(index, 1);
            del.save()
            .then((del) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(del);
            }, (err) => next(err))
        }
        else if (del == null) {
            err = new Error('Delegation ' + req.params.delegationName + ' not found');
            err.status = 404;
            return next(err);
        } 
        else {
            err = new Error('Delegate '+ req.params.delegateName + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
});

module.exports = delegationRouter;