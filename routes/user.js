const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


//signup page and user signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.userSignUp));

// //signup page
// router.get("/signup",userController.renderSignupForm);

// //user signup and auto login
// router.post("/signup",wrapAsync(userController.userSignUp));

//login page and user login
router.route("/login")
.get(userController.renderLoginPage)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    userController.userLogin);

// //login page
// router.get("/login",userController.renderLoginPage);

// //user login
// router.post("/login", saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
//     userController.userLogin);

//user logout
router.get("/logout",userController.userLogout);

module.exports = router;