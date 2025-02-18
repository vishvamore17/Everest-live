const passport = require('passport')
const express = require('express');
const userController = require("../../../controller/user.controller")
const router = express.Router();
require("../../../utils/provider"); // Ensure Passport config is loaded

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-email', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/logout', userController.logout);
router.delete('/delete-account', userController.deleteAccount);

// router.post('/token', refreshToken);
// // 🔹 Google OAuth Routes
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("/Dashboard"); // Redirect to dashboard after successful login
//   }
// );

module.exports = router;