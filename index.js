require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const port = process.env.PORT || 3000;

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: process.env.REGION,
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static("public"));

(async () => {
  let secretsResponse = await client.send(
    new GetSecretValueCommand({
      SecretId: process.env.SECRET_ID,
      VersionStage: "AWSCURRENT",
    })
  );

  if (!secretsResponse) {
    console.log(
      "Error Occured while retriving the secrets from secret Manager "
    );
    return;
  }

  const { serverUri } = JSON.parse(secretsResponse.SecretString);

  const SERVER_URI = serverUri || "http://localhost:8080";

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
})();
