const queryService = require("./queryService");

/**
 * Servicio para gestionar la lógica de dashboards complejos.
 * Permite ejecutar múltiples consultas para una sola vista de dashboard.
 */
const getDashboardData = async (pool, queryIds, filtros) => {
  const dashboardData = {
    widgets: [],
    lastUpdated: new Date()
  };

  for (const queryId of queryIds) {
    try {
      const { config, resultados } = await queryService.processQuery(pool, queryId, filtros);
      
      dashboardData.widgets.push({
        id: queryId,
        nombre: config.nombre,
        tipo: config.tipo,
        datos: resultados,
        chartData: queryService.formatForCharts(resultados, config.tipo_grafico || 'bar')
      });
    } catch (error) {
      console.error(`Error al cargar widget ${queryId} del dashboard:`, error.message);
      dashboardData.widgets.push({
        id: queryId,
        error: `No se pudo cargar: ${error.message}`
      });
    }
  }

  return dashboardData;
};

/**
 * Obtiene KPIs rápidos para un resumen ejecutivo.
 * Esto es personalizable según las tablas del tenant.
 */
const getQuickKPIs = async (pool) => {
  // Ejemplo: Conteo de clientes, productos y últimas operaciones
  const [clientes] = await pool.query("SELECT COUNT(*) as total FROM clientes WHERE activo = 1");
  const [productos] = await pool.query("SELECT COUNT(*) as total FROM productos WHERE activo = 1");
  const [operaciones] = await pool.query("SELECT COUNT(*) as total FROM operaciones");
  
  return {
    total_clientes: clientes[0].total,
    total_productos: productos[0].total,
    total_operaciones: operaciones[0].total
  };
};

module.exports = {
  getDashboardData,
  getQuickKPIs
};
