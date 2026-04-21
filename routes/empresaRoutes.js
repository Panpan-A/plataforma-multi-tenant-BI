const express = require("express");
const router = express.Router();

const empresaController = require("../controllers/empresaController");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

// Todas las rutas de empresas requieren autenticación
router.use(authMiddleware);

router.get("/", empresaController.obtenerEmpresas);
router.get("/mis-empresas", empresaController.obtenerMisEmpresas);

// Ejemplo de ruta que usa el contexto de empresa
router.get("/info", tenantMiddleware, empresaController.obtenerDatosEmpresa);

module.exports = router;