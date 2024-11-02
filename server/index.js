import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const db = createClient({
  url: process.env.DB_URL || 'file:restaurants.db',
  authToken: process.env.DB_AUTH_TOKEN,
});

// Initialize database
async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cuisine TEXT NOT NULL,
      description TEXT NOT NULL,
      priceRange TEXT NOT NULL,
      rating INTEGER NOT NULL,
      recommendedBy TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      address TEXT NOT NULL
    )
  `);
}

initDb().catch(console.error);

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM restaurants ORDER BY timestamp DESC');
    const restaurants = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      cuisine: row.cuisine,
      description: row.description,
      priceRange: row.priceRange,
      rating: row.rating,
      recommendedBy: row.recommendedBy,
      timestamp: row.timestamp,
      location: {
        lat: row.lat,
        lng: row.lng,
        address: row.address
      }
    }));
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Add a new restaurant
app.post('/api/restaurants', async (req, res) => {
  try {
    const {
      id, name, cuisine, description, priceRange,
      rating, recommendedBy, timestamp, location
    } = req.body;

    await db.execute({
      sql: `INSERT INTO restaurants (
        id, name, cuisine, description, priceRange,
        rating, recommendedBy, timestamp, lat, lng, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, name, cuisine, description, priceRange,
        rating, recommendedBy, timestamp, location.lat,
        location.lng, location.address
      ]
    });

    res.status(201).json({ message: 'Restaurant added successfully' });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// Update a restaurant
app.put('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, cuisine, description, priceRange,
      rating, recommendedBy, timestamp, location
    } = req.body;

    await db.execute({
      sql: `UPDATE restaurants SET
        name = ?, cuisine = ?, description = ?,
        priceRange = ?, rating = ?, recommendedBy = ?,
        timestamp = ?, lat = ?, lng = ?, address = ?
        WHERE id = ?`,
      args: [
        name, cuisine, description, priceRange,
        rating, recommendedBy, timestamp, location.lat,
        location.lng, location.address, id
      ]
    });

    res.json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

// Delete a restaurant
app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: 'DELETE FROM restaurants WHERE id = ?',
      args: [id]
    });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});