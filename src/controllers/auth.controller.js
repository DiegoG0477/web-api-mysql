const User = require("../models/user.model");

const signUp = async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: await User.encryptPassword(req.body.password),
      nombre: req.body.nombre,
      apellidoPat: req.body.apellidoPat,
      apellidoMat: req.body.apellidoMat,
      fechaNacimiento: req.body.fechaNacimiento,
    };

    const found = await User.findUser(user.email);
    const id = found.id;

    if (id > 0) {
      return res.status(400).json({
        message: "el usuario ya esta existe",
      });
    } else {
      await User.createUser(user);
      const foundNewUser = await User.findUser(user.email);
      const idToken = foundNewUser.id;
      const token = User.getToken(idToken);

      return res.status(201).json({
        message: "usuario creado correctamente",
        id: idToken,
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error al crear el usuario",
      error: error,
    });
  }
};

const signIn = async (req, res) => {
  const userFound = await User.findUser(req.params.email);
  const matchPassword = await User.comparePassword(userFound.password, req.params.password);

  if (!userFound) {
    return res.status(200).json({
      message: "email o contraseña incorrecta",
    });
  } else if (!matchPassword) {
    return res.status(200).json({
      message: "email o contraseña incorrectaa",
    });
  } else {
    console.log(userFound.id);
    const token = User.getToken(userFound.id);

    res.setHeader("SetCookie", token);
    return res.status(200).json({
        message: "inicio de sesion correcto",
        token:token,
      });
  }
};

module.exports = {
  signUp,
  signIn,
};
