const baseModel = {
  findAll: async (pool, table) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE activo = 1`);
    return rows;
  },

  findById: async (pool, table, id) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ? AND activo = 1`, [id]);
    return rows[0];
  },

  create: async (pool, table, data) => {
    const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
    return result.insertId;
  },

  update: async (pool, table, id, data) => {
    await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
    return true;
  },

  softDelete: async (pool, table, id) => {
    await pool.query(`UPDATE ${table} SET activo = 0 WHERE id = ?`, [id]);
    return true;
  }
};

module.exports = baseModel;
