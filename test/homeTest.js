// //During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");

// //Require the dev-dependencies
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../server');
// let should = chai.should();

// chai.use(chaiHttp);
// //Our parent block

// /*
//   * Test the /GET route
//   */
// describe('/GET Home', () => {
//   it('it should GET Home', (done) => {
//     chai.request(server)
//       .get('/')
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.express.should.be.a('string');
//         res.body.express.should.be.equal('Hello From Express');
//         done();
//       });
//   });
// });


