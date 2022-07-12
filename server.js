const express =  require('express');
const { notes } = require('./db/db.json');
const app = express();

// filter searches-- is this necessary for this app?
function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(note => note.title === query.title);
  }
  if (query.text) {
    filteredResults = filteredResults.filter(note => note.text === query.text);
  }
  return filteredResults;
}

// search by id
function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

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
  // req.body is where incoming content will be
  console.log(req.body);
  res.json(req.body);
});

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });