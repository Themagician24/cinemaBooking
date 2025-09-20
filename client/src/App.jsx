import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import SeatLayout from './pages/SeatLayout.jsx'
import MyBookings from './pages/MyBooking.jsx'
import Favorite from './pages/Favorite.jsx'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer.jsx'
import ListShows from './pages/admin/ListShows.jsx'
import AddShows from './pages/admin/AddShows.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ListBookings from './pages/admin/ListBookings.jsx'
import Layout from './pages/admin/Layout.jsx'

const App = () => {
  // Détecte si l'URL actuelle est une route admin (commence par "/admin")
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      {/* Composant pour afficher les notifications/toasts */}
      <Toaster position='top-center' reverseOrder={false} />

      {/* Affiche la Navbar uniquement si ce n'est pas une route admin */}
      {!isAdminRoute && <Navbar />}

      {/* Définition des routes de l'application */}
      <Routes>
        {/* Routes publiques / client */}
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />

        {/* Routes admin */}
        <Route path='/admin/*' element={<Layout />}>

          {/* Dashboard (index) */}
          <Route index element={<Dashboard />} />

          {/* Page pour ajouter un nouveau show */}
          <Route path='add-shows' element={<AddShows />} />

          {/* Page pour lister tous les shows */}
          <Route path='list-shows' element={<ListShows />} />

          {/* Page pour lister toutes les réservations */}
          <Route path='list-bookings' element={<ListBookings />} />
          
        </Route>
      </Routes>

      {/* Affiche le Footer uniquement si ce n'est pas une route admin */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
