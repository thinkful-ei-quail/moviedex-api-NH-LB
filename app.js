'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies.json');

const app = express();

app.use(helmet());
app.use(cors());

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
      return movie.genre.toLowerCase() === genre.toLowerCase();
    });
  }

  if(country) {
    searchedMovies = searchedMovies.filter(movie => {
      return movie.country.toLowerCase() === country.toLowerCase();
    });
  }

  if(avg_vote) {
    searchedMovies = searchedMovies.filter(movie => {
      return Number(movie.avg_vote) >= Number(avg_vote);
    })
  }

  res.json(searchedMovies);
};

app.get('/movies', handleSearchMovies);

app.listen(8000, () => console.log('Server on port 8000'));