import request from 'supertest';
import express from 'express';
import apiRoutes from '../api/routes/api.js';

let app;

beforeAll(async () => {
  const { default: WeatherManager } = await import('../api/managers/WeatherManager.js');
  WeatherManager.prototype.fetchWeatherData = async () => ({
    current: {
      temp_c: 20,
      humidity: 50,
      condition: { text: 'Sunny' }
    }
  });

  app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);
});

describe('Weather API', () => {
  it('GET /api/weather?city=Kyiv returns weather data', async () => {
    const res = await request(app).get('/api/weather?city=Kyiv');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('description');
  });

  it('POST /api/subscribe with invalid data returns 400', async () => {
    const res = await request(app)
      .post('/api/subscribe')
      .send({ email: '', city: '', frequency: 'weekly' });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/confirm/:token with invalid token returns 404', async () => {
    const res = await request(app).get('/api/confirm/invalidtoken');
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/unsubscribe/:token with invalid token returns 404', async () => {
    const res = await request(app).get('/api/unsubscribe/invalidtoken');
    expect(res.statusCode).toBe(404);
  });
});