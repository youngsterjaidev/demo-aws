require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;

// connection to the RDS
const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: "mydb",
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.connect((err) => {
  if (err) {
    console.log(
      "Error occured while establishing the connection with database",
      err
    );
    return;
  }

  console.log("Database connected sucessfully!");

  app.get("/", (req, res) => {
    res.send("Hello from the server");
  });

  app.get("/createDB", (req, res) => {
    connection.query("CREATE DATABASE mydb", (error, results, fields) => {
      if (error) throw error;

      console.log("The Database created: ", results, fields);
      res.send("Database created");
    });
  });

  app.get("/createTable", (req, res) => {
    connection.query(
      "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))",
      (error, results, fields) => {
        if (error) throw error;

        console.log("The Table created: ", results, fields);
        res.send("Table created");
      }
    );
  });

  app.get("/get", (req, res) => {
    connection.query("SELECT * FROM customers", (error, results, fields) => {
      if (error) throw error;

      console.log("The result: ", results, fields);
      res.json(results);
    });
  });

  app.post("/post", (req, res) => {
    if (!req.body) {
      res.send("Send Some Data");
      return;
    }

    const { name, address } = req.body;
    connection.query(
      `INSERT INTO customers (${name}, ${address}) VALUES ('Company Inc', 'Highway 37')`,
      (error, results, fields) => {
        if (error) throw error;

        console.log("The result: ", results, fields);
        res.send("Entered the data into the table");
      }
    );
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
