require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend page from the same server
app.use(express.static(path.join(__dirname, 'Frontend')));

const FIELDS = ['product_name', 'category', 'brand', 'key_spec', 'release_year', 'price'];

// GET /api/products -> list all
app.get('/api/products', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM products ORDER BY id');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET /api/products/:id -> get one
app.get('/api/products/:id', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
		if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// POST /api/products -> create
app.post('/api/products', async (req, res) => {
	try {
		if (!req.body.product_name) {
			return res.status(400).json({ error: 'product_name is required' });
		}
		const values = FIELDS.map(f => req.body[f] ?? null);
		const [result] = await pool.query(
			`INSERT INTO products (${FIELDS.join(', ')}) VALUES (${FIELDS.map(() => '?').join(', ')})`,
			values
		);
		const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
		res.status(201).json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// PUT /api/products/:id -> update
app.put('/api/products/:id', async (req, res) => {
	try {
		if (!req.body.product_name) {
			return res.status(400).json({ error: 'product_name is required' });
		}
		const values = FIELDS.map(f => req.body[f] ?? null);
		const [result] = await pool.query(
			`UPDATE products SET ${FIELDS.map(f => f + ' = ?').join(', ')} WHERE id = ?`,
			[...values, req.params.id]
		);
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
		const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// DELETE /api/products/:id -> delete
app.delete('/api/products/:id', async (req, res) => {
	try {
		const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
		res.json({ message: 'Product deleted', id: Number(req.params.id) });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
