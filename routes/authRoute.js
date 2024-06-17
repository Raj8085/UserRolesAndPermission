const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authmiddleware");
const authController = require("../controllers/authController");
const {registerValidator,loginValidator} = require("../helpers/validator");

router.post("/register",registerValidator,authController.registerUser);
router.post("/login",loginValidator,authController.loginUser);

//authenticated routes

router.get("/profile",auth,authController.getProfile);
router.get("/refresh-permissions",auth,authController.getUserPermission);

module.exports = router;