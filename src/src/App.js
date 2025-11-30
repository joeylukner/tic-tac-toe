import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ background: winner ? "#FFFF007F" : "#fff" }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    nextSquares[9] = i;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let winningSquares;
  let status;
  if (winner === "-") {
    status = "It's a draw!";
  } else if (winner) {
    status = "Winner: " + winner[0];
    winningSquares = [winner[1], winner[2], winner[3]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    winningSquares = null;
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(3)].map((_, row) => (
        <div className="board-row">
          {[...Array(3)].map((_, col) => (
            <Square
              value={squares[row * 3 + col]}
              onSquareClick={() => handleClick(row * 3 + col)}
              winner={
                winningSquares ? winningSquares.includes(row * 3 + col) : false
              }
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(10).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]; // History is an array where each entry is the 9 squares on the board. Can I use the history array to store/retrieve whichever move was made last?
  const [sortOrder, setSortOrder] = useState(1);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSort() {
    setSortOrder(!sortOrder);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let row = squares[9] / 3;
    let col = squares[9] % 3; // Right now squares SHOULD be storing the metadata of what move was made
    if (move === history.length - 1) {
      return <li key={move}>You are at move #{move}</li>;
    } else if (move > 0) {
      description =
        "Go to move #" + move + ". Row: " + { row } + " Col: " + { col };
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const reversedMoves = moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleSort}>Reverse sort order</button>
        <ol>{sortOrder ? moves : reversedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
  ];

  const foundSquares = new Set();

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a]) foundSquares.add(a);
    if (squares[b]) foundSquares.add(b);
    if (squares[c]) foundSquares.add(c);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    } else if (foundSquares.size === 9) {
      return "-";
    }
  }
  return null;
}
