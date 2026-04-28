const TARGET = 10;
const STORAGE_KEY = "numberCraftProgressV2";

const levels = {
  easy: { label: "初級", range: "1〜9", total: 30 },
  medium: { label: "中級", range: "1〜15", total: 50 },
  hard: { label: "上級", range: "1〜20", total: 80 },
};

const puzzleBank = {
  easy: [
    [1, 1, 1, 4], [1, 1, 3, 4], [1, 1, 5, 8], [1, 2, 3, 4], [1, 2, 5, 8],
    [1, 3, 3, 6], [1, 3, 6, 6], [1, 4, 5, 6], [1, 5, 5, 7], [1, 6, 7, 8],
    [2, 2, 2, 4], [2, 2, 4, 5], [2, 2, 7, 9], [2, 3, 4, 8], [2, 3, 8, 9],
    [2, 4, 6, 8], [2, 5, 6, 8], [2, 6, 8, 8], [3, 3, 3, 5], [3, 3, 5, 9],
    [3, 4, 4, 9], [3, 4, 8, 9], [3, 5, 8, 9], [3, 7, 9, 9], [4, 4, 6, 8],
    [4, 5, 7, 7], [4, 6, 9, 9], [5, 5, 6, 7], [5, 6, 8, 8], [6, 6, 8, 9],
  ],
  medium: [
    [1, 1, 1, 10], [1, 1, 9, 10], [1, 2, 6, 15], [1, 3, 4, 10], [1, 3, 13, 13],
    [1, 4, 12, 14], [1, 5, 10, 15], [1, 6, 11, 13], [1, 8, 8, 11], [1, 9, 13, 15],
    [1, 13, 13, 15], [2, 2, 8, 15], [2, 3, 5, 14], [2, 3, 14, 15], [2, 4, 10, 13],
    [2, 5, 8, 15], [2, 6, 8, 11], [2, 7, 8, 14], [2, 8, 10, 12], [2, 9, 14, 15],
    [2, 12, 14, 14], [3, 3, 9, 10], [3, 4, 6, 14], [3, 5, 6, 10], [3, 5, 14, 15],
    [3, 6, 14, 14], [3, 8, 9, 15], [3, 9, 15, 15], [3, 14, 14, 15], [4, 4, 11, 13],
    [4, 5, 11, 12], [4, 6, 11, 15], [4, 7, 14, 14], [4, 9, 11, 13], [4, 13, 13, 13],
    [5, 5, 11, 14], [5, 6, 12, 12], [5, 7, 13, 15], [5, 9, 13, 15], [5, 13, 14, 15],
    [6, 6, 15, 15], [6, 8, 10, 10], [6, 10, 12, 12], [7, 7, 9, 13], [7, 8, 13, 14],
    [7, 11, 12, 15], [8, 9, 11, 12], [8, 13, 13, 13], [9, 12, 12, 12], [10, 11, 14, 15],
  ],
  hard: [
    [1, 1, 1, 18], [1, 1, 14, 19], [1, 2, 10, 20], [1, 3, 5, 19], [1, 3, 18, 19],
    [1, 4, 15, 19], [1, 5, 15, 17], [1, 6, 14, 19], [1, 8, 9, 16], [1, 9, 12, 19],
    [1, 11, 14, 20], [1, 13, 14, 18], [2, 2, 2, 20], [2, 2, 13, 20], [2, 3, 8, 19],
    [2, 4, 5, 16], [2, 4, 15, 17], [2, 5, 11, 19], [2, 6, 9, 20], [2, 7, 9, 18],
    [2, 8, 10, 18], [2, 9, 11, 17], [2, 10, 14, 18], [2, 11, 17, 19], [2, 13, 15, 20],
    [2, 16, 17, 18], [3, 3, 9, 18], [3, 4, 7, 17], [3, 5, 6, 16], [3, 5, 17, 17],
    [3, 6, 15, 16], [3, 7, 16, 16], [3, 8, 19, 19], [3, 10, 14, 16], [3, 12, 13, 20],
    [3, 14, 16, 17], [4, 4, 6, 18], [4, 5, 6, 20], [4, 5, 19, 20], [4, 6, 17, 18],
    [4, 7, 18, 20], [4, 9, 11, 20], [4, 10, 18, 20], [4, 12, 18, 20], [4, 15, 19, 20],
    [5, 5, 13, 20], [5, 6, 12, 18], [5, 7, 12, 20], [5, 8, 14, 18], [5, 9, 19, 20],
    [5, 11, 14, 19], [5, 13, 18, 20], [5, 17, 17, 17], [6, 7, 7, 18], [6, 8, 11, 20],
    [6, 9, 14, 19], [6, 11, 15, 17], [6, 13, 17, 20], [6, 17, 19, 20], [7, 8, 13, 17],
    [7, 10, 10, 16], [7, 11, 16, 20], [7, 14, 15, 17], [8, 8, 8, 18], [8, 9, 12, 18],
    [8, 10, 18, 18], [8, 12, 17, 18], [8, 15, 17, 20], [9, 9, 12, 20], [9, 11, 19, 20],
    [9, 14, 15, 20], [10, 10, 10, 18], [10, 12, 12, 20], [10, 14, 16, 16], [10, 18, 18, 18],
    [11, 13, 17, 17], [12, 12, 12, 18], [12, 14, 17, 19], [13, 14, 15, 18], [14, 16, 16, 19],
  ],
};

