import express from "express";
import { getFavorites, getUserBookings, updateFavoriteMovies } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favorite', updateFavoriteMovies);
userRouter.get('/favorites', getFavorites);

export default userRouter;
