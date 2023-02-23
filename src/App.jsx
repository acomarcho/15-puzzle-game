import { useState, useEffect, useRef } from "react";

const grids = [
  [
    [0, 12, 9, 13],
    [15, 11, 10, 14],
    [3, 7, 2, 5],
    [4, 8, 6, 1],
  ],
  [
    [0, 12, 10, 13],
    [15, 11, 14, 9],
    [3, 7, 2, 5],
    [4, 8, 6, 1],
  ],
  [
    [0, 11, 9, 13],
    [12, 15, 10, 14],
    [3, 7, 6, 2],
    [4, 8, 5, 1],
  ],
  [
    [0, 15, 9, 13],
    [11, 12, 10, 14],
    [3, 7, 6, 2],
    [4, 8, 5, 1],
  ],
  [
    [0, 12, 10, 13],
    [15, 11, 14, 9],
    [7, 8, 6, 2],
    [4, 3, 5, 1],
  ],
];

const isWinCondition = (matrix) => {
  const toCheck = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
  ];
  let diff = 0;
  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell != toCheck[i][j]) {
        diff++;
      }
    });
  });
  return diff === 0;
};

const App = () => {
  const [grid, setGrid] = useState([]);
  const [zeroPosition, setZeroPosition] = useState([]);
  const [time, setTime] = useState(-1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (zeroPosition.length == 0) {
      return;
    }
    const keyUpFunc = (e) => {
      const keyPressed = e.key.toLowerCase();
      let x = zeroPosition[0];
      let y = zeroPosition[1];
      if ((keyPressed === "d" || keyPressed === "arrowright") && y > 0) {
        setGrid((oldGrid) => {
          let oldValue = oldGrid[x][y - 1];
          oldGrid[x][y - 1] = 0;
          oldGrid[x][y] = oldValue;
          return oldGrid;
        });
        setZeroPosition((oldPosition) => {
          return [oldPosition[0], oldPosition[1] - 1];
        });
      } else if ((keyPressed === "s" || keyPressed === "arrowdown") && x > 0) {
        setGrid((oldGrid) => {
          let oldValue = oldGrid[x - 1][y];
          oldGrid[x - 1][y] = 0;
          oldGrid[x][y] = oldValue;
          return oldGrid;
        });
        setZeroPosition((oldPosition) => {
          return [oldPosition[0] - 1, oldPosition[1]];
        });
      } else if ((keyPressed === "a" || keyPressed === "arrowleft") && y < 3) {
        setGrid((oldGrid) => {
          console.log("before", oldGrid);
          let oldValue = oldGrid[x][y + 1];
          oldGrid[x][y + 1] = 0;
          oldGrid[x][y] = oldValue;
          console.log("after", oldGrid);
          return oldGrid;
        });
        setZeroPosition((oldPosition) => {
          return [oldPosition[0], oldPosition[1] + 1];
        });
      } else if ((keyPressed === "w" || keyPressed === "arrowup") && x < 3) {
        setGrid((oldGrid) => {
          let oldValue = oldGrid[x + 1][y];
          oldGrid[x + 1][y] = 0;
          oldGrid[x][y] = oldValue;
          return oldGrid;
        });
        setZeroPosition((oldPosition) => {
          return [oldPosition[0] + 1, oldPosition[1]];
        });
      }
    };
    document.addEventListener("keyup", keyUpFunc);
    return () => {
      document.removeEventListener("keyup", keyUpFunc);
    };
  }, [zeroPosition]);

  useEffect(() => {
    if (isWinCondition(grid) && grid.length > 0) {
      clearTimeout(timeoutRef.current);
      setZeroPosition([]);
      setGrid([]);
      alert(`Congratulations, you won in ${time} seconds!`);
      setTime(-1);
    }
  }, [grid]);

  useEffect(() => {
    if (time < 0) {
      return;
    }
    
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [time]);

  const onStart = () => {
    setZeroPosition([0, 0]);
    setGrid(
      JSON.parse(JSON.stringify(grids[getRandomInt(0, grids.length - 1)]))
    );

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTime(0);
  };

  return (
    <div className="centerWrapper">
      <div className="title">
        <h1>15 Puzzle Game</h1>
        <p>
          Use W, A, S, and D (or arrow keys) to move tiles into the empty space.
        </p>
      </div>
      <div className="buttonContainer">
        <button
          onClick={() => {
            onStart();
          }}
        >
          Start game!
        </button>
      </div>
      {time > 0 && (
        <div className="time">
          <p>Time elapsed: {time} seconds</p>
        </div>
      )}
      {grid.length > 0 && (
        <div className="gameGrid">
          {grid.map((row) => {
            return (
              <div className="row">
                {row.map((val) => {
                  return (
                    <div className="cell">{val !== 0 && <p>{val}</p>}</div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
