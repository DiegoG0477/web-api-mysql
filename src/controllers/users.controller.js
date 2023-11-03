const User = require("../models/user.model");

const index = async (req, res) => {
  try{
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const users = await User.getAll(limit, offset);

    let response = {
        message: "se obtuvieron correctamente los usuarios",
        data: users
    }

    if (page && limit) {
        const totalUsuarios = await User.count();
        const totalPages = Math.ceil(totalUsuarios / limit);

        response = {
            ...response,
            total: totalUsuarios,
            totalPages,
        }
    }
  } catch (err) {
    return res.status(500).json({
      message: "error obteniendo los usuarios",
      error: err,
    });
  }
};

const createUser = async (user, res) => {
  try {
    await User.createUser(user);

    return res.status(201).json({
      message: "usuario creado correctamente",
    });
  } catch (err) {
    return res.status(500).json({
      message: "error creando el usuario",
      error: err,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.deleteUser(id);

    return res.status(200).json({
      message: "usuario eliminado correctamente",
    });
  } catch (err) {
    return res.status(500).json({
      message: "error eliminando el usuario",
      error: err,
    });
  }
}

module.exports = {
  index,
  deleteUser,
};