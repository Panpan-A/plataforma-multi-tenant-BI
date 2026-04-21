const tenantService = require("../services/tenantService");

module.exports = {
    adminPool: tenantService.adminPool,
    getTenantPool: tenantService.getTenantPool
};
