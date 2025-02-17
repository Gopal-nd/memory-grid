
const gridSizeInput = document.getElementById('gridSize');
const gridSizeValue = document.getElementById('gridSizeValue');
const grid = document.getElementById('grid');
let history = document.querySelector('#history')
let clear = document.getElementById('clear')
let combinations = [];
let compareCombination = [];
let first = null;
let second = null;
let canClick = true; // New flag to control click handling
let clciks =0;
let start;
loadGameHistory();
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
  start = Date.now()

  createGrid(n);
}

function createGrid(n) {
  clciks=0
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
      clciks++;
      checkallcorect()
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
        clciks++
      }, 600);
    }
  }
}

function checkallcorect(){
  let arr = grid.querySelectorAll('div')
  let  matched = 0;
  arr.forEach((a)=>{
    if(a.classList.contains('matched')){
      matched++;
    }
  })
  if(arr.length === matched){
    setTimeout(() => {
      
      alert('congragulations')
    }, 500);
    saveGameHistory()

  }
}

gridSizeInput.addEventListener('input', () => {
  const n = Number(gridSizeInput.value);
  gridSizeValue.textContent = n;
  GenerateCombinations(n);
});

createGrid(Number(gridSizeInput.value));


function convertMillisToMMSS(ms) {
  // Convert ms to seconds, rounding down to the nearest whole number
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // Format minutes and seconds as two-digit strings
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


function saveGameHistory() {

  let historyData = localStorage.getItem('memoryGrid')
  let historyArry = historyData? JSON.parse(historyData) :[]
  let time = new Date();
  let no = gridSizeValue.innerText;
  let takenTime = Date.now() - start;
  let obj = {
    time: time.toLocaleString(),
    no: no,
    takenTime: takenTime,
    clciks: clciks * 2,
    accurecy: ((no / clciks) * 100).toFixed(2)
  };
  historyArry.push(obj);
  let stringifyData = JSON.stringify(historyArry);
  localStorage.setItem("memoryGrid", stringifyData);
  history.innerHTML += `
    <tr>
      <td class="border px-4 py-2">${obj.time}</td>
      <td class="border px-4 py-2">${obj.no}</td>
      <td class="border px-4 py-2">${convertMillisToMMSS(obj.takenTime)}</td>
      <td class="border px-4 py-2">${obj.clciks}</td>
      <td class="border px-4 py-2">${obj.accurecy}</td>
    </tr>`;
}

function loadGameHistory() {

  let historyData = localStorage.getItem('memoryGrid')
  let historyArry = historyData? JSON.parse(historyData) :[]
  let final= historyArry.map(obj => 
    `
    <tr>
    <td class="border px-4 py-2">${obj.time}</td>
    <td class="border px-4 py-2">${obj.no}</td>
    <td class="border px-4 py-2">${convertMillisToMMSS(obj.takenTime)}</td>
    <td class="border px-4 py-2">${obj.clciks}</td>
    <td class="border px-4 py-2">${obj.accurecy}</td>
    </tr>`
  ).join('');
  
  history.innerHTML = final;
}


clear.addEventListener('click',(e)=>{
  e.preventDefault()
  let historyData = localStorage.getItem('memoryGrid')
  let historyArry = historyData? JSON.parse(historyData) :[]
  if(!historyArry.length){
      return
  }
  let conformation = confirm('Are you sure to remove the History')
  if(conformation){
      localStorage.clear('history')
      history.innerHTML=null
  }

})


