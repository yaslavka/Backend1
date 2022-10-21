require("dotenv").config();
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const sequelize = require("./db");
const PORT = process.env.PORT || 80;
const PORTS = process.env.PORTS || 443;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const app = express();
const privateKey = fs.readFileSync("/etc/letsencrypt/live/xlife.host/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/xlife.host/cert.pem", "utf8");
const ca = fs.readFileSync("/etc/letsencrypt/live/xlife.host/chain.pem", "utf8");
const credentials = {key: privateKey, cert: certificate, ca: ca,};

app.use(cors());
app.use(express.json());
app.use("/api/user", express.static(path.resolve(__dirname, "files", "images")));
app.use(fileUpload({}));
app.use("/api", router);
app.use(express.static(path.resolve(__dirname, "files")))
app.use(ErrorHandlingMiddleware);

const start = async () => {
  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    httpServer.listen(PORT, () => console.log(`server started on port ${PORT}`));
    httpsServer.listen(PORTS, () => console.log(`server started on port ${PORTS}`));
    // app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
  } catch (error) {
    console.log(error);
  }
};

start();
