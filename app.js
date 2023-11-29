const puzzles = {
  easy: [
    ["c", "a", "t", "s"],
    ["d", "o", "g", "s"],
    ["b", "i", "r", "d"],
    ["f", "i", "s", "h"],
  ],
  medium: [
    ["h", "e", "l", "l", "o"],
    ["w", "o", "r", "l", "d"],
    ["j", "a", "v", "a", "s"],
    ["s", "c", "r", "i", "p"],
    ["t", "c", "o", "d", "e"],
  ],
  hard: [
    ["p", "u", "z", "z", "l", "e"],
    ["g", "a", "m", "e", "s", "r"],
    ["u", "l", "e", "a", "w", "e"],
    ["w", "o", "r", "d", "s", "e"],
    ["a", "r", "c", "h", "i", "v"],
    ["e", "m", "e", "n", "t", "s"],
  ],
};

let emptyTile = {
  tile: null,
  row: null,
  col: null,
};

let selectedWords = [];
const difficultyLevels = ["easy", "medium", "hard"];

let currentLevel = "easy";
let currentGrid = [];
let solutionGrid = [];
let timerInterval;
let score = 0;

function shuffleGrid(grid) {
  for (let row = grid.length - 1; row > 0; row--) {
    for (let col = grid[row].length - 1; col > 0; col--) {
      const randomRow = Math.floor(Math.random() * (row + 1));
      const randomCol = Math.floor(Math.random() * (col + 1));
      const temp = grid[row][col];
      grid[row][col] = grid[randomRow][randomCol];
      grid[randomRow][randomCol] = temp;
    }
  }
}

function hideLetters(grid) {
  const difficultyIndex = difficultyLevels.indexOf(currentLevel);
  const lettersToHide = Math.floor(
    grid.length * grid[0].length * (difficultyIndex + 1) * 0.1
  );

  for (let i = 0; i < lettersToHide; i++) {
    const randomRow = Math.floor(Math.random() * grid.length);
    const randomCol = Math.floor(Math.random() * grid[0].length);
    grid[randomRow][randomCol] = "";
  }
}

function createWordSearchBoard() {
  const puzzleBoard = document.getElementById("puzzle-board");

  puzzleBoard.innerHTML = "";
  currentGrid = [];
  solutionGrid = [];

  for (let row = 0; row < puzzles[currentLevel].length; row++) {
    currentGrid[row] = [];
    solutionGrid[row] = [];

    for (let col = 0; col < puzzles[currentLevel][row].length; col++) {
      const letter = puzzles[currentLevel][row][col];
      currentGrid[row][col] = letter;
      solutionGrid[row][col] = letter;
    }
  }

  shuffleGrid(currentGrid);
  hideLetters(currentGrid);

  for (let row = 0; row < currentGrid.length; row++) {
    for (let col = 0; col < currentGrid[row].length; col++) {
      const tile = document.createElement("div");
      tile.className = "puzzle-tile";
      tile.textContent = currentGrid[row][col];
      tile.setAttribute("data-row", row);
      tile.setAttribute("data-col", col);

      if (currentGrid[row][col] === "") {
        tile.classList.add("empty");
        emptyTile.tile = tile;
        emptyTile.row = row;
        emptyTile.col = col;
      }

      puzzleBoard.appendChild(tile);
    }
  }

  const puzzleTiles = document.getElementsByClassName("puzzle-tile");
  for (let i = 0; i < puzzleTiles.length; i++) {
    puzzleTiles[i].addEventListener("click", handleTileClick);
  }
}

function handleTileClick(event) {
  const clickedTile = event.target;

  if (clickedTile.classList.contains("empty")) {
    const clickedRow = parseInt(clickedTile.getAttribute("data-row"));
    const clickedCol = parseInt(clickedTile.getAttribute("data-col"));

    if (
      (Math.abs(clickedRow - emptyTile.row) === 1 &&
        clickedCol === emptyTile.col) ||
      (Math.abs(clickedCol - emptyTile.col) === 1 &&
        clickedRow === emptyTile.row)
    ) {
      const temp = currentGrid[clickedRow][clickedCol];
      currentGrid[clickedRow][clickedCol] =
        currentGrid[emptyTile.row][emptyTile.col];
      currentGrid[emptyTile.row][emptyTile.col] = temp;

      clickedTile.textContent = currentGrid[clickedRow][clickedCol];
      clickedTile.classList.remove("empty");
      emptyTile.tile.textContent = "";
      emptyTile.tile.classList.add("empty");

      emptyTile.row = clickedRow;
      emptyTile.col = clickedCol;

      if (isPuzzleSolved()) {
        stopTimer();
        alert("Congratulations! Puzzle solved!");
      }
    }
  }
}

function isPuzzleSolved() {
  for (let row = 0; row < currentGrid.length; row++) {
    for (let col = 0; col < currentGrid[row].length; col++) {
      if (currentGrid[row][col] !== solutionGrid[row][col]) {
        return false;
      }
    }
  }
  return true;
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  let seconds = 0;

  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

function resetGame() {
  stopTimer();
  selectedWords = [];
  score = 0;
  document.getElementById("score").textContent = "0";
  createWordSearchBoard();
}

function handleHintClick() {
  const hintWord =
    selectedWords[Math.floor(Math.random() * selectedWords.length)];
  alert(`Hint: The word is "${hintWord}"`);
}

function handleDifficultyChange() {
  const difficultySelect = document.getElementById("difficulty");
  currentLevel = difficultySelect.value;
  resetGame();
}

function initializeGame() {
  const hintButton = document.getElementById("hint-button");
  const difficultySelect = document.getElementById("difficulty");

  hintButton.addEventListener("click", handleHintClick);
  difficultySelect.addEventListener("change", handleDifficultyChange);

  createWordSearchBoard();
  startTimer();
}

initializeGame();
