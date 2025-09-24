import { Inngest } from "inngest";
import User from "../models/User.js";

// Créer le client Inngest
export const inngest = new Inngest({
  id: "movie-ticket-booking"
});

// Fonction pour créer un utilisateur
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses?.[0]?.email_address || "",
      image: image_url || ""
    };

    try {
      // Création en attente pour assurer la cohérence
      await User.create(userData);
      console.log(`✅ User created: ${userData.email}`);
    } catch (err) {
      console.error("❌ Failed to create user:", err);
    }
  }
);

// Fonction pour supprimer un utilisateur
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;

    try {
      await User.findByIdAndDelete(id);
      console.log(`🗑️ User deleted: ${id}`);
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
    }
  }
);

// Fonction pour mettre à jour un utilisateur
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses?.[0]?.email_address || "",
      image: image_url || ""
    };

    try {
      await User.findByIdAndUpdate(id, userData, { new: true, upsert: true });
      console.log(`✏️ User updated: ${userData.email}`);
    } catch (err) {
      console.error("❌ Failed to update user:", err);
    }
  }
);

// Exporter toutes les fonctions pour Inngest
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];
