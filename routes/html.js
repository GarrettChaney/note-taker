//* dependencies
const path = require('path');
const router = require('express').Router();

//* router to serve notes.html
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'))
});

//* router to serve index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

//* router to default to index.html
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//* export router for use elsewhere
module.exports = router;