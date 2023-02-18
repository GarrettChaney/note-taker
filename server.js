//* dependencies
const fs = require('fs');
const express = require('express');
const path = require('path');
const uuid = require('uuid');

//* express setup
const app = express();

//* port logic
const PORT = process.env.PORT || 3001;

//* middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//* route to home index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//* route to serve notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//* route to serve existing notes within db.json
app.get('/api/notes', (req, res) =>

  //Reading databse file and sending it to client
  fs.readFile('./db/db.json', "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(JSON.parse(data))
  }
    )
);

//* route to main page/wildcard
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//* route to post new notes to db.json
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);

    const newNote = {
      id: uuid.v4(),
      title: req.body.title,
      text: req.body.text,
    };

    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
  
      if (notes.length === updatedNotes.length) {
        return res.status(404).json({ message: `Note with ID ${noteId} not found` });
      }
  
      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        
        res.json({ message: `Note with ID ${noteId} deleted successfully` });
      });
    });
  });

//* listener
app.listen(PORT, () => {
    console.log(`Server is ready on port ${PORT}!`);
});