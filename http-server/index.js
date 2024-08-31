const http = require("http");
const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");
const port = args.port;

const server = http
  .createServer((req, res) => {
    let url = req.url;

    if (url == "/") {
      fs.readFile(path.join(__dirname, "home.html"), (err, data) => {
        if (err) {
          throw err;
        } else {
          res.writeHeader(200, { contentType: "text/html" });
          res.write(data);
          res.end();
        }
      });
    } else if (url == "/project") {
      fs.readFile(path.join(__dirname, "project.html"), (err, data) => {
        if (err) {
          throw err;
        } else {
          res.writeHeader(200, { contentType: "text/html" });
          res.write(data);
          res.end();
        }
      });
    }
    if (url == "/registration") {
      fs.readFile(path.join(__dirname, "registration.html"), (err, data) => {
        if (err) {
          throw err;
        } else {
          res.writeHeader(200, { contentType: "text/html" });
          res.write(data);
          res.end();
        }
      });
    }
  })
  .listen(port, () => console.log(`server run at ${port}`));
