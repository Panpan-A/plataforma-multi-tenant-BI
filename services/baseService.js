const baseModel = require("../models/baseModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const validateData = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new ValidationError(`El campo ${field} es requerido`);
    }
  }
};

const processCRUD = (table, requiredFields = []) => {
  return {
    getAll: async (pool) => {
      return await baseModel.findAll(pool, table);
    },

    getById: async (pool, id) => {
      const item = await baseModel.findById(pool, table, id);
      if (!item) throw new NotFoundError("Registro no encontrado");
      return item;
    },

    create: async (pool, data) => {
      validateData(data, requiredFields);
      // Asegurar que activo sea 1 por defecto si no viene
      const insertData = { ...data, activo: 1 };
      const id = await baseModel.create(pool, table, insertData);
      return { id, ...insertData };
    },

    update: async (pool, id, data) => {
      // Validar que el registro existe antes de actualizar
      await baseModel.findById(pool, table, id);
      await baseModel.update(pool, table, id, data);
      return { message: "Actualizado correctamente" };
    },

    delete: async (pool, id) => {
      await baseModel.findById(pool, table, id);
      await baseModel.softDelete(pool, table, id);
      return { message: "Eliminado (soft delete) correctamente" };
    }
  };
};

module.exports = {
  processCRUD
};
