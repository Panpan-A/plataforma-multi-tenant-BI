-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 27, 2026 at 05:24 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `icono`
--

-- --------------------------------------------------------

--
-- Table structure for table `agentes`
--

CREATE TABLE `agentes` (
  `id` int NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `clasif1` varchar(50) DEFAULT NULL,
  `clasif2` varchar(50) DEFAULT NULL,
  `clasif3` varchar(50) DEFAULT NULL,
  `clasif4` varchar(50) DEFAULT NULL,
  `clasif5` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clasificaciones`
--

CREATE TABLE `clasificaciones` (
  `id` int NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `clasif1` varchar(50) DEFAULT NULL,
  `clasif2` varchar(50) DEFAULT NULL,
  `clasif3` varchar(50) DEFAULT NULL,
  `clasif4` varchar(50) DEFAULT NULL,
  `clasif5` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id` int NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `clasif1` varchar(50) DEFAULT NULL,
  `clasif2` varchar(50) DEFAULT NULL,
  `clasif3` varchar(50) DEFAULT NULL,
  `clasif4` varchar(50) DEFAULT NULL,
  `clasif5` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `empresas`
--

CREATE TABLE `empresas` (
  `id` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `rfc` varchar(20) DEFAULT NULL,
  `bd` varchar(100) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `operaciones`
--

CREATE TABLE `operaciones` (
  `id` int NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `tipo_opr_id` int DEFAULT NULL,
  `producto_id` int DEFAULT NULL,
  `cliente_id` int DEFAULT NULL,
  `agente_id` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `catalogo` varchar(50) DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `impuestos` decimal(10,2) DEFAULT NULL,
  `unidades` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id` int NOT NULL,
  `empresa_id` int DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `clasif1` varchar(50) DEFAULT NULL,
  `clasif2` varchar(50) DEFAULT NULL,
  `clasif3` varchar(50) DEFAULT NULL,
  `clasif4` varchar(50) DEFAULT NULL,
  `clasif5` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `querys`
--

CREATE TABLE `querys` (
  `id` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `query` text,
  `filtro1` varchar(50) DEFAULT NULL,
  `filtro2` varchar(50) DEFAULT NULL,
  `filtro3` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `query_empresa`
--

CREATE TABLE `query_empresa` (
  `id` int NOT NULL,
  `query_id` int DEFAULT NULL,
  `empresa_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tipo_opr`
--

CREATE TABLE `tipo_opr` (
  `id` int NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nombre_corto` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `nombre_largo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_corto`, `contraseña`, `nombre_largo`) VALUES
(1, 'admin', '$2b$10$KbQiQpK7y5zV6zKXyZ3Q1uJrKkqP1u5P6XzVYQx8ZxJ8YkZ5Z1Z1G', 'Administrador');

-- --------------------------------------------------------

--
-- Table structure for table `usuario_empresa`
--

CREATE TABLE `usuario_empresa` (
  `id` int NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `empresa_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agentes`
--
ALTER TABLE `agentes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_agentes_empresa` (`empresa_id`);

--
-- Indexes for table `clasificaciones`
--
ALTER TABLE `clasificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_id` (`empresa_id`);

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_clientes_empresa` (`empresa_id`);

--
-- Indexes for table `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rfc` (`rfc`);

--
-- Indexes for table `operaciones`
--
ALTER TABLE `operaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `agente_id` (`agente_id`),
  ADD KEY `idx_operaciones_empresa_fecha` (`empresa_id`,`fecha`),
  ADD KEY `idx_operaciones_tipo` (`tipo_opr_id`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_productos_empresa` (`empresa_id`);

--
-- Indexes for table `querys`
--
ALTER TABLE `querys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `query_empresa`
--
ALTER TABLE `query_empresa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `query_id` (`query_id`),
  ADD KEY `empresa_id` (`empresa_id`);

--
-- Indexes for table `tipo_opr`
--
ALTER TABLE `tipo_opr`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_corto` (`nombre_corto`);

--
-- Indexes for table `usuario_empresa`
--
ALTER TABLE `usuario_empresa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `idx_usuario_empresa` (`usuario_id`,`empresa_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agentes`
--
ALTER TABLE `agentes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clasificaciones`
--
ALTER TABLE `clasificaciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `operaciones`
--
ALTER TABLE `operaciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `querys`
--
ALTER TABLE `querys`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `query_empresa`
--
ALTER TABLE `query_empresa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipo_opr`
--
ALTER TABLE `tipo_opr`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `usuario_empresa`
--
ALTER TABLE `usuario_empresa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agentes`
--
ALTER TABLE `agentes`
  ADD CONSTRAINT `agentes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);

--
-- Constraints for table `clasificaciones`
--
ALTER TABLE `clasificaciones`
  ADD CONSTRAINT `clasificaciones_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);

--
-- Constraints for table `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);

--
-- Constraints for table `operaciones`
--
ALTER TABLE `operaciones`
  ADD CONSTRAINT `operaciones_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `operaciones_ibfk_2` FOREIGN KEY (`tipo_opr_id`) REFERENCES `tipo_opr` (`id`),
  ADD CONSTRAINT `operaciones_ibfk_3` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `operaciones_ibfk_4` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `operaciones_ibfk_5` FOREIGN KEY (`agente_id`) REFERENCES `agentes` (`id`);

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);

--
-- Constraints for table `query_empresa`
--
ALTER TABLE `query_empresa`
  ADD CONSTRAINT `query_empresa_ibfk_1` FOREIGN KEY (`query_id`) REFERENCES `querys` (`id`),
  ADD CONSTRAINT `query_empresa_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);

--
-- Constraints for table `usuario_empresa`
--
ALTER TABLE `usuario_empresa`
  ADD CONSTRAINT `usuario_empresa_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuario_empresa_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
