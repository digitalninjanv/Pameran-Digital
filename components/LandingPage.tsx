import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ARTWORKS_DATA } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const landingImage = ARTWORKS_DATA.find(art => art.id === 3)?.imageSrc || '';

  const handleEnterClick = () => {
    setIsExiting(true);
    // Wait for fade out animation to complete
    setTimeout(onEnter, 800); 
  };

  return (
    <div 
      className={`fixed inset-0 z-50 w-full h-screen overflow-hidden bg-black ${isExiting ? 'animate-fade-out' : ''}`}
    >
      {/* Background Image with Ken Burns */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center animate-kenburns"
        style={{ backgroundImage: `url(${landingImage})` }}
        aria-label="Karya seni abstrak Golden Hour"
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10"></div>
      
      {/* Content */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-white text-center p-8">
        <div 
          className="animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <h1 className="font-lora text-5xl md:text-7xl font-bold tracking-wide" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            GALERI AURA
          </h1>
        </div>
        <div
          className="animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          <p className="mt-4 text-lg md:text-xl max-w-xl" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
            Sebuah Ruang Dimana Seni Bercerita dan Jiwa Mendengarkan.
          </p>
        </div>
        <div
          className="animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <button
            onClick={handleEnterClick}
            className="mt-12 inline-flex items-center group px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-lora text-lg rounded-md shadow-lg hover:bg-white/20 transition-all duration-300"
          >
            Masuk Pameran
            <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;