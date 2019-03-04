const http = require('http');
const axios = require('axios');

const STEAM_API_BASE_URL = 'http://api.steampowered.com';

function responseForTestEndpoint(res) {
    console.log("Test endpoint called!");
  res.write(JSON.stringify({
    status: "SERVER UP!"
  }));
  res.end();
}

function responseForOptions(res) {
    console.log("OPTIONS endpoint called!");
  res.write(JSON.stringify({
    status: "Options Call detected!"
  }));
  res.end();
}

function responseForGet(path, res) {
  console.log("GET endpoint called!");

  axios({
    method:"GET",
    url: STEAM_API_BASE_URL + path,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  }).then((response) => {
    console.log("STEAM RESPONSE => ", JSON.stringify(response.data));
    res.write(JSON.stringify(response.data));
    res.end();
  });
}
function responseWithPayload(method, path, payload, res) {

  console.log(`${method} endpoint called!`);
  console.log(JSON.stringify(payload));

  axios({
    method,
    url: STEAM_API_BASE_URL + path,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    data: payload
  }).then((response) => {
    console.log("STEAM RESPONSE => ", JSON.stringify(response.data));
    res.write(JSON.stringify(response.data));
    res.end();
  });
}

//create a server object:
let server = http.createServer(function (req, res) {

    let {method, url: path} = req;
    let body = [];
    let payload = {};

    console.log({method, path});

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','*');

  if(method === "GET" && path==="/test") {
      responseForTestEndpoint(res);
  }else if(method === "OPTIONS"){
    responseForOptions(res);
  }else if(method === "GET"){
      responseForGet(path, res);
    }else{
      req.on('error', (err) => {
        console.error(err);
      }).on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        if (body.length) {
          payload = JSON.parse(Buffer.concat(body).toString());
        }
        responseWithPayload(method, path, payload, res);
      });

    }

});
server.listen(8081); //the server object listens on port 8081