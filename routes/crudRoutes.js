const express = require("express");
const router = express.Router();

const genericCRUD = require("../controllers/crudController");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

// Middleware común
router.use(authMiddleware);
router.use(tenantMiddleware);

// Rutas para Clientes
const clientesCRUD = genericCRUD("clientes", ["codigo", "nombre"]);
router.get("/clientes", clientesCRUD.obtenerTodos);
router.get("/clientes/:id", clientesCRUD.obtenerPorId);
router.post("/clientes", clientesCRUD.crear);
router.put("/clientes/:id", clientesCRUD.actualizar);
router.delete("/clientes/:id", clientesCRUD.eliminar);

// Rutas para Productos
const productosCRUD = genericCRUD("productos", ["codigo", "nombre"]);
router.get("/productos", productosCRUD.obtenerTodos);
router.get("/productos/:id", productosCRUD.obtenerPorId);
router.post("/productos", productosCRUD.crear);
router.put("/productos/:id", productosCRUD.actualizar);
router.delete("/productos/:id", productosCRUD.eliminar);

module.exports = router;
