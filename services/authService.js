const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { AuthError } = require("../utils/errors");

const authenticate = async (nombre_corto, contraseña) => {
  const user = await userModel.findUserByUsername(nombre_corto);

  if (!user) {
    throw new AuthError("Credenciales inválidas");
  }

  const valid = await bcrypt.compare(contraseña, user.contraseña);

  if (!valid) {
    throw new AuthError("Credenciales inválidas");
  }

  const token = jwt.sign(
    { 
      userId: user.id, 
      rol: user.rol || 'user' // Por defecto 'user' si no hay rol en la BD
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { 
    token, 
    user: { 
      id: user.id, 
      nombre: user.nombre_corto, 
      rol: user.rol || 'user' 
    } 
  };
};

module.exports = {
  authenticate
};
