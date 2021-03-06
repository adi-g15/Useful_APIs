const indexRouter = require("./routes/index");
const psRouter = require("./routes/ps");
const hacksRouter = require("./routes/hack");

const router = require("express").Router();

/**
 *  @note @learnt @me ->
 *   Note that the app.set() function has been called here,
 *   So, if i route a form in an html, viewed through view folder, then it will think it base url,
 *   as, the base route of this express.app ('/sihJ20'),
 *   so, if i render a view 'probs' in psRouter (ie. different file, on '/sihJ20/ps'),
 *   and that form submits to '/add', then... it will post to /sihJ20 + /add,
 *   ie. the view thinks, that this app has rendered it (or whatever it thinks, similar to this)
 *
 */
router.use("/", indexRouter);
router.use("/ps", psRouter);
router.use("/hacks", hacksRouter);

module.exports = router;
