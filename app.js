import express from "express";
import bodyParser from "body-parser"; // Only include if you're using it
import path from "path";
import { fileURLToPath } from "url"; // Required to define __dirname
import https from "https";

const port = 6060;
const app = express();

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html file
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
  const jasonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/f18b05dfbe";
  const Option = {
    method: "post",
    auth: "abidShahriar:c03236e8db8982d948056287b0deb821-us10",
  };

  const request = https.request(url, Option, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "/failure.html"));
    }
  });

  request.write(jasonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Api Key
// c03236e8db8982d948056287b0deb821-us10
// list id
// f18b05dfbe
