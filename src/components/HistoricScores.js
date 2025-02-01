// src/components/HistoricScores.js
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricScores = () => {
  // Retrieve scores from localStorage
  const storedScores = JSON.parse(localStorage.getItem('historicScores')) || [];

  // State for filter dropdowns
  const [filterGame, setFilterGame] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filter the scores based on the selected game and level
  const filteredScores = storedScores.filter(score => {
    const gameMatch = filterGame === "All" || score.game === filterGame;
    const levelMatch = filterLevel === "All" || score.level === filterLevel;
    return gameMatch && levelMatch;
  });

  // For the table, reverse the order so the latest entries come first
  const sortedScores = [...filteredScores].reverse();

  // Pagination: calculate total pages and slice the current page's data
  const totalPages = Math.ceil(sortedScores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentScores = sortedScores.slice(startIndex, startIndex + itemsPerPage);

  // For the graph, we want the data to display in chronological order (oldest first)
  const graphScores = [...filteredScores]; // oldest first

  // Prepare data for the graph:
  const graphData = {
    labels: graphScores.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Score Over Time',
        data: graphScores.map(score => score.score),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false, // We'll control height via CSS
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Score Over Time' },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'All Time',
        },
      },
    },
  };

  // Hardcode filter options (or derive them from data)
  const gameOptions = ["All", "Divide and Multiply"];
  const levelOptions = ["All", "easy", "medium", "hard", "ultra"];

  // Calculate statistics: number of plays and average score
  const numberOfPlays = filteredScores.length;
  const averageScore =
    numberOfPlays > 0
      ? (
          filteredScores.reduce((sum, record) => sum + record.score, 0) /
          numberOfPlays
        ).toFixed(2)
      : 0;

  // Handler functions for pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // When a filter changes, reset the current page
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Historic Scores</h2>
      
      {/* Filter Controls at the Top */}
      <div className="d-flex justify-content-center my-4">
        <div className="me-3">
          <label htmlFor="gameFilter" className="form-label">Game:</label>
          <select
            id="gameFilter"
            className="form-select"
            value={filterGame}
            onChange={handleFilterChange(setFilterGame)}
          >
            {gameOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="levelFilter" className="form-label">Level:</label>
          <select
            id="levelFilter"
            className="form-select"
            value={filterLevel}
            onChange={handleFilterChange(setFilterLevel)}
          >
            {levelOptions.map(option => (
              <option key={option} value={option}>
                {option === "All" ? "All" : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Graph (with reduced height) */}
      {graphScores.length > 0 && (
        <div className="my-4" style={{ height: '300px' }}>
          <Line data={graphData} options={graphOptions} />
        </div>
      )}

      {/* Display Statistics */}
      <div className="text-center mb-4">
        <p><strong>Number of Plays:</strong> {numberOfPlays}</p>
        <p><strong>Average Score:</strong> {averageScore}</p>
      </div>

      {/* Table of Historic Scores */}
      {currentScores.length > 0 ? (
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
            {currentScores.map((record, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-4">
          <button className="btn btn-secondary me-2" onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button className="btn btn-secondary ms-2" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoricScores;
