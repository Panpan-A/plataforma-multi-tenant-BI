/**
 * Formatea una fecha a string YYYY-MM-DD
 */
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Limpia un objeto de campos nulos o indefinidos
 */
const cleanObject = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

/**
 * Genera una respuesta estándar de éxito
 */
const successResponse = (res, data, message = "Operación exitosa", statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

module.exports = {
  formatDate,
  cleanObject,
  successResponse
};
