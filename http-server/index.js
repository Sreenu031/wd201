const http = require("http");
const args = require("minimist")(process.argv.slice(2));

const fs = require("fs");

const port = args.port;
let registration = "";
let project = "";

fs.readFile("project.html", (err, data) => {
  if (err) {
    throw err;
  }
  project = data;
});

fs.readFile("registration.html", (err, data) => {
  if (err) {
    throw err;
  }
  registration = data;
});

const server = http
  .createServer(function (req, res) {
    const url = req.url;
    res.writeHeader(200, { contentType: "text/html" });
    switch (url) {
      case "/":
        res.write(project);
        res.end();
        break;
      case "/form":
        res.write(registration);
        res.end();
    }
  })
  .listen(port, () => console.log(`server run at ${port}`));
