import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes/api.js";
import db from "./db/knex.js";
import cron from "node-cron";
import Mailer from "./api/managers/Mailer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Hourly (at the beginning of each hour)
cron.schedule('0 * * * *', () => {
    Mailer.sendWeatherEmails('hourly');
});

// Every day at 8:00 am
cron.schedule('0 8 * * *', () => {
    Mailer.sendWeatherEmails('daily');
});

