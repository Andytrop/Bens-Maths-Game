// src/components/games/DCGame.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Results from '../../components/Results';
import { generateProblem } from '../../components/games/DCGameLogic';

const threshold = 3;

const DCGame = ({ playerName }) => {
  // Get the level from the URL parameters
  const { level } = useParams();  // level is expected to be "easy", "medium", "hard", or "ultra"

  // Set the difficulty for generateProblem based on the level
  const [problem, setProblem] = useState(generateProblem(level));
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [joke, setJoke] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Timer: decrease time every second until it reaches 0
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // When the game is over: save historic score, fetch a joke (if score is high enough), and show confetti
  useEffect(() => {
    if (gameOver) {
      const historicScores = JSON.parse(localStorage.getItem('historicScores')) || [];
      const newScore = {
        player: playerName || 'Anonymous',
        score,
        date: new Date().toLocaleString(),
        game: "Divide and Multiply",
        level: level || "medium",  // Use the URL parameter, fallback to "medium"
      };
      historicScores.push(newScore);
      localStorage.setItem('historicScores', JSON.stringify(historicScores));

      if (score >= threshold) {
        fetch('https://official-joke-api.appspot.com/jokes/random')
          .then((response) => response.json())
          .then((data) => setJoke(`${data.setup} ${data.punchline}`))
          .catch(() => setJoke("Couldn't load a joke this time."));
        setShowConfetti(true);
        const confettiTimeout = setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
        return () => clearTimeout(confettiTimeout);
      }
    }
  }, [gameOver, score, playerName, level]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { a, b, operation } = problem;
    const correctAnswer = operation === 'multiply' ? a * b : a / b;
    const userAnswer = parseInt(answer, 10);

    if (userAnswer === correctAnswer) {
      setScore(score + 1);
    }

    const record = {
      problem: operation === 'multiply' ? `${a} x ${b}` : `${a} ÷ ${b}`,
      userAnswer: answer,
      correctAnswer,
      isCorrect: userAnswer === correctAnswer,
    };

    setHistory((prevHistory) => [...prevHistory, record]);
    setAnswer('');
    setProblem(generateProblem(level));
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(20);
    setHistory([]);
    setGameOver(false);
    setJoke(null);
    setShowConfetti(false);
    setProblem(generateProblem(level));
  };

  if (gameOver) {
    return (
      <Results
        score={score}
        joke={joke}
        history={history}
        restartGame={restartGame}
        showConfetti={showConfetti}
        threshold={threshold}
      />
    );
  }

  return (
    <div className="container text-center mt-5">
      <h2>Math Game ({level && level.charAt(0).toUpperCase() + level.slice(1)})</h2>
      <p>Time Left: {timeLeft} seconds</p>
      <p>Score: {score}</p>
      <div className="my-4">
        <p className="fs-4">
          {problem.operation === 'multiply'
            ? `${problem.a} x ${problem.b}`
            : `${problem.a} ÷ ${problem.b}`}
        </p>
        <form onSubmit={handleSubmit} className="d-flex justify-content-center">
          <input
            type="number"
            className="form-control w-50 me-2"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DCGame;
