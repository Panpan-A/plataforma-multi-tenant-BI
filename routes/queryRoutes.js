const express = require("express");
const router = express.Router();

const queryController = require("../controllers/queryController");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

// Todas las consultas dinámicas requieren autenticación y contexto de empresa
router.use(authMiddleware);
router.use(tenantMiddleware);

// Listar todas las consultas disponibles
router.get("/", queryController.listarConsultas);

// POST para pasar filtros complejos en el body
router.post("/ejecutar/:queryId", queryController.ejecutarConsulta);

// POST para exportar el resultado de una consulta a Excel
router.post("/exportar/:queryId", queryController.exportarConsultaExcel);

module.exports = router;
