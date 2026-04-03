const express = require("express");
const { tmdbGet } = require("../services/tmdbService");

const router = express.Router();

const getResults = async (path, params = {}) => {
  const response = await tmdbGet(path, params);
  return response.data.results;
};

router.get("/home", async (req, res) => {
  try {
    const [topRated, popular, upcoming] = await Promise.all([
      getResults("/movie/top_rated"),
      getResults("/movie/popular"),
      getResults("/movie/upcoming"),
    ]);

    return res.json({
      topRated,
      popular,
      upcoming,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load home page content." });
  }
});

router.get("/plays", async (req, res) => {
  try {
    const plays = await getResults("/movie/now_playing", {
      region: req.query.region || "IN",
    });

    return res.json({ plays });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load plays right now." });
  }
});

router.get("/stream", async (req, res) => {
  try {
    const [featured, upcoming] = await Promise.all([
      getResults("/movie/now_playing"),
      getResults("/movie/now_playing", {
        region: req.query.region || "IN",
      }),
    ]);

    return res.json({
      featured,
      upcoming,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load stream content." });
  }
});

router.get("/tv/popular", async (req, res) => {
  try {
    const shows = await getResults("/tv/popular", {
      region: req.query.region || "IN",
    });

    return res.json({ shows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load TV shows right now." });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [movie, credits, similar, recommendations] = await Promise.all([
      tmdbGet(`/movie/${id}`),
      tmdbGet(`/movie/${id}/credits`),
      tmdbGet(`/movie/${id}/similar`),
      tmdbGet(`/movie/${id}/recommendations`),
    ]);

    return res.json({
      movie: movie.data,
      cast: credits.data.cast || [],
      similar: similar.data.results || [],
      recommendations: recommendations.data.results || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load this movie right now." });
  }
});

router.get("/search", async (req, res) => {
  const query = (req.query.q || "").trim();

  if (!query) {
    return res.json({ results: [] });
  }

  try {
    const response = await tmdbGet("/search/movie", {
      query,
      include_adult: false,
    });

    return res.json({
      results: (response.data.results || []).slice(0, 8),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to search movies right now." });
  }
});

module.exports = router;

