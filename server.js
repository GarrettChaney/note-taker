//* dependencies
const express = require('express');
const app = express();

//* routing files
const api = require('./routes/api');
const html = require('./routes/html');

//* port logic
const PORT = process.env.PORT || 3001;

//* middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* route handling/serving
app.use(express.static('public'));
app.use('/api', api);
app.use('/', html)

//* listener
app.listen(PORT, () => {
    console.log(`Server is ready on port ${PORT}!`);
});