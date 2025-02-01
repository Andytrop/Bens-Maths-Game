// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './components/Home';
import HistoricScores from './components/HistoricScores';
import DCGame from './components/games/DCGame';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [player, setPlayer] = useState('');

  const handleLogin = (username) => {
    setPlayer(username);
    setLoggedIn(true);
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* Default route: show Login if not logged in; if logged in, redirect to Home */}
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />}
        />
        {/* Home page for game selection */}
        <Route
          path="/home"
          element={loggedIn ? <Home /> : <Navigate to="/" />}
        />
        {/* Historic Scores page */}
        <Route path="/historic-scores" element={<HistoricScores />} />
        {/* Dynamic Game Route: level parameter passed to DCGame */}
        <Route
          path="/game/:level"
          element={loggedIn ? <DCGame playerName={player} /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
