import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

// Configuration de la base URL pour Axios
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

/**
 * Contexte principal de l'application pour la gestion de l'état global
 * @type {React.Context}
 */
export const AppContext = createContext()

/**
 * Provider du contexte d'application qui englobe l'ensemble de l'app
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants à wrapper
 * @returns {JSX.Element} Composant Provider
 */


export const AppProvider = ({ children }) => {

  // États globaux de l'application


  const [isAdmin, setIsAdmin] = useState(false); // Statut administrateur de l'utilisateur


  const [shows, setShows] = useState([]); // Liste de tous les films/spectacles

  const [favoriteMovies, setFavoriteMovies] = useState([]); // Films favoris de l'utilisateur
  
  // URL de base pour les images TMDB (The Movie Database)
  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // Hooks Clerk pour l'authentification et la gestion utilisateur
  const { user } = useUser(); // Utilisateur actuellement connecté
  const { getToken } = useAuth(); // Fonction pour obtenir le token d'authentification
  
  // Hooks React Router pour la navigation et la localisation


  const location = useLocation(); // Objet contenant les informations sur la route actuelle
  const navigate = useNavigate(); // Fonction pour naviguer programmatiquement

  /**
   * Vérifie si l'utilisateur connecté a les privilèges d'administrateur
   * @async
   * @returns {Promise<void>}
   */


  const fetchIsAdmin = async () => {
    try {
      // Requête vers l'API pour vérifier le statut admin
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      });

      // Mise à jour de l'état isAdmin selon la réponse du serveur
      setIsAdmin(data.isAdmin);

      // Redirection si l'utilisateur non-admin tente d'accéder à une page admin
      if (!data.isAdmin && location.pathname.startsWith('/admin')) {
        navigate('/');
        toast('You are not authorized to access admin dashboard', { icon: '⚠️' });
      }

    } catch (error) {
      console.error("Erreur lors de la vérification du statut admin:", error);
    }
  };

  /**
   * Récupère la liste de tous les films/spectacles depuis l'API
   * @async
   * @returns {Promise<void>}
   */
  const fetchShows = async () => {
    try {
      // Requête GET pour obtenir tous les shows
      const { data } = await axios.get('/api/show/all');
      
      if (data.success) {
        // Si la requête réussit, mise à jour de l'état shows
        setShows(data.shows);
      } else {
        // Affichage d'une erreur si le succès est false
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Something went wrong:", error);
    }
  }

  /**
   * Récupère la liste des films favoris de l'utilisateur connecté
   * @async
   * @returns {Promise<void>}
   */


  const fetchFavoriteMovies = async () => {
    try {
      // Requête authentifiée pour obtenir les favoris de l'utilisateur
      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      
      if (data.success) {
        // Mise à jour de l'état des films favoris
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Something went wrong:", error);
    }
  }

  // Effet pour charger les shows au montage du composant
  useEffect(() => {
    fetchShows();
  }, []); // Tableau de dépendances vide = exécution unique au montage

  // Effet pour gérer les données utilisateur quand l'utilisateur change
  useEffect(() => {
    if (user) {
      // Si un utilisateur est connecté, charger ses données admin et favoris
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
    // Le hook se déclenche à chaque changement de l'objet user
  }, [user]);

  // Valeur du contexte qui sera accessible via useAppContext()

  const value = {

    // Instance Axios configurée
    axios,
    // Méthodes
    fetchIsAdmin,
    fetchFavoriteMovies,
    // Données utilisateur et authentification
    user,
    getToken,
    navigate,
    favoriteMovies,
    
    // États de l'application
    isAdmin,
    shows,
   
    // Configuration
    image_base_url,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Hook personnalisé pour accéder facilement au contexte de l'application
 * @returns {Object} Valeur du contexte AppContext
 * @throws {Error} Si utilisé en dehors d'un AppProvider
 */
export const useAppContext = () => useContext(AppContext);