const express = require('express');
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");

router.get("/users/signup", userController.signup);
router.post("/users/create", validation.validateUsers, userController.create);

module.exports = router;