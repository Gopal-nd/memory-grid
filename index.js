
const gridSizeInput = document.getElementById('gridSize');
const gridSizeValue = document.getElementById('gridSizeValue');
const grid = document.getElementById('grid');
let combinations = [];
let compareCombination = [];
let first = null;
let second = null;
let canClick = true; // New flag to control click handling

GenerateCombinations(2);

function ShuffleElement(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function GenerateCombinations(n) {
  combinations = [];
  compareCombination = [];
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      combinations.push(letters[i] + letters[j]);
    }
  }
  combinations = combinations.slice(0, n * n / 2);
  compareCombination = combinations.concat(combinations);
  compareCombination = ShuffleElement(compareCombination);
  createGrid(n);
}

function createGrid(n) {
  first = null;
  second = null;
  canClick = true; // Reset click flag when grid changes
  grid.innerHTML = '';
  grid.className = `grid gap-2 p-4 grid-rows-${n} grid-cols-${n}`;
  const totalCards = n * n;
  for (let i = 0; i < totalCards; i++) {
    const cell = document.createElement('div');
    cell.className = 'bg-gray-800 rounded-md p-4 text-center cursor-pointer';
    cell.textContent = '?';
    cell.dataset.value = compareCombination[i];
    cell.addEventListener('click', handleCardClick);
    grid.appendChild(cell);
  }
}

function handleCardClick(e) {
  if (!canClick) return; // Prevent clicks during animation
  const cell = e.currentTarget;
  
  if (cell.classList.contains('matched') || cell.textContent !== '?') return;

  cell.textContent = cell.dataset.value;

  if (!first) {
    first = cell;
    cell.classList.add('selected');
  } else {
    if (first === cell) return; // Prevent double-click on same card
    second = cell;
    second.classList.add('selected');
    canClick = false; // Disable further clicks during comparison

    if (first.dataset.value === second.dataset.value) {
      // Match found
      first.classList.add('matched');
      second.classList.add('matched');
      first.classList.remove('selected');
      second.classList.remove('selected');
      first = null;
      second = null;
      canClick = true;
    } else {
      // No match - reset after delay
      setTimeout(() => {
        first.textContent = '?';
        second.textContent = '?';
        first.classList.remove('selected');
        second.classList.remove('selected');
        first = null;
        second = null;
        canClick = true;
      }, 600);
    }
  }
}

gridSizeInput.addEventListener('input', () => {
  const n = Number(gridSizeInput.value);
  gridSizeValue.textContent = n;
  GenerateCombinations(n);
});

createGrid(Number(gridSizeInput.value));
