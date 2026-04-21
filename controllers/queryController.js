const queryService = require("../services/queryService");
const exportService = require("../services/exportService");
const auditService = require("../services/auditService");

const queryModel = require("../models/queryModel");
const { successResponse } = require("../utils/helpers");

const listarConsultas = async (req, res) => {
  const queries = await queryModel.getQueries();
  successResponse(res, queries, "Listado de consultas obtenido");
};

const ejecutarConsulta = async (req, res) => {
  const { queryId } = req.params;
  const { filtros, chart, chartType } = req.body;

  const { config, resultados } = await queryService.processQuery(
    req.tenant.pool, 
    queryId, 
    filtros
  );

  // Registrar log de ejecución de consulta
  await auditService.logActivity(req, 'EXECUTE_QUERY', { 
    queryId, 
    queryName: config.nombre, 
    filtros 
  });

  let response = {
    config,
    resultados
  };

  if (chart) {
    response.chartData = queryService.formatForCharts(resultados, chartType || 'bar');
  }

  res.json(response);
};

const exportarConsultaExcel = async (req, res) => {
  const { queryId } = req.params;
  const { filtros } = req.body;

  const { config, resultados } = await queryService.processQuery(
    req.tenant.pool, 
    queryId, 
    filtros
  );

  const buffer = await exportService.generateExcelBuffer(resultados, config.nombre);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${config.nombre || "reporte"}.xlsx`
  );

  res.send(buffer);
};

module.exports = {
  listarConsultas,
  ejecutarConsulta,
  exportarConsultaExcel
};
