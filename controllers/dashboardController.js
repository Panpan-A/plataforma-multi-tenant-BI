const dashboardService = require("../services/dashboardService");
const { successResponse } = require("../utils/helpers");

const obtenerResumenKpis = async (req, res) => {
  const kpis = await dashboardService.getQuickKPIs(req.tenant.pool);
  successResponse(res, kpis, "KPIs de resumen obtenidos");
};

const obtenerWidgetsDashboard = async (req, res) => {
  const { queryIds, filtros } = req.body; // queryIds: [1, 2, 3], filtros: { f1: 'val' }
  
  if (!queryIds || !Array.isArray(queryIds)) {
    throw new Error("Se requiere un array de IDs de consulta");
  }

  const dashboard = await dashboardService.getDashboardData(req.tenant.pool, queryIds, filtros);
  successResponse(res, dashboard, "Datos del dashboard obtenidos");
};

module.exports = {
  obtenerResumenKpis,
  obtenerWidgetsDashboard
};
