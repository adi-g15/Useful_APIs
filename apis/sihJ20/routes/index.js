const express = require("express");
const router = express.Router();

// eslint-disable-next-line no-unused-vars
const notifModel = require("../models/schema/notifSchema");

/* LEARNT -> However you modify req.method, or send post request to this route... res.redirect() will change the req object, and it will ALWAYS be a GET request */

router.get("/", function (req, res, next) {
	next();
});

module.exports = router;
