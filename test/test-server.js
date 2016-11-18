global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var expect = chai.expect;

var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: 'Tomatoes'},
                        {name: 'Peppers'}, function() {
                done();
            });
        });
    });

    /**
     * GET
     */
    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    
    
    it('should error on get to incorrect path', function(done) {
        chai.request(app)
            .get('/items/1')
            .end(function(err, res) {
                expect(err).to.not.be.null;
                done();
            });
    });
    
    /**
     * POST
     */
    it('should add an item on post', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            });
    });
    
    it ('should error on post without body data', function(done) {
        chai.request(app)
            .post('/items')
            .send()
            .end(function(err, res) {
               res.should.have.status(400);
               done();
            });
    });
    
    it ('should error on post with invalid json', function(done) {
        chai.request(app)
            .post('/items')
            .send({'abc': 123})
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    
    /**
     * PUT
     */
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/Tomatoes')
            .send({name: 'potatoes'})
            .end(function(err, res) {
               res.should.have.status(201); 
            });
        
        // Re-test the get request to make sure the data is valid.
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                done();
            });
    });
    
    it('should error on put without name', function(done) {
        chai.request(app)
            .put('/items/')
            .end(function(err, res) {
                expect(err).to.not.be.null;
                done();
            });
    });
    
    it('should error on put with non-existant name', function(done) {
        chai.request(app)
            .put('/items/9999')
            .send({name: 'abc'})
            .end(function(err, res) {
                expect(err).to.not.be.null;
                done();
            });
    });
    
    it('should error on put without body data', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({name: undefined})
            .end(function(err, res) {
               expect(err).to.not.be.null;
               done();
            });
    });
    it('should error on put with invalid json', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({'abc': 123})
            .end(function(err, res) {
               expect(err).to.not.be.null;
               done();
            });
    });
    
    /**
     * DELETE
     */
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/potatoes')
            .end(function(err, res) {
               res.should.have.status(200);
               done();
            });
    });
    
    it('should error on delete an item not in the list', function(done) {
        chai.request(app)
            .delete('/items/9999')
            .end(function(err, res) {
                expect(err).to.not.be.null;
                done();
            });
    });
    
    it('should error on delete without name', function(done) {
        chai.request(app)
            .delete('/items/')
            .end(function(err, res) {
                expect(err).to.not.be.null;
                done();
            });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});
