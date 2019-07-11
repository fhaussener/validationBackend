/**
 * Module dependencies.
 */
let mongoose = require("mongoose");
let Coupon = require('../app/models/coupon');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

/*
* Test the all /coupons routes
*/
describe('Coupon', () => {
  /*
  * Test POST /coupons
  */
  describe('/POST coupon', () => {
    it('it should not POST a coupon without the required parameters', (done) => {
      let coupon = {
        // description: "20%", Decription is needed but not specified
        campaign: "Starbucks",
        user: "username"
      }
      chai.request(server)
        .post('/api/v1/coupons')
        .send(coupon)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should POST a coupon', (done) => {
      let coupon = {
        description: "20% auf Flatwhite",
        campaign: "Starbucks_test",
        user: "username"
      }
      chai.request(server)
        .post('/api/v1/coupons')
        .send(coupon)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

  });


  /*
  * Test GET /coupons/:id
  */
  describe('/GET/:id coupon', () => {
    it('it should GET a coupon by the given code', (done) => {
      //Prepare new Coupon object for saving to db
      let coupon = new Coupon({ code: "code1234", description: "20% auf Flatwhite", campaign: "Starbucks", user: "username" });
      coupon.save((err, coupon) => {
        chai.request(server)
          .get('/api/v1/coupons/' + coupon.code)
          .send(coupon)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('description');
            res.body.should.have.property('code');
            res.body.should.have.property('campaign');
            res.body.should.have.property('user');
            res.body.should.have.property('code').eql(coupon.code);
            done();
          });
      });
    });

    it('it should not get a coupon with a non-existing code', (done) => {
      let notExistingId = "thisCodeDoesNotExist"
      chai.request(server)
        .get('/api/v1/coupons/' + notExistingId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('ID not found (CODE_INVALID)');
          done();
        });
    });
  });



  /*
  * Test PUT /coupons/:id
  */
  describe('/PUT/:id coupon', () => {
    it('it should update (PUT) a coupon by the given code', (done) => {
      //Prepare new Coupon object for saving to db
      let coupon = new Coupon({ code: "code1234", description: "20% auf Flatwhite", campaign: "Starbucks", user: "username", used: "false" });
      coupon.save((err, coupon) => {
        chai.request(server)
          .put('/api/v1/coupons/' + coupon.code)
          .send(coupon)
          .end((err, res) => {
            console.log(res.body.description);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('description');
            res.body.should.have.property('code');
            res.body.should.have.property('campaign');
            res.body.should.have.property('user');
            res.body.should.have.property('used').eql(true);
            done();
          });
      });
    });
  });


  /*
  * Test DELETE /coupons/:id
  */
  describe('/DELETE/:id coupon', () => {
    it('it should DELETE a coupon by the given code', (done) => {
      //Prepare new Coupon object for saving to db
      let coupon = new Coupon({ code: "code1234", description: "20% auf Flatwhite", campaign: "Starbucks", user: "username" });
      coupon.save((err, coupon) => {
        chai.request(server)
          .delete('/api/v1/coupons/' + coupon.code)
          .send(coupon)
          .end((err, res) => {
            console.log(res.body.description);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql(coupon.code + 'was deleted');
            done();
          });
      });
    });
  });

});