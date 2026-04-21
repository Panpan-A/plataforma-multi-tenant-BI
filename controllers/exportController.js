const exportService = require("../services/exportService");

const exportarExcel = async (req, res) => {
  const { data, filename } = req.body;

  try {
    const buffer = await exportService.generateExcelBuffer(data, "Reporte");

    // Configurar respuesta HTTP
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename || "reporte"}.xlsx`
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error exportando a Excel:", error.message);
    res.status(500).json({ error: error.message || "Error al generar el archivo Excel" });
  }
};

module.exports = {
  exportarExcel
};
