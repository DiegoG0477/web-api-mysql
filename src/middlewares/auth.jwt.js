const User = require("../models/user.model");

const verifyToken = async (req, res, next) => {
  try{
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({
        message: "no se proporcionó un token",
      });
    }

    const decoded = await User.verifyToken(token);
    req.userId = decoded.id;

    const user = User.findUser(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "usuario no encontrado",
      });
    }
    
    next();
  }catch(error){
    return res.status(401).json({
      message: "No autorizado",
    });
  };
}
  module.exports = {
    verifyToken,
  };
  