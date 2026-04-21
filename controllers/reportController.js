const reportService = require("../services/reportService");
const { successResponse } = require("../utils/helpers");

const crearReporte = async (req, res) => {
  const id = await reportService.createReport(req.user.userId, req.body);
  successResponse(res, { id, ...req.body }, "Reporte creado", 201);
};

const listarMisReportes = async (req, res) => {
  const reports = await reportService.listUserReports(req.user.userId);
  successResponse(res, reports, "Listado de reportes obtenido");
};

const ejecutarReporte = async (req, res) => {
  const { id } = req.params;
  const result = await reportService.runSavedReport(req.tenant.pool, id, req.user.userId);
  successResponse(res, result, "Reporte ejecutado");
};

const eliminarReporte = async (req, res) => {
  const { id } = req.params;
  await reportService.removeReport(id, req.user.userId);
  successResponse(res, null, "Reporte eliminado");
};

module.exports = {
  crearReporte,
  listarMisReportes,
  ejecutarReporte,
  eliminarReporte
};
