import express from 'express';
import WeatherManager from '../managers/WeatherManager.js';

const router = express.Router();

router.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    try {
        const weatherManager = new WeatherManager();
        const weatherData = await weatherManager.fetchWeatherData(city);
        if (!weatherData) {
            return res.status(404).json({ error: 'City not found' });
        }
        const data = {
            temperature: weatherData.current.temp_c,
            humidity: weatherData.current.humidity,
            description: weatherData.current.condition.text,
        };        
        return res.status(200).json(data);;
    } catch (error) {
        return res.status(404).json({ error: 'City not found' });
    }
});

router.post('/subscribe', (req, res) => {
    const { email, city, frequency } = req.body;
    if (!(email && city && frequency)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    console.log(`Subscribed: ${email}`);
    return res.status(200).json({ message: 'Subscribed successfully' });
});

export default router;