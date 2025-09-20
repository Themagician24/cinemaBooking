import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, PlusSquare, List, Archive,
  Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = {
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: assets.profile,
  };

  const adminNavLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquare },
    { name: 'List Shows', path: '/admin/list-shows', icon: List },
    { name: 'List Bookings', path: '/admin/list-bookings', icon: Archive },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) =>
    date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`relative h-screen flex flex-col pt-8 w-full bg-black transition-all duration-500 ${isCollapsed ? 'max-w-20' : 'max-w-64'}`}>
      
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-20 bg-red-600 hover:bg-red-500 rounded-full p-2 shadow-lg transition-all duration-300"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
      </button>

      {/* Profile */}
      <div className="relative mx-auto mb-4 group">
        <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-30 animate-pulse"></div>
        <img
          className="relative h-16 w-16 md:h-20 md:w-20 rounded-full border-2 border-red-500 shadow-xl transition-transform duration-500 group-hover:scale-110"
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <div className={`mt-2 text-center transition-all duration-500 ${isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-20'}`}>
          <p className="text-white font-semibold">{user.firstName} <span className="text-red-400">{user.lastName}</span></p>
        </div>
      </div>

      {/* Divider */}
      <div className={`my-6 mx-4 h-px bg-red-700 transition-all duration-300 ${isCollapsed ? 'w-8 mx-auto' : 'w-auto'}`}></div>

      {/* Navigation */}
      <div className="w-full px-2 space-y-2">
        {adminNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 w-full py-3 rounded-lg transition-all duration-300
               ${isActive ? 'text-white bg-red-900/60 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'text-gray-400 hover:bg-red-900/30 hover:text-white'}
               ${isCollapsed ? 'justify-center px-0' : 'pl-4 pr-6'}`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'text-red-400 scale-125 animate-pulse' : 'text-gray-400 group-hover:scale-110'}`}
                />
                <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  {link.name}
                </span>
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-l-lg shadow-lg"></div>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Secondary Links */}
      <div className="w-full px-2 space-y-2 mt-auto mb-4">
        {[{name: 'Settings', path:'/admin/settings', icon: Settings}, {name:'Logout', path:'/admin/logout', icon: LogOut}].map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 w-full py-3 rounded-lg transition-all duration-300
               ${isActive ? 'text-white bg-red-900/60 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'text-gray-400 hover:bg-red-900/30 hover:text-white'}
               ${isCollapsed ? 'justify-center px-0' : 'pl-4 pr-6'}`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'text-red-400 scale-125 animate-pulse' : 'text-gray-400 group-hover:scale-110'}`} />
                <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  {link.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Clock & Date */}
      <div className="mt-auto px-4 pb-4">
        <div className={`bg-gray-900 rounded-lg p-3 transition-all duration-500 shadow-lg ${isCollapsed ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <div className="text-red-400 text-center mb-1 font-semibold text-lg animate-pulse">{formatTime(currentTime)}</div>
          <div className="text-gray-400 text-center text-sm">{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
