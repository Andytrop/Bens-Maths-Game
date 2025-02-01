// src/games/med-game.js
import React, { useState, useEffect } from 'react';
import Results from '../../components/Results';

const threshold = 3;

function generateProblem() {
  const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  if (operation === 'divide') {
    a = a * b; // ensures division results in an integer
  }
  return { a, b, operation };
}

const MedGame = ({ playerName }) => {
  const [problem, setProblem] = useState(generateProblem());
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

  // When game is over: save historic score, fetch joke (if score is high enough), and show confetti
  useEffect(() => {
    if (gameOver) {
      // Retrieve historic scores or initialize an empty array
      const historicScores = JSON.parse(localStorage.getItem('historicScores')) || [];
      // Create a new score record including additional properties: game and level
      const newScore = {
        player: playerName || 'Anonymous',
        score,
        date: new Date().toLocaleString(),
        game: "Divide and Multiply",
        level: "medium",
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
  }, [gameOver, score, playerName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctAnswer =
      problem.operation === 'multiply'
        ? problem.a * problem.b
        : problem.a / problem.b;
    const userAnswer = parseInt(answer, 10);

    if (userAnswer === correctAnswer) {
      setScore(score + 1);
    }

    const record = {
      problem:
        problem.operation === 'multiply'
          ? `${problem.a} x ${problem.b}`
          : `${problem.a} ÷ ${problem.b}`,
      userAnswer: answer,
      correctAnswer,
      isCorrect: userAnswer === correctAnswer,
    };
    setHistory((prevHistory) => [...prevHistory, record]);
    setAnswer('');
    setProblem(generateProblem());
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(20);
    setHistory([]);
    setGameOver(false);
    setJoke(null);
    setShowConfetti(false);
    setProblem(generateProblem());
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
      <h2>Math Game</h2>
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

export default MedGame;
