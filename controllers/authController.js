const authService = require("../services/authService");
const auditService = require("../services/auditService");

const login = async (req, res) => {
  const { nombre_corto, contraseña } = req.body;

  const { token, user } = await authService.authenticate(nombre_corto, contraseña);
  
  // Registrar log de login exitoso
  await auditService.logActivity({ user, ip: req.ip }, 'LOGIN', `Usuario ${user.nombre} inició sesión`);
  
  res.json({ token, user });
};

module.exports = { login };
