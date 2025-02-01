// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Game from './components/Game';
import HistoricScores from './components/HistoricScores';
import Header from './components/Header';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [player, setPlayer] = useState('');

  const handleLogin = (username) => {
    setPlayer(username);
    setLoggedIn(true);
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <Game playerName={player} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/historic-scores" element={<HistoricScores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
