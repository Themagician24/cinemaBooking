import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";



// Api Controller function to get User Bookings

 export const getUserBookings = async (req, res) => {

  try {

    const user = req.auth().userId;

    const bookings = await Booking.find({user}).populate({
      path: 'show',
      populate:{
        path: 'movie'
      },
    }).sort({createdAt: -1});

    res.json({success: true, bookings});
    
  } catch (error) {
    console.error(error);
    res.json({success:false, message: error.message});
  }
 }

//  API Controller to Add Function to upsdate favorite Movie in Clerk User Metadata
export const updateFavoriteMovies = async (req, res) => {
  
  try {

    const {movieId} = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    if(!user.privateMetadata.favoriteMovies) {

      user.privateMetadata.favoriteMovies = [];
    }

    if(!user.privateMetadata.favoriteMovies.includes(movieId)) {

      user.privateMetadata.favoriteMovies.push(movieId);
     
     
    } else {
      user.privateMetadata.favoriteMovies = user.privateMetadata.favoriteMovies.filter(item => item !== movieId);
    }



    await clerkClient.users.updateUserMetadata(userId,{
      privateMetadata: user. privateMetadata
    });

    res.json({success: true, message: "Favorite movie updated successfully"});

    
  } catch (error) {

    console.error(error);
    res.json({success:false, message: error.message});
    
  }
}

// List of favorites movies

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites;
    
    // Getting movies from Database 

    const movies = await Movie.find({_id: {$in: favorites}})
    
    res.json({success: true, movies});


  } catch (error) {
    console.error(error);
    res.json({success:false, message: error.message});
    
  }
}
