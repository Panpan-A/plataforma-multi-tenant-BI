const express = require("express");
const router = express.Router();

const auditController = require("../controllers/auditController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Solo los administradores pueden ver los logs de auditoría
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get("/", auditController.obtenerLogs);

module.exports = router;
