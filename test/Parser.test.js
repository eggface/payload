console.log('Testing Parser...')
const expect = require('chai').expect;
const app = require('../Parser');
const inputMockup = require('./hometrack-sample-request.json');

describe('Parser test', function () {
  it('should return good', function () {
    const output = app.parser();
    console.log(inputMockup);
    expect(output).equal('good');
  });

});
