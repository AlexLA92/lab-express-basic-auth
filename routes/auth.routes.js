const router = require("express").Router();
const User = require("../models/User.model.js");

const bcryptjs = require("bcrypt");
//const session = require("express-session");
const saltRounds = 10;

/* SIGNUP*/
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Test 1 : does username exists ?
    user = await User.findOne({ username: username });
    if (user) {
      res.render("auth/signup", { errorMessage: "Username already exists" });
    }

    // Test 2 : is password longer than 8 characters ?
    if (password.length <= 8) {
      res.render("auth/signup", {
        errorMessage: "Password length must be greater than 8",
      });
    }

    const newUser = {
      username,
      password: hashedPassword,
    };

    newUserDoc = await User.create(newUser);
    console.log("Newly created user is: ", newUserDoc);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

/* LOGIN */
router.get("/login", (req, res, next) => {
  const originUrl = req.query.originUrl;
  res.render("auth/login", { originUrl });
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password, originUrl } = req.body;

    console.log("SESSION =====> ", req.session);

    // Test 1 : does username exists ?
    user = await User.findOne({ username: username });
    if (!user) {
      res.render("auth/login", { errorMessage: "Username does not exists" });
    }

    // Test 2 : is password longer than 8 characters ?
    if (password.length <= 8) {
      res.render("auth/signup", {
        errorMessage: "Password length must be greater than 8 anyway",
      });
    }

    result = await bcryptjs.compareSync(password, user.password);

    if (!result) {
      res.render("auth/signup", {
        errorMessage: "Password is not right",
      });
    }

    req.session.currentUser = user;

    if (originUrl) {
      console.log("try to render private page");
      res.redirect(originUrl);
    }

    res.render("user-profile", { userInSession: req.session.currentUser });

    //req.session.currentUser = user;
  } catch (error) {
    next(error);
  }
});

/* LOGOUT */
router.get("/logout", async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
