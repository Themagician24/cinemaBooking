import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // 🔥 import sweetalert2

import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import {
  FilmIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useAppContext } from '../../context/AppContext';

const ListShows = () => {

  const { axios, getToken, user } = useAppContext();
  const currency = "€";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all shows
  const getAllShows = async () => {
    try {
     const { data } = await axios.get("/api/admin/all-shows", {
       headers: {
         Authorization: `Bearer ${await getToken()}`,
       },
     });
     
      if (data.success) {
        setShows(data.shows);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shows:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
   if (user) {
     getAllShows();
   }
  }, [user]);

  // 🔥 Nouvelle méthode de suppression avec SweetAlert2
  const handleDelete = (showId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This show will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setShows((prev) => prev.filter((show) => show.id !== showId));

        Swal.fire({
          title: "Deleted!",
          text: "The show has been removed successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleEdit = (showId) => {
    Swal.fire({
      title: "Edit feature",
      text: `You clicked edit for show ID: ${showId}`,
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 text-gray-100">
      <Title text1="Movie" text2="Shows" subtitle="Manage and track all cinema screenings" />

      <div className="bg-gray-800/70 rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                {["Movie", "Date & Time", "Room", "Price", "Bookings", "Actions"].map((col) => (
                  <th key={col} className="p-4 text-left text-gray-300 text-sm uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {shows.map((show) => {
                const bookingsCount = Object.keys(show.occupiedSeats).length;
                return (
                  <tr key={show.id} className="hover:bg-gray-700/40 transition">
                    <td className="p-4 font-medium text-white">{show.movie.title}</td>
                    <td className="p-4 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-blue-400" />
                      {dateFormat(show.showDateTime)}
                    </td>
                    <td className="p-4">{show.theater}</td>
                    <td className="p-4 text-green-400">{currency}{show.showPrice}</td>
                    <td className="p-4">{bookingsCount}/50</td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(show.id)}
                        className="p-2 text-yellow-400 hover:text-yellow-300"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(show.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListShows;
