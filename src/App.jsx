// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WatchlistProvider } from './context/WatchlistContext';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import SearchPage from './pages/SearchPage';
import ExplorePage from './pages/ExplorePage';
import WatchlistPage from './pages/WatchlistPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <WatchlistProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/:mediaType/:id" element={<DetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/explore/:query" element={<ExplorePage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </WatchlistProvider>
    </AppProvider>
  );
}

export default App;
