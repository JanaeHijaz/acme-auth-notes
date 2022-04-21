const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note }} = require('./db');
const path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async(req, res, next)=> {
  try {
    res.send({ token: await User.authenticate(req.body)});
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth', async(req, res, next)=> {
  try {
    res.send(await User.byToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/purchases', async(req, res, next)=> {
  try {
    const user = await User.byToken(req.headers.authorization);
    res.send('TODO Send the purchases for this user');
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/notes', async(req, res, next) => {
  try{
    //first, identify the user by the headers authorization
    const user = await User.byToken(req.headers.authorization);
    const userNotes = await Note.findAll({
      where: {
        userId: user.id
      }
    })
    res.send(userNotes)
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/notes', async(req, res, next) => {
  try{
    const user = await User.byToken(req.headers.authorization);
    //console.log(user)
    res.status(201).send(await Note.create({ ...req.body, userId: user.id })); 
    // this creates a note for the specific user
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/notes/:id', async(req, res, next) => {
  try{
    //const note = await Note.findByPk(req.params.id); // use findOne {where...{}
    const user = await User.byToken(req.headers.authorization);
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId: user.id
      }
    });
    //console.log(note)
    await note.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex)
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
