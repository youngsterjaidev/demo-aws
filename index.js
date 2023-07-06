const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const port = process.env.PORT || 3000;

const SERVER_URI = process.env.SERVER_URI || "http://localhost:8080";

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static("public"));

app.get("/get", async (req, res) => {
  let response = await axios.get(`${SERVER_URI}/get`);

  if (response.status === 200) {
    res.json(response.data);
    return;
  }

  res.status(400).json([{ message: "Not Found" }]);
});

app.post("/post", async (req, res) => {
  if (!req.body) {
    res.send("Send Some Data");
    return;
  }

  let response = await axios.post(`${SERVER_URI}/post`, req.body);

  if (response.status === 200) {
    res.json([{ message: "Entered the data into the table" }]);
    return;
  }

  res.status(400).json([{ message: "Not Found" }]);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost${port}`);
});
