import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 mt-40 lg:px-36 w-full text-gray-300 bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-700 pb-14">
        <div className="md:max-w-96">
          <img alt="Logo" className="h-11 transform hover:scale-105 transition-transform duration-300" src={assets.logo} />
          <p className="mt-6 text-sm leading-relaxed opacity-80 hover:opacity-100 transition-opacity duration-300">
             Since our launch, we have revolutionized the movie booking experience.
Our platform allows movie lovers to easily reserve their seats, discover the latest blockbusters, and enjoy exclusive offers. Join millions of users who trust us for their next cinema outing.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <img 
              src={assets.appStore} 
              alt="google play" 
              className="h-10 w-auto transform hover:scale-110 transition-all duration-300 cursor-pointer" 
            />
            <img 
              src={assets.googlePlay} 
              alt="app store" 
              className="h-11 w-auto transform hover:scale-110 transition-all duration-300 cursor-pointer" 
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row items-start md:justify-end gap-16 md:gap-24 lg:gap-32 mt-8 md:mt-0">
          <div>
            <h2 className="font-bold text-lg mb-6 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-blue-500">
              Company
            </h2>
            <ul className="text-sm space-y-3">
              {['Home', 'About us', 'Contact us', 'Privacy policy'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-all duration-300 hover:pl-2 block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="font-bold text-lg mb-6 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-green-500">
              Get in touch
            </h2>
            <div className="text-sm space-y-3">
              <p className="flex items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                +237-234-567-890
              </p>
              <p className="flex items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 pb-2 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-center md:text-left opacity-80">
          Copyright {new Date().getFullYear()} © 
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 ml-1 font-medium">
            TheMagician
          </a>. All Right Reserved.
        </p>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          {[assets.facebook, assets.twitter, assets.instagram, assets.linkedin].map((social, index) => (
            <a 
              key={index}
              href="#" 
              className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
            >
              <img src={social} alt="social media" className="w-4 h-4 filter invert" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;