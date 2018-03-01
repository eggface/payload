let _ = require('lodash');
let payload = "payload";

const TYPE_HTV = 'htv';
const WORKFLOW_COMPLETED = 'completed';

const ERR_PARSING_FAILED = 'Could not decode request: JSON parsing failed';

const result = {
  concataddress: '',
  type: '',
  workflow: '',
}

exports.parser = (input) => {
  // View the request payload json sample provided; 
  // from the list of property data in the request payload,
  // return a property record array for items having workflow completed (workflow: completed) for the type 'htv'.

  // "concataddress": "28 Donington Ave Georges Hall NSW 2198",
  //   -> address { buildingNumber + street + suburb + state + postcode}
  // "type": "htv", -> type
  // "workflow": "completed" -> workflow
  // console.log('input is an object: ',typeof(input) === 'object');

  //TODO: check Incorrect JSON
  console.log('before parse', _.get(input, payload));
  //let inputObj = JSON.parse(inputJson);

  //TODO: check attributes validation

  try {
    // ? Invalid check, including attributes check?
    let results = input.payload.filter((element) => (
      (element.type === TYPE_HTV) && (element.workflow === WORKFLOW_COMPLETED)
    )).map((payload) => {
      let concataddress = 
        ((payload.address.unitNumber === undefined) ? '' : payload.address.unitNumber + ' ')
        + payload.address.buildingNumber + ' '
        + payload.address.street + ' '
        + payload.address.suburb + ' '
        + payload.address.state + ' '
        + payload.address.postcode;
      return {
        concataddress,
        type: payload.type,
        workflow: payload.workflow,
      };
    });
    console.log('results: ', results);
    return results;
  } catch (err) {
    throw new Error(ERR_PARSING_FAILED);
  }
}

exports.ERR_PARSING_FAILED = ERR_PARSING_FAILED; 