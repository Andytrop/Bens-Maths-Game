// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './components/Home';
import HistoricScores from './components/HistoricScores';
import MedGame from './components/games/MedGame';  // Updated import (ensure file name and path are correct)

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
        <Route
          path="/"
          element={
            loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/home"
          element={loggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/game"
          element={loggedIn ? <MedGame playerName={player} /> : <Navigate to="/" />}
        />
        <Route path="/historic-scores" element={<HistoricScores />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
