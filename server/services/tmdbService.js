const axios = require("axios");

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
  },
});

const getTmdbToken = () => {
  if (!process.env.TMDB_BEARER_TOKEN) {
    throw new Error("TMDB_BEARER_TOKEN is not configured.");
  }

  return process.env.TMDB_BEARER_TOKEN;
};

const getTmdbHeaders = () => ({
  Authorization: `Bearer ${getTmdbToken()}`,
});

const tmdbGet = (url, params = {}) =>
  tmdbClient.get(url, {
    params,
    headers: getTmdbHeaders(),
  });

module.exports = {
  tmdbGet,
};
