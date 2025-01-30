const express = require('express');
const MindmapController = require('../controllers/mindmapController');

const router = express.Router();
const mindmapController = new MindmapController();

// Route to save mindmap data
router.post('/mindmap', (req, res) => {
    mindmapController.saveMindmap(req.body)
        .then(() => res.status(201).send('Mindmap saved successfully'))
        .catch(error => res.status(500).send(error.message));
});

// Route to retrieve mindmap data
router.get('/mindmap/:id', (req, res) => {
    mindmapController.getMindmap(req.params.id)
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).send(error.message));
});

module.exports = router;