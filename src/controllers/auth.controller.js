const User = require("../models/user.model");

const signUp = async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: await User.encryptPassword(req.body.password),
            nombre: req.body.nombre,
            apellidoPat: req.body.apellidoPat,
            apellidoMat: req.body.apellidoMat,
        };

        const found = await User.find(user.email);
        
        if (found) {
            return res.status(400).json({
                message: "el usuario ya esta existe",
            });
        } else {
            const createdUser = await User.create(user);

            return res.status(201).json({
                message: "usuario creado correctamente",
                data: createdUser,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "error al crear el usuario",
            error: error,
        });
    }
};

const login = async (req, res) => {
    const userFound = await User.find(req.params.email);
    const matchPassword = await User.comparePassword(
        userFound.password,
        req.params.password
    );

    if (!userFound) {
        return res.status(200).json({
            message: "email o contraseña incorrecta",
        });
    } else if (!matchPassword) {
        return res.status(200).json({
            message: "email o contraseña incorrectaa",
        });
    } else {
        const token = User.getToken(userFound.id_usuario);

        return res.status(200).json({
            message: "inicio de sesion correcto",
            token: token,
        });
    }
};

module.exports = {
    signUp,
    login,
};
