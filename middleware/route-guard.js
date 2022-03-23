const isLoggedIn = (req, res, next) => {
  console.log("Origin url", req.originalUrl);
  if (!req.session.currentUser) {
    return res.redirect(`/auth/login?originUrl=${req.originalUrl}`);
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
