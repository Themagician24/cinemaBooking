import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

/**
 * API pour récupérer les films actuellement à l'affiche depuis TMDB
 */
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movies = data.results;

    res.json({
      success: true,
      movies,
      message: "Movies fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      movies: [],
      message: "Failed to fetch movies",
      error: error.message,
    });
  }
};


export const addShow = async (req, res) => {
  try {
    let { movieId, showsInput, showPrice } = req.body;

    // Validation simple des champs
    if (!movieId || !showsInput || !showPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // Forcer le type string pour éviter les erreurs Mongoose
    movieId = String(movieId);
    showsInput = Array.isArray(showsInput) ? showsInput : [];
    showPrice = Number(showPrice);

    // Vérifier que le film existe en DB
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Récupérer les détails du film et les acteurs depuis TMDB
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: String(movieApiData.id),
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres.map((g) => g.name), // tableau de noms
        casts: movieCreditsData.cast.map((c) => c.name), // tableau d'acteurs
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    // Préparer les shows à insérer
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}:00`; // Ajouter secondes pour sécurité
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}, // objet vide pour suivre les sièges occupés
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
      res.json({
        success: true,
        
        message: "Shows added successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No shows to create. Check your input.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add show",
      error: error.message,
    });
  }
};

// API to get all shows from the database


export const getShows =  async (req, res) => {
  try {
    const shows = await Show.find( {
      showDateTime: {
        $gte: new Date(),
      },
    })
    .populate("movie")
    .sort({ showDateTime: 1 });

    // Filter unique Shows

    const uniqueShows = new Set(shows.map(show => show.movie));


    res.json({
      success: true,
      shows: Array.from(uniqueShows),
      message: "Shows fetched successfully",
    });
  } catch (error) {
    console.error(error);
   
    res.status(500).json({
      success: false,
   
      message: "Failed to fetch shows",
      error: error.message,
    });
  }
    
  
}

// API to get a single show from the database

export const getShow = async (req, res) => {
  try {
   const {movieId } = req.params;

  //  get all upcoming shows for the movie
    const shows = await Show.find({
      movie: movieId, 
      showDateTime: {
        $gte: new Date(),
      }});

      const movie = await Movie.findById(movieId);
      const dateTime = {};


      shows.forEach((show) => {
        const date = show.showDateTime.toISOString().split('T')[0];
      if(!dateTime[date]) {
        dateTime[date] = [];
      }
        dateTime[date].push({time: show.showDateTime, showId: show._id});
      });


    res.json({
      success: true,
      movie,
      dateTime,
      message: "Show fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
     
      message: "Failed to fetch show",
      error: error.message,
    });
  }
};
