const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

router.get("/userProfile", isLoggedIn, (req, res, next) => {
  res.render("user-profile", { userInSession: req.session.currentUser });
});

module.exports = router;
