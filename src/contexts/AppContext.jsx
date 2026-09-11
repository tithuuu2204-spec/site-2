import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('eh_favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [notifications, setNotifications] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    localStorage.setItem('eh_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const addFavorite = (id) => setFavorites(prev => new Set([...prev, id]));
  
  const removeFavorite = (id) => setFavorites(prev => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
  
  const isFavorite = (id) => favorites.has(id);
  const clearFavorites = () => setFavorites(new Set());

  const addNotification = (msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => clearNotification(id), 5000);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err)
      );
    }
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    notifications,
    addNotification,
    clearNotification,
    searchHistory,
    currentLocation,
    requestLocation
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
