import React, { useEffect } from 'react'
import { useState } from 'react'
import { dummyBookingData } from '../assets/assets';
import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { dateFormat } from '../lib/dateFormat';

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  }

  useEffect(() => {
    getMyBookings();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='relative px-4 md:px-8 lg:px-16 pt-24 md:pt-32 min-h-screen bg-gradient-to-br from-gray-900 to-black'>
      {/* Background elements */}
      <BlurCircle top='10%' left='5%' color='orange' />
      <BlurCircle bottom='10%' right='5%' color='purple' />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            My Bookings
          </span>
          <span className="ml-4 text-orange-500 text-xl bg-orange-500/10 px-3 py-1 rounded-full">
            {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
          </span>
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-500/10 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-2">No bookings yet</h2>
            <p className="text-gray-500">Your upcoming bookings will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((item, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="flex flex-col md:flex-row">
                  {/* Movie poster */}
                  <div className="md:w-1/4 lg:w-1/5">
                    <img 
                      src={item.show.movie.poster_path} 
                      alt={item.show.movie.title} 
                      className="w-full h-full max-h-48 md:max-h-full object-cover"
                    />
                  </div>
                  
                  {/* Booking details */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-2">{item.show.movie.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {timeFormat(item.show.movie.runtime)}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {dateFormat(item.show.showDateTime)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-bold text-orange-500">
                            {currency}{item.amount}
                          </p>
                          {!item.isPaid && (
                            <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all">
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Tickets: </span>
                          <span className="text-white font-medium">{item.bookedSeats.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Seat Numbers: </span>
                          <span className="text-white font-medium">{item.bookedSeats.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;