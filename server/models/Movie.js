import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  poster_path: { type: String, required: true },
  backdrop_path: { type: String, required: true },
  release_date: { type: String, required: true },
  release_year: { type: Number }, // Année pour filtrage rapide
  original_language: { type: String },
  tagline: { type: String },
  genre: { type: [String], required: true }, // tableau de genres
  casts: { type: [String], required: true }, // tableau des acteurs principaux
  vote_average: { type: Number, required: true },
  ratings_count: { type: Number, default: 0 }, // nombre de votes
  runtime: { type: Number, required: true },
  // trailer_url: { type: String }, // lien de la bande annonce
  adult: { type: Boolean, default: false }, // film pour adulte ?
  popularity: { type: Number, default: 0 }, // score de popularité
  status: { type: String, enum: ["now_playing", "upcoming", "archived"], default: "upcoming" } 
}, 
{
  timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
