const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));

const app = require('../index.js');
const requestMockup = require('./hometrack-sample-request.json');

// if(!module.parent) {
//   app.listen();
// }

// BlackBox test
describe('API endpoint', function () {
  this.timeout(5000);

  before(function () { 
  });

  after(function () {
});

  describe('GET', function () {
    it('should return welcome', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.words).to.equal('welcome');
        });
    });
  });

  describe('POST', function () {
    it('Post correct input should get correct response', function () {
      const responseMockup = {
        response: [{
            concataddress: 'Level 6 146 Arthur Street North Sydney NSW 2060',
            type: 'htv',
            workflow: 'completed'
          },
          {
            concataddress: 'Level 28 360 Elizabeth St Melbourne VIC 3000',
            type: 'htv',
            workflow: 'completed'
          }
        ]
      };
      return chai.request(app)
        .post('/fetchHtvCompleted')
        .send(requestMockup)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).eql(responseMockup);
        });
    });

    it('JSON decoding error, should get 400 error', function () {
      const requestMockup = {
        'payload': 'abc'
      };

      const responseMockup = {
        error: "Could not decode request: JSON parsing failed"
      };

      return chai.request(app)
        .post('/fetchHtvCompleted')
        .send(requestMockup)
        .then(function (res) {
          throw new Error('Could not decode request: JSON parsing failed');
        })
        .catch(function (err) {
          expect(err).to.have.status(400);
        });
    });

    it('Post Invalid Path should return 404', function () {
      return chai.request(app)
        .post('/INVALID_PATH')
        .then(function (res) {
          throw new Error('Path should not exists.');
        })
        .catch(function (err) {
          expect(err).to.have.status(404);
        });
    });

  });
});