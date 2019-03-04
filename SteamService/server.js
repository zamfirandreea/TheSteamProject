const http = require('http');
const axios = require('axios');

const STEAM_API_BASE_URL = 'http://api.steampowered.com';
const PORT= 8081;

const respondForTestEndpoint = res => {
  console.log("Test endpoint called!");
  res.write(JSON.stringify({
    status: "SERVER UP!"
  }));
  res.end();
};

const respondForOptions= res => {
  console.log("OPTIONS endpoint called!");
  res.write(JSON.stringify({
    status: "Options Call detected!"
  }));
  res.end();
};

const respondWithError = (error, res) => {
  console.log("error =>", JSON.stringify(error.message));
  res.statusCode = error.response.status;
  res.statusMessage = error.response.statusText;
  res.end();
};

const respondForGet = (path, res) => {
  console.log("GET endpoint called!");

  axios({
    method: "GET",
    url: STEAM_API_BASE_URL + path,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  }).then((response) => {
    console.log("STEAM RESPONSE => ", JSON.stringify(response.data));
    res.write(JSON.stringify(response.data));
    res.end();
  }).catch(error => respondWithError(error, res));
};

const respondWithPayload = (method, path, payload, res) => {

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
  }).catch(error => respondWithError(error, res));

};

//create a server object:
const server = http.createServer(function (req, res) {

  console.log("Service called!");
  let {method, url: path} = req;
  let body = [];
  let payload = {};

  console.log({method, path});

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (method === "GET" && path === "/test") {
    respondForTestEndpoint(res);
  } else if (method === "OPTIONS") {
    respondForOptions(res);
  } else if (method === "GET") {
    respondForGet(path, res);
  } else {
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      if (body.length) {
        payload = JSON.parse(Buffer.concat(body).toString());
      }
      respondWithPayload(method, path, payload, res);
    });

  }

});
server.listen(PORT);