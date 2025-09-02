"use client";
import { useEffect, useState } from "react";

const initialBoard = Array(9).fill(null);

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState<(string | null)[]>(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameEnded, setGameEnded] = useState(false);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const status = winner
    ? `Winner: Player ${winner}`
    : isDraw
      ? "Draw!"
      : `Player ${xIsNext ? "X" : "O"}'s turn`;

  useEffect(() => {
    if (winner && !gameEnded) {
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner as keyof typeof prev] + 1
      }));
      setGameEnded(true);
      setStarted(false);
    } else if (isDraw && !gameEnded) {
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
      setGameEnded(true);
      setStarted(false);
    }
  }, [winner, isDraw, gameEnded]);

  function handleClick(idx: number) {
    if (!started || board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function startNewGame() {
    setBoard(initialBoard);
    setXIsNext(true);
    setStarted(true);
    setGameEnded(false);
  }

  function resetCurrentGame() {
    setBoard(initialBoard);
    setXIsNext(true);
    setStarted(false);
    setGameEnded(false);
  }

  function resetAll() {
    setBoard(initialBoard);
    setXIsNext(true);
    setStarted(false);
    setGameEnded(false);
    setScores({ X: 0, O: 0, draws: 0 });
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl w-full">

        {/* Column 1 - Game Title and Board */}
        <div className="flex flex-col items-center space-y-6 p-6 border border-gray-300 rounded-lg bg-white">
          <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>

          <div className="flex items-center justify-center">
            <div className="relative border-4 border-gray-400 rounded-lg overflow-hidden">
              {/* Game Board */}
              <div className="grid grid-cols-3 gap-2 p-4">
                {board.map((cell, idx) => (
                  <button
                    key={idx}
                    className={`
                      w-30 h-30 text-2xl font-bold border-2 rounded shadow transition
                      ${cell === 'X' ? 'bg-blue-500 text-white border-blue-600' : ''}
                      ${cell === 'O' ? 'bg-red-500 text-white border-red-600' : ''}
                      ${!cell ? 'bg-white border-gray-400 hover:bg-gray-200' : ''}
                      ${!started ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onClick={() => handleClick(idx)}
                    disabled={!started}
                  >
                    {cell}
                  </button>
                ))}
              </div>

              {/* Blur overlay */}
              {!started && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300" />
              )}

              {/* Button overlay */}
              {!started && (
                <button
                  onClick={startNewGame}
                  className={`
                    text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    px-6 py-4 rounded-lg shadow-lg z-10 transition-colors duration-200
                    ${gameEnded
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'}
                    text-white
                  `}
                >
                  {gameEnded
                    ? (winner ? `🎉 ${winner} Won! 🎊 Click to play again` : '🤝 Draw! Click to play again')
                    : '👉 Click here to start'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column 2 - Scoreboard, Status and Controls */}
        <div className="flex flex-col space-y-6 border border-gray-300 rounded-lg bg-white p-6">
          <h1 className="text-3xl font-bold text-center">Game Info</h1>

          {/* Scoreboard */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-xl font-semibold mb-3">Scoreboard</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-blue-100 rounded border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{scores.X}</div>
                <div className="text-sm text-gray-600">Player X</div>
              </div>
              <div className="text-center p-2 bg-red-100 rounded border border-red-200">
                <div className="text-2xl font-bold text-red-700">{scores.O}</div>
                <div className="text-sm text-gray-600">Player O</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded border border-gray-300">
                <div className="text-2xl font-bold text-gray-700">{scores.draws}</div>
                <div className="text-sm text-gray-600">Draws</div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Status:</h3>
            <div className="text-lg">
              {started || gameEnded ? status : 'Press Start to begin'}
            </div>
          </div>

          {/* Rules */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Rules:</h3>
            <div className="text-base text-gray-700">
              First to get three in a row wins
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-3 pt-4">
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={resetCurrentGame}
            >
              Reset Current Game
            </button>

            <button
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={resetAll}
            >
              Reset All (Clear Scores)
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}