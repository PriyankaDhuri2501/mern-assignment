import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return ctx;
};

const STORAGE_KEY = 'cinevault_user_lists';

const loadFromStorage = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [watchlist, setWatchlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load lists when user changes
  useEffect(() => {
    if (!userId) {
      setWatchlist([]);
      setRecentlyViewed([]);
      return;
    }
    const all = loadFromStorage();
    const entry = all[userId] || { watchlist: [], recentlyViewed: [] };
    setWatchlist(entry.watchlist);
    setRecentlyViewed(entry.recentlyViewed);
  }, [userId]);

  // Persist lists when they change
  useEffect(() => {
    if (!userId) return;
    const all = loadFromStorage();
    all[userId] = {
      watchlist,
      recentlyViewed,
    };
    saveToStorage(all);
  }, [userId, watchlist, recentlyViewed]);

  const addToWatchlist = (movie) => {
    if (!userId || !movie?._id) return;
    setWatchlist((prev) => {
      if (prev.some((m) => m._id === movie._id)) return prev;
      const entry = {
        _id: movie._id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
      };
      return [entry, ...prev];
    });
  };

  const removeFromWatchlist = (movieId) => {
    if (!userId) return;
    setWatchlist((prev) => prev.filter((m) => m._id !== movieId));
  };

  const isInWatchlist = (movieId) => {
    if (!userId) return false;
    return watchlist.some((m) => m._id === movieId);
  };

  const addRecentlyViewed = (movie) => {
    if (!userId || !movie?._id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => m._id !== movie._id);
      const entry = {
        _id: movie._id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
      };
      const updated = [entry, ...filtered];
      return updated.slice(0, 20); // keep last 20
    });
  };

  const value = {
    watchlist,
    recentlyViewed,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addRecentlyViewed,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

