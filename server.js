const fs = require('fs');
const path = require('path');
const express =  require('express');
const { notes } = require('./db/db.json');
const { create } = require('domain');
const app = express();

const PORT = process.env.PORT || 3001

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

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

// creates new note in the notes array
function createNewNote(body, notesArray) {
  const note = body;

  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  // return finished code to post route for response
  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false
  }
  return true;
};

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

app.listen(3001, () => {
    console.log(`API server now on port ${PORT}!`);
  });