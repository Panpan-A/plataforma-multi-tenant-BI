const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { ValidationError } = require("../utils/errors");

const createAndLinkUserToEmpresa = async (empresaId, { nombre_corto, nombre_largo, contraseña, rol }) => {
  if (!nombre_corto || !nombre_largo || !contraseña) {
    throw new ValidationError("nombre_corto, nombre_largo y contraseña son requeridos");
  }
  const existing = await userModel.findUserByUsername(nombre_corto);
  if (existing) {
    throw new ValidationError("El nombre de usuario ya existe");
  }
  const hash = await bcrypt.hash(contraseña, 10);
  const userId = await userModel.createUser({
    nombre_corto,
    nombre_largo,
    contraseña: hash,
    rol: rol || "user"
  });
  await userModel.linkUserEmpresa(userId, empresaId);
  return { id: userId, nombre_corto, nombre_largo, rol: rol || "user" };
};

const listUsersByEmpresa = async (empresaId) => {
  return await userModel.getUsersByEmpresa(empresaId);
};

const unlinkUserFromEmpresa = async (userId, empresaId) => {
  await userModel.unlinkUserEmpresa(userId, empresaId);
};

module.exports = {
  createAndLinkUserToEmpresa,
  listUsersByEmpresa,
  unlinkUserFromEmpresa
};

