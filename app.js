import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const port = process.env.PORT || 6060;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"), (err) => {
    if (err) {
      res.status(500).send("File not found");
    }
  });
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us10.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;
  const options = {
    method: "post",
    auth: `abidShahriar:${process.env.MAILCHIMP_API_KEY}`,
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "/failure.html"));
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
