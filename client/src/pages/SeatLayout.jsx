import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData, assets } from '../assets/assets'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import Loading from '../components/Loading'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const navigate = useNavigate()

  const getShow = async () => {
    const show = dummyShowsData.find(show => show._id === id)
    if (show) {
      setShow({ movie: show, dateTime: dummyDateTimeData })
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please Select a Time First', { icon: '⚠️' })
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast('You Can Only Select Up to 5 Seats', { icon: '⚠️' })
    }
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    )
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-3 mt-2">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`
        const isSelected = selectedSeats.includes(seatId)

        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            className={`
              relative h-10 w-10 flex items-center justify-center rounded-md font-bold text-xs
              transition-all duration-300 transform
              ${isSelected
                ? 'bg-gradient-to-tr from-primary to-pink-600 text-white shadow-[0_0_15px_rgba(255,0,150,0.7)] scale-110'
                : 'bg-gray-800/80 text-gray-400 border border-gray-600 hover:bg-gray-700 hover:scale-105'}
            `}
          >
            {seatId}
            {/* Effet lumière sélection */}
            {isSelected && (
              <span className="absolute inset-0 rounded-md bg-primary/30 blur-md"></span>
            )}
          </button>
        )
      })}
    </div>
  )

  useEffect(() => {
    getShow()
  }, [])

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-16 text-white">
      {/* Timings */}
      <div className="w-full md:w-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-max md:sticky md:top-20 shadow-lg">
        <p className="text-lg font-bold">🎬 Available Timings</p>
        <div className="mt-5 space-y-2">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`
                flex items-center gap-3 px-5 py-2.5 rounded-xl cursor-pointer transition-all
                ${selectedTime?.time === item.time
                  ? 'bg-gradient-to-r from-primary to-pink-600 text-white shadow-md scale-[1.02]'
                  : 'hover:bg-primary/20 text-gray-300'}
              `}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats */}
      <div className="relative flex flex-1 flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="-50px" right="-50px" />

        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
          Select Your Seats
        </h1>

        {/* Écran avec effet glow */}
        <div className="relative flex flex-col items-center mb-14">
          <div className="w-[500px] h-2 bg-gradient-to-r from-primary via-pink-600 to-purple-600 rounded-full shadow-[0_0_40px_rgba(255,0,150,0.8)]"></div>
          <p className="text-gray-400 text-sm mt-3 tracking-wide">SCREEN</p>
        </div>

        {/* Salle en perspective */}
        <div className="flex flex-col items-center mt-6 text-xs perspective">
          <div className="transform -skew-x-6 space-y-6">
            {/* Rangées */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 mb-10">
              {groupRows[0].map(row => renderSeats(row))}
            </div>
            <div className="grid grid-cols-2 gap-14">
              {groupRows.slice(1).map((group, index) => (
                <div key={index}>
                  {group.map(row => renderSeats(row))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton checkout */}
        <button
          onClick={() => navigate('/my-bookings')}
          disabled={!selectedSeats.length}
          className={`
            flex items-center gap-2 mt-14 px-12 py-3.5 rounded-full font-semibold
            transition-all duration-300 active:scale-95
            ${selectedSeats.length
              ? 'bg-gradient-to-r from-primary to-pink-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'}
          `}
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-5 h-5" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
