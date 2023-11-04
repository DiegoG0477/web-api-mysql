const express= require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get("/:email/:password", authController.login);
router.post('/', authController.signUp);

module.exports = router;