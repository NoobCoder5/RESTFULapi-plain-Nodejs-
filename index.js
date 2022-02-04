const http = require("http");
const url = require("url");
const fs = require("fs");
const https = require("https");
const { StringDecoder } = require("string_decoder");
const config = require("./lib/config.js");
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});
const handlers = require("./lib/handlers.js");
httpServer.listen(config.httpPort, function () {
  console.log(
    `server is running on port ${config.httpPort} in ${config.envName} `
  );
});
const httpsServerOptions = {
  key: fs.readFileSync("https/key.pem"),
  cert: fs.readFileSync("https/cert.pem"),
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, function () {
  console.log(
    `server is running on port ${config.httpsPort} in ${config.envName} `
  );
});
const unifiedServer = function (req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  // console.log(trimmedPath);
  const method = req.method;
  const queryStringObject = parsedUrl.query;
  const headers = req.headers;
  // console.log(queryStringObject);
  // console.log(queryStringObject);
  let body = [];
  var decoder = new StringDecoder("utf-8");
  var buffer = "";

  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  // console.log(req.headers);
  req.on("end", function () {
    // console.log(buffer);
    buffer += decoder.end();
    // console.log(buffer);
    if (method == "POST" || method == "PUT") {
      var data = {
        trimmedPath: trimmedPath,
        queryStringObject: queryStringObject,
        method: method,
        headers: headers,
        payload: JSON.parse(buffer),
      };
    } else {
      var data = {
        trimmedPath: trimmedPath,
        queryStringObject: queryStringObject,
        method: method,
        headers: headers,
      };
    }

    const choosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    choosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof payload == "object" ? payload : {};
      var payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
    // console.log("Request received with this payload: ", buffer);
  });
};

const router = {
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};
