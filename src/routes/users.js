const express = require('express');
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");

router.get("/users/signup", userController.signup);
router.post("/users/create", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);
router.post("/users/upgrade", userController.upgrade);
router.post("/users/downgrade", userController.downgrade);
router.get("/users/:id/wikis", userController.wikis);

module.exports = router;