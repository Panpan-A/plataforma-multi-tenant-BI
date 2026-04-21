const ExcelJS = require("exceljs");

/**
 * Genera un buffer de un archivo Excel a partir de un array de objetos
 * @param {Array} data - Lista de objetos (filas) a exportar
 * @param {String} sheetName - Nombre de la pestaña de Excel
 * @returns {Promise<Buffer>} - Buffer del archivo Excel
 */
const generateExcelBuffer = async (data, sheetName = "Datos") => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // 1. Configurar columnas dinámicamente basadas en el primer objeto
  const columns = Object.keys(data[0]).map(key => ({
    header: key.toUpperCase(),
    key: key,
    width: 20
  }));
  worksheet.columns = columns;

  // 2. Estilo para la cabecera
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2F5597' } // Azul oscuro
  };

  // 3. Añadir los datos
  worksheet.addRows(data);

  // 4. Estilo de bordes para todas las celdas
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  generateExcelBuffer
};
