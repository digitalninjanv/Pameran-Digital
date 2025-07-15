import React, { useState, useCallback, useEffect } from 'react';
import { Artwork, GuestbookEntry } from './types';
import ArtworkGrid from './components/ArtworkGrid';
import ArtworkDetail from './components/ArtworkDetail';
import Guestbook from './components/Guestbook';
import LandingPage from './components/LandingPage';
import { ARTWORKS_DATA } from './constants';
import { BookOpen, Palette } from 'lucide-react';

const GUESTBOOK_STORAGE_KEY = 'virtualGalleryGuestbook';

type View = 'grid' | 'detail';

const App: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [view, setView] = useState<View>('grid');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const storedEntries = window.localStorage.getItem(GUESTBOOK_STORAGE_KEY);
      return storedEntries ? JSON.parse(storedEntries) : [];
    } catch (error) {
      console.error("Failed to load guestbook entries from localStorage", error);
      return [];
    }
  });
  const [showGuestbook, setShowGuestbook] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(guestbookEntries));
    } catch (error) {
      console.error("Failed to save guestbook entries to localStorage", error);
    }
  }, [guestbookEntries]);

  const handleEnterGallery = () => {
    setShowLandingPage(false);
  };

  const handleSelectArtwork = useCallback((artwork: Artwork) => {
    window.scrollTo(0, 0);
    setSelectedArtwork(artwork);
    setView('detail');
  }, []);

  const handleBackToGrid = useCallback(() => {
    setSelectedArtwork(null);
    setView('grid');
  }, []);

  const handleAddGuestbookEntry = useCallback((name: string, comment: string) => {
    const newEntry: GuestbookEntry = {
      id: Date.now(),
      name,
      comment,
      timestamp: new Date().toLocaleString('id-ID'),
    };
    setGuestbookEntries(prev => [newEntry, ...prev]);
  }, []);
  
  if (showLandingPage) {
    return <LandingPage onEnter={handleEnterGallery} />;
  }

  return (
    <main className="w-full min-h-screen animate-fade-in">
      <header className="sticky top-0 z-30 p-4 sm:p-6 flex justify-between items-center bg-[var(--color-bg)]/80 backdrop-blur-md border-b" style={{borderColor: 'var(--color-border)'}}>
        <div className="flex items-center space-x-3">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider font-lora text-primary">
            GALERI AURA
          </h1>
        </div>
        <button
          onClick={() => setShowGuestbook(!showGuestbook)}
          className="flex items-center px-4 py-2 bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 hover:text-primary rounded-lg shadow-sm transition-colors duration-300"
          aria-label="Buka buku tamu"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Buku Tamu
        </button>
      </header>

      <div className="relative">
        {view === 'grid' && (
          <ArtworkGrid 
            artworks={ARTWORKS_DATA} 
            onSelectArtwork={handleSelectArtwork} 
          />
        )}
        {view === 'detail' && selectedArtwork && (
          <ArtworkDetail 
            artwork={selectedArtwork}
            onBack={handleBackToGrid}
          />
        )}
      </div>

      {showGuestbook && (
          <Guestbook 
            entries={guestbookEntries} 
            onAddEntry={handleAddGuestbookEntry}
            onClose={() => setShowGuestbook(false)}
          />
      )}
    </main>
  );
};

export default App;