const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

app.use(express.json()); // parse JSON bodies

// Test route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`PostgreSQL connected at: ${result.rows[0].now}`);
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).send('Database connection failed');
  }
});

// ✅ Add this route to handle POST /location
app.post('/location', async (req, res) => {
  const { user_id, latitude, longitude, city, state } = req.body;

  try {
    const insertQuery = `
      INSERT INTO user_locations (user_id, latitude, longitude, city, state, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;

    await pool.query(insertQuery, [user_id, latitude, longitude, city, state]);

    res.status(200).json({ message: 'Location stored successfully.' });
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ error: 'Failed to store location.' });
  }
});

app.get('/locations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT user_id, city, state, latitude, longitude, created_at
      FROM user_locations
      ORDER BY created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to fetch locations.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
