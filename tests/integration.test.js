const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Para probar la integración sin iniciar el servidor real
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Mock del controlador para evitar que intente conectar a la BD real
jest.mock('../controllers/authController', () => ({
  login: (req, res) => res.status(200).json({ status: 'success' })
}));

describe('Integration Validation Tests', () => {
  test('POST /api/auth/login should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({}); // Enviamos body vacío

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBeGreaterThan(0);
    
    // Verificamos mensajes de error específicos configurados en authRoutes
    const messages = res.body.errors.map(e => e.msg);
    expect(messages).toContain('El nombre de usuario es requerido');
    expect(messages).toContain('La contraseña es requerida');
  });

  test('POST /api/auth/login should return 200 if fields are present', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        nombre_corto: 'test_user',
        contraseña: 'test_password'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
