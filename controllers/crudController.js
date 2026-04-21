const baseService = require("../services/baseService");
const auditService = require("../services/auditService");
const { successResponse } = require("../utils/helpers");

const genericCRUD = (table, requiredFields = []) => {
  const service = baseService.processCRUD(table, requiredFields);

  return {
    obtenerTodos: async (req, res) => {
      const data = await service.getAll(req.tenant.pool);
      successResponse(res, data, `${table} obtenidos`);
    },

    obtenerPorId: async (req, res) => {
      const item = await service.getById(req.tenant.pool, req.params.id);
      successResponse(res, item, `${table} obtenido`);
    },

    crear: async (req, res) => {
      const result = await service.create(req.tenant.pool, req.body);
      
      // Registrar log de creación
      await auditService.logActivity(req, `CREATE_${table.toUpperCase()}`, { id: result.id, data: req.body });
      
      successResponse(res, result, `${table} creado`, 201);
    },

    actualizar: async (req, res) => {
      const result = await service.update(req.tenant.pool, req.params.id, req.body);
      
      // Registrar log de actualización
      await auditService.logActivity(req, `UPDATE_${table.toUpperCase()}`, { id: req.params.id, data: req.body });
      
      successResponse(res, result, `${table} actualizado`);
    },

    eliminar: async (req, res) => {
      const result = await service.delete(req.tenant.pool, req.params.id);
      
      // Registrar log de eliminación
      await auditService.logActivity(req, `DELETE_${table.toUpperCase()}`, { id: req.params.id });
      
      successResponse(res, result, `${table} eliminado`);
    }
  };
};

module.exports = genericCRUD;
