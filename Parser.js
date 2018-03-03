const _ = require('lodash');

const TYPE_HTV = 'htv';
const WORKFLOW_COMPLETED = 'completed';

// Error Define
const ERR_PARSING_FAILED = 'Could not decode request: JSON parsing failed';

/**
 * View the request payload json sample provided; 
 * from the list of property data in the request payload,
 * return a property record array for items having workflow completed (workflow: completed) for the type 'htv'.
 * "concataddress": "28 Donington Ave Georges Hall NSW 2198",
 *  -> address { buildingNumber + street + suburb + state + postcode}
 *  "type": "htv", -> type
 *  "workflow": "completed" -> workflow
 */
exports.parser = (input) => {
  // TODO: schema check?
  // simple validation check
  if (_.isNil(input.payload) || !_.isArray(input.payload)) {
    throw new Error(ERR_PARSING_FAILED);
  }

  try {
    let results = input.payload.filter((element) => (
      // payload.address nil should pop up exception? or keep decoding next as this?
      !_.isNil(element.address) && (element.type === TYPE_HTV) && (element.workflow === WORKFLOW_COMPLETED)
    )).map((payload) => {
      let concataddress =
        ((payload.address.unitNumber === undefined) ? '' : payload.address.unitNumber + ' ') +
          payload.address.buildingNumber + ' ' +
          payload.address.street + ' ' +
          payload.address.suburb + ' ' +
          payload.address.state + ' ' +
          payload.address.postcode;
      return {
        concataddress,
        type: payload.type,
        workflow: payload.workflow,
      };
    });
    return results;
  } catch (err) {
    throw new Error(ERR_PARSING_FAILED);
  }
}

exports.ERR_PARSING_FAILED = ERR_PARSING_FAILED;