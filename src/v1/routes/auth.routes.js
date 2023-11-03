const express= require("express");
const router = express.Router();
const authController = require('../../controllers/auth.controller');

//obtener id de inicio de sesion
router.get("/:email/:password", authController.signIn);
//Registro de un usuario usuario
router.post('/', authController.signUp);

module.exports = router;