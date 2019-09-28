const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("index", () => {
  describe("GET /", () => {
    // Test to get all students record
    it("should return 200", (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.state.should.eq('active')
          done();
        });
    });
  });
});