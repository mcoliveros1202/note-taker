const express =  require('express');

// for heroku
const PORT = process.env.PORT || 3001
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// listen for server
app.listen(3001, () => {
    console.log(`API server now on port ${PORT}!`);
  });