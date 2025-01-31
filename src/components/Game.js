// src/components/Game.js
import React, { useState, useEffect } from 'react';

const threshold = 3;

function generateProblem() {
  const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  if (operation === 'divide') {
    a = a * b; // ensures an integer result for division
  }
  return { a, b, operation };
}

const Game = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [joke, setJoke] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  // New state to track history of answers
  const [history, setHistory] = useState([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Effect for fetching a joke if the score qualifies
  useEffect(() => {
    if (gameOver && score >= threshold) {
      fetch('https://official-joke-api.appspot.com/jokes/random')
        .then((response) => response.json())
        .then((data) => setJoke(`${data.setup} ${data.punchline}`))
        .catch(() => setJoke("Couldn't load a joke this time."));
    }
  }, [gameOver, score]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine the correct answer for the current problem
    const correctAnswer =
      problem.operation === 'multiply'
        ? problem.a * problem.b
        : problem.a / problem.b;
    
    const userAnswer = parseInt(answer, 10);

    // Update score if correct
    if (userAnswer === correctAnswer) {
      setScore(score + 1);
    }
    
    // Record the current attempt in history
    const record = {
      problem: problem.operation === 'multiply'
        ? `${problem.a} x ${problem.b}`
        : `${problem.a} ÷ ${problem.b}`,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      isCorrect: userAnswer === correctAnswer
    };
    setHistory((prevHistory) => [...prevHistory, record]);

    // Prepare next problem
    setAnswer('');
    setProblem(generateProblem());
  };

  // When game is over, display summary and (if applicable) a joke
  if (gameOver) {
    return (
      <div className="container text-center mt-5">
        <h2>Time's up!</h2>
        <p>Your score: {score}</p>
        {score >= threshold ? (
          <div>
            <h3>Congratulations! Here's your joke:</h3>
            <p>{joke ? joke : 'Loading joke...'}</p>
          </div>
        ) : (
          <p>Good effort! Try again to earn a joke.</p>
        )}
        <hr />
        <h3>Answer Summary</h3>
        {history.length > 0 ? (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Problem</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.problem}</td>
                  <td>{record.userAnswer}</td>
                  <td>{record.correctAnswer}</td>
                  <td>
                    {record.isCorrect ? (
                      <span className="text-success">Correct</span>
                    ) : (
                      <span className="text-danger">Incorrect</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attempts recorded.</p>
        )}
      </div>
    );
  }

  // During the game, display the problem, timer, and score
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

export default Game;
