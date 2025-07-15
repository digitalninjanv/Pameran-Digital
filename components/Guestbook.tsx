import React, { useState } from 'react';
import { GuestbookEntry } from '../types';
import { X, MessageSquare, Send } from 'lucide-react';

interface GuestbookProps {
  entries: GuestbookEntry[];
  onAddEntry: (name: string, comment: string) => void;
  onClose: () => void;
}

const Guestbook: React.FC<GuestbookProps> = ({ entries, onAddEntry, onClose }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Nama dan komentar harus diisi.');
      return;
    }
    onAddEntry(name, comment);
    setName('');
    setComment('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full bg-[var(--color-bg)] shadow-2xl flex flex-col animate-slide-in border-l border-[var(--color-border)]">
        <header className="p-4 flex justify-between items-center border-b border-[var(--color-border)] flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center font-lora text-primary">
            <MessageSquare className="w-6 h-6 mr-3" />
            Buku Tamu
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-primary" aria-label="Tutup buku tamu">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
          {entries.length === 0 ? (
            <div className="text-center text-gray-500 pt-10">
              <p>Belum ada yang meninggalkan pesan.</p>
              <p>Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white p-3 rounded-md border border-[var(--color-border)]">
                  <p className="text-gray-700 whitespace-pre-wrap break-words">"{entry.comment}"</p>
                  <div className="text-right font-semibold text-sm text-primary mt-2">
                    - {entry.name}
                  </div>
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {entry.timestamp}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="p-4 border-t border-[var(--color-border)] flex-shrink-0 bg-white/50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nama Anda..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-white border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 placeholder-gray-400"
              aria-label="Nama Anda"
            />
            <textarea
              placeholder="Tulis komentar Anda..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full p-2 bg-white border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 placeholder-gray-400"
              aria-label="Komentar Anda"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full flex items-center justify-center p-2 bg-primary hover:opacity-90 text-white rounded-md font-bold transition-opacity font-lora tracking-wider">
              <Send className="w-4 h-4 mr-2" />
              Kirim Pesan
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Guestbook;