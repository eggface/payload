const expect = require('chai').expect;
const parser = require('../Parser');
const requestMockup = require('./hometrack-sample-request.json');
const requestMockupWithUnitNumber = require('./hometrack-sample-request-with-unitNumber.json');
const requestMockupNotFoundEvenTypeMatch = require('./hometrack-sample-request-not-found-even-type-match.json');
const requestMockupNotFoundEvenWorkFlowMatch = require('./hometrack-sample-request-not-found-even-workflow-match.json');

describe('Parser', function () {
  it('Without Unit number and more than one result', function () {
    const responseMockup = [{
        concataddress: 'Level 6 146 Arthur Street North Sydney NSW 2060',
        type: 'htv',
        workflow: 'completed'
      },
      {
        concataddress: 'Level 28 360 Elizabeth St Melbourne VIC 3000',
        type: 'htv',
        workflow: 'completed'
      }
    ];

    const results = parser.parser(requestMockup);
    expect(results).eql(responseMockup);
  });

  it('With Unit number and only one result', function () {
    const requestMockup = requestMockupWithUnitNumber;
    const responseMockup = [{
      concataddress: 'Suite 1 Level 8 92 Pitt Street Sydney NSW 2000',
      type: 'htv',
      workflow: 'completed'
    }];
    const results = parser.parser(requestMockup);
    expect(results).eql(responseMockup);
  });

  it('error, payload does not exist', function () {
    const requestMockup = {
      abc: []
    };
    expect(() => parser.parser(requestMockup)).to.throw('Could not decode request: JSON parsing failed');
  });

  it('error, payload is not an array', function () {
    const requestMockup = {
      payload: 'abc'
    };
    expect(() => parser.parser(requestMockup)).to.throw('Could not decode request: JSON parsing failed');
  });

  it('skip element whose payload.address does not exist', function () {
    const requestMockup = {
      payload: [{
        propertyTypeId: 3,
        readyState: "complete",
        reference: "asdasd",
        shortId: "ZM73nE4nKH56",
        status: 4,
        type: "htv",
        workflow: "not completed"
      }, {
        address: {
          buildingNumber: "92",
          postcode: "2000",
          state: "NSW",
          street: "Pitt Street",
          suburb: "Sydney",
          unitNumber: "Suite 1 Level 8"
        },
        propertyTypeId: 3,
        readyState: "complete",
        reference: "asdasd",
        shortId: "ZM73nE4nKH56",
        status: 4,
        type: "htv",
        workflow: "completed"
      }]
    };
    const responseMockup = [{
      concataddress: 'Suite 1 Level 8 92 Pitt Street Sydney NSW 2000',
      type: 'htv',
      workflow: 'completed'
    }];
    const results = parser.parser(requestMockup);
    expect(results).eql(responseMockup);
  });

  it('not found, even type match', function () {
    const requestMockup = requestMockupNotFoundEvenTypeMatch;
    const results = parser.parser(requestMockup);
    expect(results).to.be.an('array').that.is.empty;
  });

  it('not found, even workflow match', function () {
    const requestMockup = requestMockupNotFoundEvenWorkFlowMatch;
    const results = parser.parser(requestMockup);
    expect(results).to.be.an('array').that.is.empty;
  });


});