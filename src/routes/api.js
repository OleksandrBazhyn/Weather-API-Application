import express from 'express';
import WeatherManager from '../managers/WeatherManager.js';

const router = express.Router();

router.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }
    try {
        const weatherManager = new WeatherManager();
        const data = await weatherManager.fetchWeatherData(city);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default router;