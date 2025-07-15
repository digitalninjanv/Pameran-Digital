import React, { useState, useEffect, useCallback } from 'react';
import { Artwork } from '../types';
import { getArtCritique } from '../services/geminiService';
import { ArrowLeft, Sparkles, Loader2, Headphones, Square, Mail } from 'lucide-react';

interface ArtworkDetailProps {
  artwork: Artwork;
  onBack: () => void;
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, onBack }) => {
  const [critique, setCritique] = useState<string>('');
  const [displayedCritique, setDisplayedCritique] = useState('');
  const [isLoadingCritique, setIsLoadingCritique] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleGetCritique = useCallback(async () => {
    if (isLoadingCritique) return;
    setIsLoadingCritique(true);
    setCritique('');
    setDisplayedCritique('');
    const result = await getArtCritique(artwork.title, artwork.artist, artwork.description);
    setCritique(result);
    setIsLoadingCritique(false);
  }, [artwork, isLoadingCritique]);

  // Typing effect for AI critique
  useEffect(() => {
    if (critique && !isLoadingCritique) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedCritique(critique.substring(0, i + 1));
        i++;
        if (i >= critique.length) {
          clearInterval(interval);
        }
      }, 25); // Typing speed
      return () => clearInterval(interval);
    }
  }, [critique, isLoadingCritique]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);
  
  // Cleanup speech synthesis on component unmount or artwork change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [artwork.id]);

  const handleToggleAudio = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Combine elements for a more natural audio guide
      const textToSpeak = `${artwork.title}. Oleh ${artwork.artist}. ${artwork.description}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
          console.error("Speech synthesis error");
          setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking, artwork]);

  return (
    <div className="w-full min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <header className="mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center text-gray-500 hover:text-primary transition-colors"
            aria-label="Kembali ke galeri"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Galeri
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-28 border border-[var(--color-border)] p-2">
                <img
                  src={artwork.imageSrc}
                  alt={artwork.title}
                  className="w-full h-auto object-contain max-h-[75vh] rounded-md"
                />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-grow">
              <h1 className="text-4xl lg:text-5xl font-bold font-lora text-primary">{artwork.title}</h1>
              <p className="text-xl text-gray-500 mt-2">Oleh {artwork.artist}, {artwork.year}</p>
              
              <div className="mt-6 text-sm text-gray-600 space-y-2 border-t border-b border-[var(--color-border)] py-4">
                  <p><span className="font-semibold text-gray-800">Medium:</span> {artwork.medium}</p>
                  <p><span className="font-semibold text-gray-800">Dimensi:</span> {artwork.dimensions}</p>
              </div>
              
              <p className="mt-6 text-gray-700 leading-relaxed text-base">{artwork.description}</p>
              
              <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                  <h3 className="text-lg font-semibold font-lora text-primary mb-4">Analisis AURA</h3>
                  {!critique && !isLoadingCritique && (
                      <button 
                          onClick={handleGetCritique}
                          className="flex items-center justify-center px-4 py-2 bg-primary hover:opacity-90 text-white rounded-lg transition-opacity w-full font-semibold"
                      >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Minta Analisis
                      </button>
                  )}
                  {isLoadingCritique && (
                      <div className="flex items-center justify-start p-4 bg-gray-100 rounded-lg">
                          <Loader2 className="w-6 h-6 animate-spin mr-3 text-primary" />
                          <span>AURA sedang merenung...</span>
                      </div>
                  )}
                  {displayedCritique && (
                       <div className="p-4 bg-gray-50 border border-[var(--color-border)] rounded-lg text-gray-700 min-h-[100px]">
                          <p className="italic">
                            "{displayedCritique}"
                            {displayedCritique.length < critique.length && <span className="inline-block w-0.5 h-4 bg-gray-500 animate-blink ml-1 align-text-bottom"></span>}
                          </p>
                          {displayedCritique.length === critique.length && 
                            <p className="text-right text-sm text-primary/80 mt-2">- AURA</p>
                          }
                      </div>
                  )}
              </div>

               <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                  <h3 className="text-lg font-semibold font-lora text-primary mb-4">Fitur Interaktif</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleToggleAudio}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors font-semibold"
                    >
                      {isSpeaking ? (
                        <>
                          <Square className="w-5 h-5 mr-2" />
                          Hentikan Panduan
                        </>
                      ) : (
                        <>
                          <Headphones className="w-5 h-5 mr-2" />
                          Dengarkan Panduan Audio
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:kontak@galeriaura.com?subject=Pertanyaan%20mengenai%20karya%20seni:%20${encodeURIComponent(artwork.title)}&body=${encodeURIComponent(`Saya tertarik untuk mengetahui lebih lanjut mengenai karya "${artwork.title}" oleh ${artwork.artist}.`)}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-primary bg-primary text-white hover:opacity-90 rounded-lg transition-opacity font-semibold"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Tanya untuk Membeli
                    </a>
                  </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;