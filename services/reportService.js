const reportModel = require("../models/reportModel");
const queryService = require("./queryService");

const createReport = async (userId, data) => {
  return await reportModel.saveReport(userId, data);
};

const listUserReports = async (userId) => {
  return await reportModel.getReportsByUser(userId);
};

const runSavedReport = async (pool, reportId, userId) => {
  const report = await reportModel.getReportById(reportId, userId);
  if (!report) throw new Error("Reporte no encontrado");

  const { config, resultados } = await queryService.processQuery(
    pool,
    report.query_id,
    report.filtros
  );

  let chartData = null;
  if (report.tipo_grafico) {
    chartData = queryService.formatForCharts(resultados, report.tipo_grafico);
  }

  return {
    report_info: {
      nombre: report.nombre,
      tipo_grafico: report.tipo_grafico
    },
    config,
    resultados,
    chartData
  };
};

const removeReport = async (id, userId) => {
  return await reportModel.deleteReport(id, userId);
};

module.exports = {
  createReport,
  listUserReports,
  runSavedReport,
  removeReport
};
