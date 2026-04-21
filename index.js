const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Rutas
const empresaRoutes = require("./routes/empresaRoutes");
const authRoutes = require("./routes/authRoutes");
const queryRoutes = require("./routes/queryRoutes");
const exportRoutes = require("./routes/exportRoutes");
const crudRoutes = require("./routes/crudRoutes");
const reportRoutes = require("./routes/reportRoutes");
const auditRoutes = require("./routes/auditRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userAdminRoutes = require("./routes/userAdminRoutes");

app.use("/api/empresas", empresaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/crud", crudRoutes);
app.use("/api/reportes", reportRoutes);
app.use("/api/auditoria", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", userAdminRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware global para el manejo de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  console.error("ERROR 💥:", {
    message: err.message,
    stack: err.stack,
    statusCode
  });

  res.status(statusCode).json({ 
    status,
    error: err.message || "Ocurrió un error interno en el servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Mantener el proceso vivo explícitamente para el sandbox
setInterval(() => {}, 1000 * 60 * 60);
