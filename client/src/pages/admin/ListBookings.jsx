import React, { useState, useEffect } from 'react';

import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListBookings = () => {

    const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  // Données principales et filtrées
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination mock (pour plus tard si besoin)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Récupération des données (simulée avec timeout)
  const getAllBookings = async () => {
   try {

    const { data } = await axios.get('/api/admin/all-bookings', {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      }
    });
    if (data.success) {
      setBookings(data.bookings);
      setFilteredBookings(data.bookings);
    } else {
      toast.error(data.message)
      
    }
    
   } catch (error) {
    console.error( error);
    
   }
   setIsLoading(false);
  };

  useEffect(() => {
   if (user) {
    getAllBookings();
   }
  }, [user]);

  // Filtrer les bookings selon la recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((booking) => {
        const term = searchTerm.toLowerCase();
        return (
          booking.user.name.toLowerCase().includes(term) ||
          booking.show.movie.title.toLowerCase().includes(term) ||
          Object.values(booking.bookedSeats).some(seat =>
            seat.toLowerCase().includes(term)
          )
        );
      });
      setFilteredBookings(filtered);
      setCurrentPage(1); // reset pagination si recherche
    }
  }, [searchTerm, bookings]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Gestion page suivante/précédente
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      {/* Titre de la page */}
      <Title text1="List" text2="Bookings" subtitle="Manage your bookings" />

      {/* Barre de recherche */}
      <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/30 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by user, movie, or seat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Total:</span>
          <span className="px-2 py-1 bg-blue-500/20 rounded-md">{filteredBookings.length} bookings</span>
        </div>
      </div>

      {/* Table des réservations */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700/30">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-700/40 text-left">
              <tr>
                <th className="p-4 pl-6">User Name</th>
                <th className="p-4">Movie Name</th>
                <th className="p-4">Show Time</th>
                <th className="p-4">Seats</th>
                <th className="p-4 pr-6">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {currentBookings.length > 0 ? currentBookings.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-700/30 transition-all duration-200 group">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600/20 rounded-full flex items-center justify-center text-sm font-medium">
                      {item.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{item.user.name}</div>
                      {item.user.email && <div className="text-xs text-gray-400">{item.user.email}</div>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{item.show.movie.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{dateFormat(item.show.showDateTime, "dateOnly")}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-500/20 rounded-md text-sm">
                      {dateFormat(item.show.showDateTime, "timeOnly")}
                    </span>
                  </td>
                  <td className="p-4 flex flex-wrap gap-1">
                    {Object.values(item.bookedSeats).map((seat, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-600/20 rounded-md text-xs">{seat}</span>
                    ))}
                  </td>
                  <td className="p-4 pr-6 font-semibold text-green-400">{currency}{item.amount}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBookings.length > itemsPerPage && (
          <div className="p-4 bg-gray-800/50 border-t border-gray-700/30 flex justify-between items-center">
            <button onClick={handlePrev} className="px-3 py-1 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors">Previous</button>
            <span className="text-sm text-gray-400">{currentPage} / {totalPages}</span>
            <button onClick={handleNext} className="px-3 py-1 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListBookings;
