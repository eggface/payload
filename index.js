// import axios from 'axios';
var express = require('express');
var bodyParser = require('body-parser')
var parser = require('./Parser');

var app = express();

app.set('port', (process.env.PORT || 5000));
// TODO: support giant input
app.use(bodyParser.json({
  limit: '1mb',
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(err, request, response, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // return response.status(400).send({ error: parser.ERR_PARSING_FAILED });
    return response.status(400).send({ error: parser.ERR_PARSING_FAILED });
  }
});

app.get('/', function (request, response) {
  let resp = {
    words: 'welcome',
  };
  response.send(resp);
});

// app.post('/', function (request, response) {
//   if (request.is('application/json')) {
//     console.log(request.body);
//     let resp = {
//       surname: 'Wang',
//     };
//     return response.status(200).send(resp);
//   }
//   return response.status(400).send();
// });

app.post('/fetchHtvCompleted', function (request, response) {
  if (!request.is('application/json')) {
    return response.status(400).send();
  }

  try{
    // console.log(request.body);
    const results = parser.parser(request.body);
    return response.status(200).send({ response: results });
  } catch (err){
    return response.status(400).send({ error: err.message });
  }
});


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
// curl -d '{ "username": "eggface" }' -H 'content-type:application/json' "http://localhost:5000/"