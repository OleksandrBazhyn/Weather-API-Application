import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes/api.js";

import db from "./db/knex.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

db.raw('SELECT 1')
  .then(() => console.log('✅ Звʼязок з БД встановлено!'))
  .catch(err => console.error('❌ Помилка підключення до БД:', err));

