const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

// Todas las rutas de reportes requieren autenticación
router.use(authMiddleware);

// Rutas administrativas de reportes (listado y creación)
router.get("/", reportController.listarMisReportes);
router.post("/", reportController.crearReporte);
router.delete("/:id", reportController.eliminarReporte);

// Ejecución de un reporte guardado (requiere tenant)
router.get("/ejecutar/:id", tenantMiddleware, reportController.ejecutarReporte);

module.exports = router;
