require("./config/connection");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes");
const configEnv = require("./config/env");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
// app.use(
//   "/assets/images/teams",
//   express.static(path.join(__dirname, "assets/images/teams"), {
//     // maxAge: '365d',
//     // setHeaders(res, path) {
//     //   if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json)$/)) {
//     //     setLongTermCache(res);
//     //   }
//     // },
//   })
// );
// app.use(
//   "/assets/images/website/home",
//   express.static(path.join(__dirname, "assets/images/website/home"), {
//     // maxAge: '365d',
//     // setHeaders(res, path) {
//     //   if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json)$/)) {
//     //     setLongTermCache(res);
//     //   }
//     // },
//   })
// );

app.use(
  "/assets/images/",
  express.static(path.join(__dirname, "assets/images/"), {
    // maxAge: '365d',
    // setHeaders(res, path) {
    //   if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json)$/)) {
    //     setLongTermCache(res);
    //   }
    // },
  })
);

app.use(routes);

app.listen(configEnv.server.port, () => {
  console.log("Environment :", process.env.NODE_ENV);
  console.log(`Server running on port ${configEnv.server.port}`);
});
