const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mindmapRoutes = require('./routes/mindmapRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', mindmapRoutes);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Serve the mindmap.html file
app.get('/mindmap', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'mindmap.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});