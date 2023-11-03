const express= require("express");
const router = express.Router();
const usersController = require('../../controllers/users.controller');

//visualizar lista de usuarios
router.get("/",usersController.index);

module.exports = router;