const homeScreen = document.querySelector("#homeScreen");
const gameScreen = document.querySelector("#gameScreen");
const levelStartButtons = document.querySelectorAll(".level-start-button");
const levelLabel = document.querySelector("#levelLabel");
const clearedText = document.querySelector("#clearedText");
const timeText = document.querySelector("#timeText");
const puzzleText = document.querySelector("#puzzleText");
const targetText = document.querySelector("#targetText");
const expressionDisplay = document.querySelector("#expressionDisplay");
const currentValueText = document.querySelector("#currentValueText");
const usedCountText = document.querySelector("#usedCountText");
const numberGrid = document.querySelector("#numberGrid");
const operatorButtons = document.querySelectorAll(".operator-button");
const parenButtons = document.querySelectorAll(".paren-button");
const undoButton = document.querySelector("#undoButton");
const clearButton = document.querySelector("#clearButton");
const checkButton = document.querySelector("#checkButton");
const hintButton = document.querySelector("#hintButton");
const answerButton = document.querySelector("#answerButton");
const newPuzzleButton = document.querySelector("#newPuzzleButton");
const homeButton = document.querySelector("#homeButton");
const feedback = document.querySelector("#feedback");
const solutionsPanel = document.querySelector("#solutionsPanel");
const solutionCountText = document.querySelector("#solutionCountText");
const solutionsList = document.querySelector("#solutionsList");
const progressTexts = {
  easy: document.querySelector("#easyProgressText"),
  medium: document.querySelector("#mediumProgressText"),
  hard: document.querySelector("#hardProgressText"),
};
const totalProgressText = document.querySelector("#totalProgressText");
const bestTimeText = document.querySelector("#bestTimeText");

let progress = loadProgress();
let currentLevel = "easy";
let puzzleIndex = 0;
let puzzle = null;
let tokens = [];
let usedNumberIds = new Set();
let selectedOperator = null;
let solved = false;
let solutionPatterns = [];
let timerStartedAt = null;
let timerElapsed = 0;
let timerId = null;

