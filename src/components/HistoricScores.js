// src/components/HistoricScores.js
import React from 'react';

const HistoricScores = () => {
  const scores = JSON.parse(localStorage.getItem('historicScores')) || [];

  return (
    <div className="container mt-5">
      <h2 className="text-center">Historic Scores</h2>
      {scores.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Player Name</th>
              <th>Score</th>
              <th>Game</th>
              <th>Level</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((record, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{record.player}</td>
                <td>{record.score}</td>
                <td>{record.game}</td>
                <td>{record.level}</td>
                <td>{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No historic scores available.</p>
      )}
    </div>
  );
};

export default HistoricScores;
