const createError = require("http-errors"); // for development
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
// const csurf = require("csurf");	// consider the cases where cors is required, and remove cors itself if not really required
// const cparser = require("cookie-parser");
const { join } = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Just loads environment variables from .env file, into the process.env object of node

const indexRouter = require("./routes/index");
const sihJ20Router = require("./apis/sihJ20/app");
const doistRouter = require("./apis/doist15/app");
const utilRouter = require("./apis/util/app");
const ludoRouter = require("./apis/ludo/app");
const eduRouter = require("./apis/eduPurpose/app");
// const shortenRouter = require("./apis/shorten/app");
const tempDown = require("./routes/tempDown");
const app = express();

/**
 * @note -> In your own deployment, you should likely increase the rateLimit,
 * 			currently it's 100 requests per 30 minutes for the public deployment linked in README
 */
app.use(rateLimit({
	windowMs: 30 * 60000,
	max: 100,
	message: "The api usage is limited for public use currently, read the @note above"
}));

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
// app.use(csurf({cookie: true}));	// misconfigured csurf
// {	// by default ["GET", "HEAD", "OPTIONS"] methods are ignored
// 	// httpOnly: true,
// 	// secure: true,
// }
// app.use(cparser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

express.static( join(__dirname, "public") );
app.use("/", indexRouter);
app.use("/sihJ20", sihJ20Router);
app.use("/doist15", doistRouter);
app.use("/util", utilRouter);
app.use("/ludo", ludoRouter);
app.use("/edu", tempDown);	// working, but intentionally down
app.use("/shorten", tempDown);
app.use("/gh", tempDown);
app.use("/bookmarker", tempDown);

app.get("/useFire", (req, res) => {
	// Set the api to use firebase for this session
	// QUESTION -> What are the useful uses of a 'session' in a completely backend setup ??

	process.env.USE_FIREBASE = true;
	res.sendStatus(204);
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.code + " - " + err.message;
	res.locals.error = req.app.get("env") !== "production" ? err : {};
	console.error(`Error, Code - ${err.code} and Message - ${err.message}`);

	// render the error page
	res.sendStatus(err.status || 500);
});

module.exports = app;
