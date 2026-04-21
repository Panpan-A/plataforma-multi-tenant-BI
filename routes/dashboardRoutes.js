const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

// Todas las rutas de dashboard requieren autenticación y contexto de empresa
router.use(authMiddleware);
router.use(tenantMiddleware);

// GET para resumen rápido (KPIs)
router.get("/resumen", dashboardController.obtenerResumenKpis);

// POST para obtener datos de múltiples widgets
router.post("/widgets", dashboardController.obtenerWidgetsDashboard);

module.exports = router;
