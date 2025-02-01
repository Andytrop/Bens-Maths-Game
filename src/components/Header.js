// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <div className="text-center my-4">
      <img
        src="/title-garr1.png"
        alt="App Title"
        className="img-fluid mx-auto d-block"
        style={{ maxWidth: '80%', height: 'auto' }}
      />
    </div>
  );
};

export default Header;
