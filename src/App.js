// src/App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Game from './components/Game';




function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = username => {
    setUser(username);
    setLoggedIn(true);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <div className="container text-center mt-5">
          <h1>Welcome, {user}!</h1>
          <Game />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
