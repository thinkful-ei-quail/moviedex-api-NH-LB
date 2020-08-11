'use strict';

require('dotenv').config();
const express = require('express');
const movies = require('./movies.json');

const app = express();

const validateBearerToken = (req, res, next) => {
  const authToken = req.get('Authorization') || '';
  const apiToken = process.env.API_TOKEN;

  if(!authToken || authToken.split(' ').pop() !== apiToken) {
    res.status(401).json({error: 'Unauthorized user, access denied.'});
  }

  next();
};

app.use(validateBearerToken);

const handleSearchMovies = (req, res) => {
  const {genre, country, avg_vote} = req.query; 
  
  let searchedMovies = [...movies];

  if(genre) {
    searchedMovies = searchedMovies.filter(movie => {
      return movie.genre === genre;
    });
  }

  res.json(searchedMovies);
};

app.get('/movies', handleSearchMovies);

app.listen(8000, () => console.log('Server on port 8000'));