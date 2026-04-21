const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Middleware para manejar errores de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/login",
  [
    body("nombre_corto").notEmpty().withMessage("El nombre de usuario es requerido"),
    body("contraseña").notEmpty().withMessage("La contraseña es requerida"),
  ],
  validate,
  authController.login
);

// Ejemplo de ruta solo para admins
router.get(
  "/admin-only",
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => res.json({ message: "Hola Admin" })
);

module.exports = router;