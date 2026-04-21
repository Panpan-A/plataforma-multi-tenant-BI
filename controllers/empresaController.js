const empresaModel = require("../models/empresaModel");
const { successResponse } = require("../utils/helpers");

const obtenerEmpresas = async (req, res) => {
  const empresas = await empresaModel.getEmpresas();
  successResponse(res, empresas, "Empresas obtenidas");
};

const obtenerMisEmpresas = async (req, res) => {
  const empresas = await empresaModel.getEmpresasByUser(req.user.userId);
  successResponse(res, empresas, "Mis empresas obtenidas");
};

const obtenerDatosEmpresa = async (req, res) => {
  // Ejemplo de cómo usar el pool del tenant
  const [rows] = await req.tenant.pool.query("SELECT * FROM empresas LIMIT 1");
  successResponse(res, {
    contexto: req.tenant.nombre,
    datos: rows[0]
  }, "Datos del tenant obtenidos");
};

module.exports = {
  obtenerEmpresas,
  obtenerMisEmpresas,
  obtenerDatosEmpresa
};