import React, { useRef, useState, useEffect } from 'react';
import { Artwork } from '../types';
import { Loader2, ImageOff } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
  onSelect: () => void;
  style: React.CSSProperties;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onSelect, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = artwork.imageSrc;
    img.onload = () => {
      if (isMounted) setImageStatus('loaded');
    };
    img.onerror = () => {
      if (isMounted) setImageStatus('error');
    };
    return () => {
      isMounted = false;
    };
  }, [artwork.imageSrc]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;
    
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      className="group [perspective:1000px] animate-card-load"
      style={style}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail untuk ${artwork.title}`}
      onKeyPress={(e) => e.key === 'Enter' && onSelect()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className="relative min-h-[300px] bg-white overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-out [transform-style:preserve-3d] border border-[var(--color-border)] group-hover:shadow-primary-soft"
      >
        {imageStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin" />
          </div>
        )}
        {imageStatus === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
            <ImageOff className="w-10 h-10 text-[var(--color-secondary)]" />
            <span className="mt-2 text-xs text-gray-500 text-center">Gambar tidak dapat dimuat</span>
          </div>
        )}
        {imageStatus === 'loaded' && (
          <img 
            src={artwork.imageSrc} 
            alt={artwork.title} 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 transition-all duration-300 group-hover:bg-black/10"></div>
        
        <div className="absolute bottom-0 left-0 p-6 [transform:translateZ(40px)]">
          <h3 className="text-2xl font-lora text-white transition-colors duration-300 group-hover:text-white">{artwork.title}</h3>
          <p className="text-md text-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">{artwork.artist}</p>
        </div>
      </div>
    </div>
  );
};


interface ArtworkGridProps {
  artworks: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onSelectArtwork }) => {
  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {artworks.map((artwork, index) => (
          <ArtworkCard 
            key={artwork.id} 
            artwork={artwork} 
            onSelect={() => onSelectArtwork(artwork)} 
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;