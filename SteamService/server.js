const http = require('http');
const axios = require('axios');

//create a server object:
let server = http.createServer(function (req, res) {

    let {method, url: path} = req;
    let body = [];
    let payload = {};
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        if(body.length) {
            payload = JSON.parse(Buffer.concat(body).toString());
        }
        console.log(method, path);
        console.log(JSON.stringify(payload));

        axios({
            method,
            url: 'http://api.steampowered.com' + path,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then((response) => {
            console.log("STEAM RESPONSE => ", JSON.stringify(response.data));
            res.write(JSON.stringify(response.data)); //write a response to the client
            res.end(); //end the response
        });
    });


});
server.listen(8081); //the server object listens on port 8081