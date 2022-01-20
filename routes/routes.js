/** @format */

module.exports = (app) => {
	const user = require("../controllers/controller.js");
	app.get("/getaccount", user.getaccount);
};
