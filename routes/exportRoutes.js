const express = require("express");
const router = express.Router();

const exportController = require("../controllers/exportController");
const authMiddleware = require("../middleware/authMiddleware");

// La exportación requiere autenticación pero no necesariamente contexto de empresa
// si los datos ya vienen en el body
router.use(authMiddleware);

router.post("/excel", exportController.exportarExcel);

module.exports = router;
