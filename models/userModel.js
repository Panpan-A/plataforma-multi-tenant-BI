const { adminPool } = require("../config/db");

const findUserByUsername = async (nombre_corto) => {
  const [rows] = await adminPool.query(
    "SELECT * FROM usuarios WHERE nombre_corto = ?",
    [nombre_corto]
  );
  return rows[0];
};

const createUser = async ({ nombre_corto, nombre_largo, contraseña, rol = 'user' }) => {
  const [result] = await adminPool.query(
    "INSERT INTO usuarios (nombre_corto, nombre_largo, contraseña, rol) VALUES (?, ?, ?, ?)",
    [nombre_corto, nombre_largo, contraseña, rol]
  );
  return result.insertId;
};

const getUsersByEmpresa = async (empresaId) => {
  const [rows] = await adminPool.query(
    `SELECT u.id, u.nombre_corto, u.nombre_largo, u.rol
     FROM usuarios u
     JOIN usuario_empresa ue ON ue.usuario_id = u.id
     WHERE ue.empresa_id = ?`,
    [empresaId]
  );
  return rows;
};

const linkUserEmpresa = async (userId, empresaId) => {
  await adminPool.query(
    "INSERT IGNORE INTO usuario_empresa (usuario_id, empresa_id) VALUES (?, ?)",
    [userId, empresaId]
  );
  return true;
};

const unlinkUserEmpresa = async (userId, empresaId) => {
  await adminPool.query(
    "DELETE FROM usuario_empresa WHERE usuario_id = ? AND empresa_id = ?",
    [userId, empresaId]
  );
  return true;
};

module.exports = {
  findUserByUsername,
  createUser,
  getUsersByEmpresa,
  linkUserEmpresa,
  unlinkUserEmpresa
};
