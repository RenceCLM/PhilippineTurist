const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE elements (id INTEGER PRIMARY KEY, type TEXT, attrs TEXT)");
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the mindmap.html file
app.get('/mindmap', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mindmap.html'));
});

// Save elements to the database
app.post('/save', (req, res) => {
    const elements = req.body.elements;
    db.serialize(() => {
        db.run("DELETE FROM elements");
        const stmt = db.prepare("INSERT INTO elements (type, attrs) VALUES (?, ?)");
        elements.forEach(element => {
            stmt.run(element.type, JSON.stringify(element.attrs));
        });
        stmt.finalize();
    });
    res.json({ status: 'success' });
});

// Load elements from the database
app.get('/load', (req, res) => {
    db.all("SELECT type, attrs FROM elements", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const elements = rows.map(row => ({
            type: row.type,
            attrs: JSON.parse(row.attrs)
        }));
        res.json({ elements });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});