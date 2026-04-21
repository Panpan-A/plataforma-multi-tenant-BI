const mysql = require("mysql2/promise");
require("dotenv").config();

// Cache de pools para diferentes empresas (tenants)
const tenantPools = new Map();

// Pool principal para la base de datos de administración
const adminPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getTenantPool = async (dbName) => {
    if (!dbName) return adminPool;

    if (tenantPools.has(dbName)) {
        return tenantPools.get(dbName);
    }

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
    });

    tenantPools.set(dbName, pool);
    return pool;
};

module.exports = {
    adminPool,
    getTenantPool
};