function loadProgress() {
  const fallback = {
    easy: { cleared: [], bestTime: null },
    medium: { cleared: [], bestTime: null },
    hard: { cleared: [], bestTime: null },
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function showHome() {
  stopTimer();
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderHomeProgress();
}

function showGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function renderHomeProgress() {
  let clearedTotal = 0;
  let bestTime = null;

  Object.keys(levels).forEach((level) => {
    const cleared = progress[level].cleared.length;
    clearedTotal += cleared;
    progressTexts[level].textContent = `${cleared} / ${levels[level].total}`;
    if (progress[level].bestTime !== null) {
      bestTime = bestTime === null ? progress[level].bestTime : Math.min(bestTime, progress[level].bestTime);
    }
  });

  totalProgressText.textContent = `${clearedTotal} / 160`;
  bestTimeText.textContent = bestTime === null ? "-" : formatTime(bestTime);
}

function startLevel(level) {
  currentLevel = level;
  puzzleIndex = findNextPuzzleIndex(level);
  showGame();
  loadPuzzle(puzzleIndex);
}

function findNextPuzzleIndex(level) {
  const clearedSet = new Set(progress[level].cleared);
  const nextIndex = puzzleBank[level].findIndex((_, index) => !clearedSet.has(puzzleId(level, index)));
  return nextIndex === -1 ? 0 : nextIndex;
}

function loadPuzzle(index = puzzleIndex) {
  const rawNumbers = puzzleBank[currentLevel][index % puzzleBank[currentLevel].length];
  puzzleIndex = index % puzzleBank[currentLevel].length;
  puzzle = makePuzzle(rawNumbers, puzzleIndex);
  tokens = [];
  usedNumberIds = new Set();
  selectedOperator = null;
  solved = false;
  solutionPatterns = generateSolutions(rawNumberValues(puzzle.numbers), TARGET);

  levelLabel.textContent = `${levels[currentLevel].label} ${levels[currentLevel].range}`;
  puzzleText.textContent = `${puzzleIndex + 1} / ${levels[currentLevel].total}`;
  targetText.textContent = `${TARGET}を作れ`;
  feedback.textContent = "";
  feedback.className = "feedback";
  hideSolutions();
  renderLevelProgress();
  renderNumbers();
  renderExpression();
  updateControlStates();
  startTimerForPuzzle();
}

function makePuzzle(numbers, index) {
  return {
    id: puzzleId(currentLevel, index),
    numbers: shuffle(numbers).map((value, numberIndex) => ({
      id: `${Date.now()}-${numberIndex}-${value}`,
      value,
    })),
  };
}

function puzzleId(level, index) {
  return `${level}-${index}`;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderLevelProgress() {
  clearedText.textContent = `${progress[currentLevel].cleared.length}/${levels[currentLevel].total}`;
}

function renderNumbers() {
  numberGrid.innerHTML = "";
  puzzle.numbers.forEach((number) => {
    const button = document.createElement("button");
    button.className = "number-button";
    button.type = "button";
    button.textContent = number.value;
    button.disabled = usedNumberIds.has(number.id) || solved;
    button.classList.toggle("used", usedNumberIds.has(number.id));
    button.addEventListener("click", () => chooseNumber(number));
    numberGrid.append(button);
  });
}

function chooseNumber(number) {
  if (solved || usedNumberIds.has(number.id)) return;
  const lastToken = tokens[tokens.length - 1];
  if (lastToken?.type === "number" || lastToken?.type === "closeParen") return;

  tokens.push({ type: "number", value: number.value, id: number.id });
  usedNumberIds.add(number.id);
  selectedOperator = null;
  feedback.textContent = "";
  feedback.className = "feedback";
  renderNumbers();
  renderExpression();
  updateControlStates();
}

function chooseOperator(operator) {
  if (solved || tokens.length === 0) return;
  const lastToken = tokens[tokens.length - 1];

  if (lastToken.type === "operator") {
    lastToken.value = operator;
  } else if (lastToken.type === "number" || lastToken.type === "closeParen") {
    tokens.push({ type: "operator", value: operator });
  } else {
    return;
  }

  selectedOperator = operator;
  feedback.textContent = "";
  feedback.className = "feedback";
  renderExpression();
  updateControlStates();
}

function chooseParen(paren) {
  if (solved) return;
  const lastToken = tokens[tokens.length - 1];
  const openCount = countParens("open");
  const closeCount = countParens("close");

  if (paren === "open") {
    if (lastToken?.type === "number" || lastToken?.type === "closeParen") return;
    tokens.push({ type: "openParen", value: "(" });
  } else {
    if (!lastToken || lastToken.type === "operator" || lastToken.type === "openParen") return;
    if (closeCount >= openCount) return;
    tokens.push({ type: "closeParen", value: ")" });
  }

  selectedOperator = null;
  feedback.textContent = "";
  feedback.className = "feedback";
  renderExpression();
  updateControlStates();
}

function renderExpression() {
  expressionDisplay.textContent = tokens.length === 0 ? "数字を選択" : tokens.map(formatToken).join(" ");
  const value = evaluateTokens(tokens);
  currentValueText.textContent = Number.isFinite(value) ? `現在値: ${formatNumber(value)}` : "現在値: -";
  usedCountText.textContent = `${usedNumberIds.size} / ${puzzle.numbers.length}`;
}

function updateControlStates() {
  const lastToken = tokens[tokens.length - 1];
  const canUseOperator = Boolean(lastToken) && (lastToken.type === "number" || lastToken.type === "closeParen") && !solved;
  operatorButtons.forEach((button) => {
    const operator = button.dataset.operator;
    button.disabled = !canUseOperator;
    button.classList.toggle("active", selectedOperator === operator);
  });

  const openCount = countParens("open");
  const closeCount = countParens("close");
  parenButtons.forEach((button) => {
    const paren = button.dataset.paren;
    const canOpen = !lastToken || lastToken.type === "operator" || lastToken.type === "openParen";
    const canClose = Boolean(lastToken) && lastToken.type !== "operator" && lastToken.type !== "openParen" && closeCount < openCount;
    button.disabled = solved || (paren === "open" ? !canOpen : !canClose);
  });

  hintButton.disabled = solved;
  answerButton.disabled = solved;
}

function formatToken(token) {
  if (token.type === "number") return token.value;
  if (token.type === "openParen") return "(";
  if (token.type === "closeParen") return ")";
  return { "+": "+", "-": "−", "*": "×", "/": "÷" }[token.value];
}

function evaluateTokens(inputTokens) {
  if (!isCompleteExpression(inputTokens)) return NaN;
  const expression = inputTokens.map((token) => token.value).join("");
  try {
    const value = Function(`"use strict"; return (${expression});`)();
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

function formatNumber(value) {
  if (Number.isInteger(value)) return value;
  return Math.round(value * 100) / 100;
}

function checkAnswer() {
  if (tokens.length === 0) {
    showBad("まず数字をタップして式を作ります。");
    return;
  }

  if (usedNumberIds.size < puzzle.numbers.length) {
    showBad("4つの数字をすべて使ってください。");
    return;
  }

  if (!isCompleteExpression(tokens)) {
    showBad("式の並びや括弧を確認してください。");
    return;
  }

  const value = evaluateTokens(tokens);
  if (!Number.isFinite(value)) {
    showBad("計算できない式になっています。括弧や割り算を確認してください。");
    return;
  }

  if (Math.abs(value - TARGET) < 0.000001) {
    solved = true;
    stopTimer();
    markPuzzleCleared();
    showGood(`成功。${expressionDisplay.textContent} = ${TARGET} / ${formatTime(timerElapsed)}`);
    showSolutions();
    renderNumbers();
    renderLevelProgress();
    updateControlStates();
    return;
  }

  showBad(`${formatNumber(value)} になっています。別の組み合わせを試しましょう。`);
}

function markPuzzleCleared() {
  const cleared = progress[currentLevel].cleared;
  if (!cleared.includes(puzzle.id)) {
    cleared.push(puzzle.id);
  }
  progress[currentLevel].bestTime =
    progress[currentLevel].bestTime === null ? timerElapsed : Math.min(progress[currentLevel].bestTime, timerElapsed);
  saveProgress();
}

function showGood(message) {
  feedback.textContent = message;
  feedback.className = "feedback good";
}

function showBad(message) {
  feedback.textContent = message;
  feedback.className = "feedback bad";
}

function undo() {
  if (solved || tokens.length === 0) return;
  const token = tokens.pop();
  if (token.type === "number") {
    usedNumberIds.delete(token.id);
  }
  selectedOperator = tokens[tokens.length - 1]?.type === "operator" ? tokens[tokens.length - 1].value : null;
  feedback.textContent = "";
  feedback.className = "feedback";
  renderNumbers();
  renderExpression();
  updateControlStates();
}

function clearExpression() {
  if (solved) return;
  tokens = [];
  usedNumberIds = new Set();
  selectedOperator = null;
  feedback.textContent = "";
  feedback.className = "feedback";
  renderNumbers();
  renderExpression();
  updateControlStates();
}

function showHint() {
  if (solved) return;
  const hint = solutionPatterns[0];
  const visibleHint = hint.replace(/\d+/g, "□");
  feedback.innerHTML = `<span class="hint-text">ヒント: ${visibleHint}</span>`;
  feedback.className = "feedback";
}

function revealAnswer() {
  if (solved) return;
  solved = true;
  stopTimer();
  showBad(`正解例: ${solutionPatterns[0]} = ${TARGET}`);
  showSolutions();
  renderNumbers();
  updateControlStates();
}

function showSolutions() {
  solutionsList.innerHTML = "";
  solutionPatterns.forEach((solution) => {
    const item = document.createElement("li");
    item.textContent = `${solution} = ${TARGET}`;
    solutionsList.append(item);
  });

  solutionCountText.textContent = `${solutionPatterns.length}通り`;
  solutionsPanel.classList.remove("hidden");
}

function hideSolutions() {
  solutionsPanel.classList.add("hidden");
  solutionsList.innerHTML = "";
  solutionCountText.textContent = "0通り";
}

function startTimerForPuzzle() {
  stopTimer();
  timerElapsed = 0;
  timerStartedAt = Date.now();
  timerId = window.setInterval(updateTimerText, 100);
  updateTimerText();
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  if (timerStartedAt !== null) {
    timerElapsed = Date.now() - timerStartedAt;
    timerStartedAt = null;
  }
  updateTimerText();
}

function updateTimerText() {
  if (timerStartedAt !== null) {
    timerElapsed = Date.now() - timerStartedAt;
  }
  timeText.textContent = formatTime(timerElapsed);
}

function formatTime(milliseconds) {
  return `${(milliseconds / 1000).toFixed(1)}秒`;
}

function goNextPuzzle() {
  const nextIndex = (puzzleIndex + 1) % puzzleBank[currentLevel].length;
  loadPuzzle(nextIndex);
}

function countParens(kind) {
  const tokenType = kind === "open" ? "openParen" : "closeParen";
  return tokens.filter((token) => token.type === tokenType).length;
}

function isCompleteExpression(inputTokens) {
  if (inputTokens.length === 0) return false;
  const lastToken = inputTokens[inputTokens.length - 1];
  if (lastToken.type !== "number" && lastToken.type !== "closeParen") return false;
  return (
    inputTokens.filter((token) => token.type === "openParen").length ===
    inputTokens.filter((token) => token.type === "closeParen").length
  );
}

function rawNumberValues(numbers) {
  return numbers.map((number) => number.value);
}

function generateSolutions(numbers, solutionTarget) {
  const results = new Set();
  const initialItems = numbers.map((number) => ({
    value: number,
    expression: String(number),
  }));

  searchSolutions(initialItems, results, solutionTarget);

  return [...results].sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  });
}

function searchSolutions(items, results, solutionTarget) {
  if (items.length === 1) {
    if (Math.abs(items[0].value - solutionTarget) < 0.000001) {
      results.add(trimOuterParens(items[0].expression));
    }
    return;
  }

  for (let first = 0; first < items.length - 1; first += 1) {
    for (let second = first + 1; second < items.length; second += 1) {
      const left = items[first];
      const right = items[second];
      const rest = items.filter((_, index) => index !== first && index !== second);

      combineItems(left, right).forEach((combined) => {
        searchSolutions([...rest, combined], results, solutionTarget);
      });
    }
  }
}

function combineItems(left, right) {
  const combined = [
    { value: left.value + right.value, expression: `(${left.expression} + ${right.expression})` },
    { value: left.value * right.value, expression: `(${left.expression} × ${right.expression})` },
    { value: left.value - right.value, expression: `(${left.expression} − ${right.expression})` },
    { value: right.value - left.value, expression: `(${right.expression} − ${left.expression})` },
  ];

  if (Math.abs(right.value) > 0.000001) {
    combined.push({ value: left.value / right.value, expression: `(${left.expression} ÷ ${right.expression})` });
  }

  if (Math.abs(left.value) > 0.000001) {
    combined.push({ value: right.value / left.value, expression: `(${right.expression} ÷ ${left.expression})` });
  }

  return combined;
}

function trimOuterParens(expression) {
  if (!expression.startsWith("(") || !expression.endsWith(")")) return expression;

  let depth = 0;
  for (let index = 0; index < expression.length; index += 1) {
    const character = expression[index];
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (depth === 0 && index < expression.length - 1) return expression;
  }

  return expression.slice(1, -1);
}

levelStartButtons.forEach((button) => {
  button.addEventListener("click", () => startLevel(button.dataset.level));
});
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => chooseOperator(button.dataset.operator));
});
parenButtons.forEach((button) => {
  button.addEventListener("click", () => chooseParen(button.dataset.paren));
});

undoButton.addEventListener("click", undo);
clearButton.addEventListener("click", clearExpression);
checkButton.addEventListener("click", checkAnswer);
hintButton.addEventListener("click", showHint);
answerButton.addEventListener("click", revealAnswer);
newPuzzleButton.addEventListener("click", goNextPuzzle);
homeButton.addEventListener("click", showHome);

renderHomeProgress();
