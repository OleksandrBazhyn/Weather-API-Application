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
        const weatherData = await weatherManager.fetchWeatherData(city);
        if (!weatherData) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        const data = {
            location: weatherData.location.name,
            last_updated: weatherData.current.last_updated,
            temperature: weatherData.current.temp_c,
            humidity: weatherData.current.humidity,
            condition: weatherData.current.condition.text,
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default router;