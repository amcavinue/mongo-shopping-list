/**
 * Modules
 */
var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Item = require('./models/item');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

/**
 * Variables
 */
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

// If command line: node server.js
// run the runServer function with callback.
if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

/**
 * Routes
 */
// Set the root (/) route to the public directory.
app.use(express.static('public'));
 
app.get('/items', function(req, res) {
    Item.find(function(err, items) {
        if (err) {
            return res.status(400).json({
                message: 'Internal Server Error'
            });
        }
        
        res.json(items);
    });
});

app.post('/items', function(req, res) {
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(400).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

//PUT /items/<name>
app.put('/items/:name', function(req, res) {
    Item.update(
        { name: req.params.name }, 
        { name: req.body.name }, 
        function(err, item) {
            if(err || item.nModified === 0) {
                return res.status(404).json({
                    message: 'Error'
                });
            }
            res.status(201).json(item);
        }
    );
});

//DELETE /items/<name>
app.delete('/items/:name', function(req, res) {
    Item.remove(
        { name: req.params.name },
        function(err, item) {
            if(err || item.result.n === 0) {
                return res.status(404).json({
                    message: 'Error'
                });
            }
            res.status(200).json(item);
        }
    );
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

// Export the modules.
exports.app = app;
exports.runServer = runServer;
