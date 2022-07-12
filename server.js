const fs = require('fs');
const path = require('path');
const express =  require('express');
const { notes } = require('./db/db.json');
const { create } = require('domain');
const app = express();

// for heroku
const PORT = process.env.PORT || 3001

app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// calls db.json
app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// allows filtering search through id
app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result)
  } else {
    res.send(404)
  }
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if(!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    // add note to json file and notes array in this function

    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// listen for server
app.listen(3001, () => {
    console.log(`API server now on port ${PORT}!`);
  });