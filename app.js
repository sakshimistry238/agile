const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser"); 
const jmEzMySql = require("jm-ez-mysql");
const dotenv = require("dotenv");
const cors = require("cors");
const adminRoute = require("./routes/adminroutes")
const middleware = require("./authenticate")
dotenv.config();
jmEzMySql.init({
    acquireTimeout: 300,
    connectTimeout: 300,
    connectionLimit: 100,
    database: process.env.SQL_DATABASE,
    dateStrings: true,
    host: process.env.SQL_SERVER,
    multipleStatements: true,
    password: process.env.SQL_PASSWORD,
    timeout: 300,
    timezone: "utc",
    charset : "utf8mb4",
    user: process.env.SQL_USER,
});
app.use(bodyParser.json());
app.use("/admin",adminRoute)
app.use("/authenticate",middleware)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});