const queryModel = require("../models/queryModel");
const { ValidationError, NotFoundError, ForbiddenError } = require("../utils/errors");

/**
 * Valida que el SQL no contenga palabras clave peligrosas
 * para prevenir inyecciones SQL en consultas dinámicas.
 * Se añade validación de comentarios y múltiples sentencias.
 */
const validateSQL = (sql) => {
  const upperSQL = sql.toUpperCase();
  
  // 1. Prohibir múltiples sentencias (punto y coma)
  if (sql.includes(";")) {
    throw new ValidationError("No se permiten múltiples sentencias SQL (uso de ';')");
  }

  // 2. Prohibir comentarios que oculten código
  if (sql.includes("--") || sql.includes("/*")) {
    throw new ValidationError("No se permiten comentarios en las consultas dinámicas");
  }

  // 3. Verificar palabras prohibidas
  const forbiddenKeywords = [
    "DROP", "DELETE", "UPDATE", "INSERT", "TRUNCATE", 
    "ALTER", "CREATE", "RENAME", "GRANT", "REVOKE",
    "EXEC", "EXECUTE", "SHUTDOWN"
  ];
  
  for (const keyword of forbiddenKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`);
    if (regex.test(upperSQL)) {
      throw new ForbiddenError(`Acción no permitida: ${keyword}`);
    }
  }
};

const processQuery = async (pool, queryId, filtros) => {
  const queryConfig = await queryModel.getQueryById(queryId);
  if (!queryConfig) {
    throw new NotFoundError("Consulta no encontrada");
  }

  // Validación de seguridad básica
  validateSQL(queryConfig.query);

  // Mapear filtros dinámicos (filtro1, filtro2, etc.)
  // El frontend envía un objeto: { f1: 'val', f2: 'val' }
  // Y en la BD el query debe tener ? en el orden correcto
  let params = [];
  if (filtros) {
    // Si el query usa nombres como :f1, :f2, podríamos reemplazarlos
    // Por ahora usamos el orden estándar ?
    if (filtros.f1 !== undefined) params.push(filtros.f1);
    if (filtros.f2 !== undefined) params.push(filtros.f2);
    if (filtros.f3 !== undefined) params.push(filtros.f3);
    if (filtros.f4 !== undefined) params.push(filtros.f4);
    if (filtros.f5 !== undefined) params.push(filtros.f5);
  }

  const resultados = await queryModel.executeDynamicQuery(pool, queryConfig.query, params);

  return {
    config: {
      nombre: queryConfig.nombre,
      tipo: queryConfig.tipo,
      filtrosConfig: [queryConfig.filtro1, queryConfig.filtro2, queryConfig.filtro3]
    },
    resultados
  };
};

/**
 * Formatea los datos para Chart.js con soporte para múltiples tipos
 * @param {Array} resultados - Filas de la base de datos
 * @param {String} type - Tipo de gráfico (bar, line, pie, doughnut)
 */
const formatForCharts = (resultados, type = 'bar') => {
  const labels = resultados.map(r => r.etiqueta || r.nombre || Object.values(r)[0]);
  const data = resultados.map(r => r.valor || r.importe || Object.values(r)[1] || 0);

  // Colores aleatorios para pie/doughnut o uno fijo para bar/line
  const backgroundColors = type === 'pie' || type === 'doughnut' 
    ? labels.map(() => `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`)
    : 'rgba(54, 162, 235, 0.5)';

  const borderColors = type === 'pie' || type === 'doughnut'
    ? backgroundColors.map(c => c.replace('0.6', '1'))
    : 'rgba(54, 162, 235, 1)';

  return {
    type,
    data: {
      labels,
      datasets: [{
        label: 'Resultados',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
        fill: type === 'line' // Rellenar área si es gráfico de líneas
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Visualización de Datos' }
      }
    }
  };
};

module.exports = {
  processQuery,
  formatForCharts,
  validateSQL
};
