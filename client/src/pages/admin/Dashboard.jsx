import React, { useState, useEffect } from 'react';
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { 
  ChartLineIcon, 
  CircleDollarSign, 
  PlayCircleIcon, 
  StarIcon, 
  UserIcon,
  TrendingUpIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon
} from 'lucide-react';
import { dateFormat } from '../../lib/dateFormat';

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchDashboardData = async () => {
    // Simulation d'un chargement asynchrone
    setTimeout(() => {
      setDashboardData(dummyDashboardData);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
      change: "+12.5%",
      trend: "up",
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-400"
    },
    {
      title: 'Total Revenue',
      value: `${currency}${dashboardData.totalRevenue || "0"}`,
      icon: CircleDollarSign,
      change: "+8.2%",
      trend: "up",
      color: "from-emerald-500 to-green-500",
      iconColor: "text-emerald-400"
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
      change: "+3.2%",
      trend: "up",
      color: "from-purple-500 to-fuchsia-500",
      iconColor: "text-purple-400"
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUser,
      icon: UserIcon,
      change: "+5.7%",
      trend: "up",
      color: "from-amber-500 to-orange-500",
      iconColor: "text-amber-400"
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 overflow-hidden">
      {/* Effets d'arrière-plan animés */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-medium"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <Title text1="Admin" text2="Dashboard" />

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 hover:-translate-y-1 group overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Effet de lueur au survol */}
              <div 
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              
              {/* Particules animées */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${4 + Math.random() * 5}s infinite ease-in-out`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <div className={`flex items-center mt-2 text-xs ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                    <span>{card.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gray-700/50 group-hover:scale-110 transition-transform duration-300 ${card.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              
              {/* Barre de progression animée */}
              <div className="relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden mt-4">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out`}
                  style={{ width: hoveredCard === index ? '85%' : '70%' }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section des spectacles actifs */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Active Shows
          </h2>
          <button className="text-sm text-gray-400 hover:text-white flex items-center group">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardData.activeShows.map((show) => (
            <div 
              key={show._id}
              className="relative bg-gray-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500 group"
            >
              {/* Effet de lueur subtile */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={show.movie.poster_path} 
                  alt={show.movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Badge de notation */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                  <StarIcon className='w-4 h-4 text-amber-400 fill-amber-400'/>
                  <span className="text-sm font-medium">{show.movie.vote_average.toFixed(1)}</span>
                </div>
                
                {/* Date et heure */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white truncate">{show.movie.title}</h3>
                  <div className="flex items-center text-xs text-gray-300 mt-1.5">
                    <CalendarIcon className="w-4 h-4 mr-1.5" />
                    {dateFormat(show.showDateTime)}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg font-bold text-cyan-400">
                    {currency} {show.showPrice}
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    120 min
                  </div>
                </div>
                
                <button className="w-full py-2.5 bg-gray-700/50 hover:bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center group-hover:border group-hover:border-cyan-500/30">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styles d'animation CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-5px) translateX(5px); }
          50% { transform: translateY(5px) translateX(-5px); }
          75% { transform: translateY(-3px) translateX(-3px); }
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-medium {
          animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;