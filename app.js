const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 5000;

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_restapi',
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});