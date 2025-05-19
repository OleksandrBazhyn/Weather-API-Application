import express from 'express';
import WeatherManager from '../managers/WeatherManager.js';
import db from '../../db/knex.js';
import { v4 as uuidv4 } from 'uuid';
import Mailer from '../managers/Mailer.js';

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
        return res.status(200).json(data);
    } catch (error) {
        return res.status(404).json({ error: 'City not found' });
    }
});

router.post('/subscribe', async (req, res) => {
    console.log('Request body:', req.body);
    const { email, city, frequency } = req.body;
    if (!email || !city || !frequency || !['daily', 'hourly'].includes(frequency)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const existing = await db('subscriptions')
        .where({ email, city, frequency })
        .first();
    if (existing) {
        return res.status(409).json({ error: 'Subscription already exists' });
    }

    const token = uuidv4();

    try {
        await db('subscriptions').insert({
            email,
            city,
            frequency,
            token,
            is_active: false
        });

        await Mailer.sendConfirmationEmail(email, city, token);

        return res.status(200).json({ message: 'Subscription saved. Please confirm via email.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/confirm/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const updated = await db('subscriptions')
            .where({ token })
            .update({ is_active: true });
        if (updated) {
            return res.status(200).send('Subscription confirmed!');
        } else {
            return res.status(404).send('Invalid or expired token.');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});

export default router;