const { successResponse } = require("../utils/helpers");
const userService = require("../services/userService");
const auditService = require("../services/auditService");

const listarUsuarios = async (req, res) => {
  const users = await userService.listUsersByEmpresa(req.tenant.id);
  successResponse(res, users, "Usuarios de la empresa obtenidos");
};

const crearUsuario = async (req, res) => {
  const payload = req.body;
  const user = await userService.createAndLinkUserToEmpresa(req.tenant.id, payload);
  await auditService.logActivity(req, "CREATE_USER", { userId: user.id, nombre_corto: user.nombre_corto });
  successResponse(res, user, "Usuario creado y vinculado a la empresa", 201);
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  await userService.unlinkUserFromEmpresa(id, req.tenant.id);
  await auditService.logActivity(req, "DELETE_USER", { unlinkedUserId: id });
  successResponse(res, null, "Usuario desvinculado de la empresa");
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  eliminarUsuario
};

