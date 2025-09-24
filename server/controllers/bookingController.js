import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

// Fonction pour vérifier la disponibilité des sièges pour un show
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};

    // Vérifie si au moins un siège est déjà pris
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// Créer une réservation
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth; // Vérifie si ton middleware met bien userId ici
    const { showId, selectedSeats } = req.body;

    // Vérifier si les sièges sont disponibles
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected seats are not available",
      });
    }

    // Récupérer les infos du show
    const showData = await Show.findById(showId).populate("movie");

    if (!showData) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // Créer la réservation
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length, // attention : showPrice dans ton modèle
      bookedSeats: selectedSeats,
    });

    // Marquer les sièges comme occupés
    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    // Réponse
    res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Récupérer les sièges occupés d’un show
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    if (!showData) {
      return res.status(404).json({
        success: false,
        occupiedSeats: [],
        message: "Show not found",
      });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});

    res.json({
      success: true,
      occupiedSeats,
      message: "Occupied seats fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      occupiedSeats: [],
      message: "Failed to fetch occupied seats",
      error: error.message,
    });
  }
};
