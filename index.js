/** @format */

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require("./routes/routes.js")(app);

app.get("/", (req, res) => {
	res.json("Welcome to CODI APIs.");
});

app.listen(3000, () => {
	console.log("Server is listening on port 3000!");
});
