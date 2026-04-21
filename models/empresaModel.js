const { adminPool } = require("../config/db");

const getEmpresas = async () => {
  const [rows] = await adminPool.query("SELECT * FROM empresas");
  return rows;
};

const getEmpresaById = async (id) => {
  const [rows] = await adminPool.query("SELECT * FROM empresas WHERE id = ?", [id]);
  return rows[0];
};

const getEmpresasByUser = async (userId) => {
  const [rows] = await adminPool.query(`
      SELECT e.*
      FROM empresas e
      JOIN usuario_empresa ue ON e.id = ue.empresa_id
      WHERE ue.usuario_id = ?
    `, [userId]);
  return rows;
};

module.exports = {
  getEmpresas,
  getEmpresaById,
  getEmpresasByUser
};