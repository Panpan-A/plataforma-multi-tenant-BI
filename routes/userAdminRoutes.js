const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const userAdminController = require("../controllers/userAdminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authMiddleware);
router.use(tenantMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/users", userAdminController.listarUsuarios);
router.post(
  "/users",
  [
    body("nombre_corto").notEmpty().withMessage("nombre_corto es requerido"),
    body("nombre_largo").notEmpty().withMessage("nombre_largo es requerido"),
    body("contraseña").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol").optional().isIn(["user", "admin"]).withMessage("rol inválido")
  ],
  validate,
  userAdminController.crearUsuario
);
router.delete("/users/:id", userAdminController.eliminarUsuario);

module.exports = router;

