const puzzleBank = {
  10: [
    { numbers: [1, 2, 3, 4], solution: "(4 + 3) + (2 + 1)" },
    { numbers: [2, 3, 5, 7], solution: "(7 - 5) * (2 + 3)" },
    { numbers: [1, 4, 6, 8], solution: "(8 + 6) - (4 * 1)" },
    { numbers: [2, 5, 8, 9], solution: "(9 + 8) - (5 + 2)" },
    { numbers: [3, 4, 6, 9], solution: "(9 + 4) - (6 - 3)" },
    { numbers: [1, 2, 7, 8], solution: "8 / 2 + 7 - 1" },
  ],
  20: [
    { numbers: [2, 4, 5, 9], solution: "(9 + 5 - 4) * 2" },
    { numbers: [1, 6, 7, 8], solution: "8 + 7 + 6 - 1" },
    { numbers: [2, 4, 8, 9], solution: "9 * 2 + 8 / 4" },
    { numbers: [1, 5, 6, 9], solution: "(9 - 5) * (6 - 1)" },
    { numbers: [2, 3, 7, 8], solution: "8 * 2 + 7 - 3" },
    { numbers: [2, 4, 6, 8], solution: "(8 + 6 - 4) * 2" },
  ],
  30: [
    { numbers: [2, 5, 6, 9], solution: "(9 - 6) * (5 * 2)" },
    { numbers: [4, 5, 7, 8], solution: "8 * 4 - 7 + 5" },
    { numbers: [2, 5, 7, 9], solution: "9 * 2 + 7 + 5" },
    { numbers: [2, 4, 8, 9], solution: "9 * 4 - 8 + 2" },
    { numbers: [1, 4, 6, 9], solution: "(9 - 4) * (6 * 1)" },
    { numbers: [1, 4, 7, 9], solution: "(9 + 1) * (7 - 4)" },
  ],
};

const difficultyButtons = document.querySelectorAll(".difficulty-button");
const streakText = document.querySelector("#streakText");
const timeText = document.querySelector("#timeText");
const targetBadge = document.querySelector("#targetBadge");
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
const feedback = document.querySelector("#feedback");
const solutionsPanel = document.querySelector("#solutionsPanel");
const solutionCountText = document.querySelector("#solutionCountText");
const solutionsList = document.querySelector("#solutionsList");

let target = 10;
let puzzleIndex = 0;
let puzzle = null;
let tokens = [];
let usedNumberIds = new Set();
let selectedOperator = null;
let streak = 0;
let solved = false;
let solutionPatterns = [];
let timerStartedAt = null;
let timerElapsed = 0;
let timerId = null;

function makePuzzle(rawPuzzle) {
  return {
    numbers: shuffle(rawPuzzle.numbers).map((value, index) => ({
      id: `${Date.now()}-${index}-${value}`,
      value,
    })),
    solution: rawPuzzle.solution,
  };
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function loadPuzzle(nextTarget = target) {
  target = Number(nextTarget);
  const bank = puzzleBank[target];
  puzzle = makePuzzle(bank[puzzleIndex % bank.length]);
  puzzleIndex += 1;
  tokens = [];
  usedNumberIds = new Set();
  selectedOperator = null;
  solved = false;
  solutionPatterns = generateSolutions(rawNumberValues(puzzle.numbers), target);
  resetTimer();
  targetBadge.textContent = target;
  targetText.textContent = `${target}を作れ`;
  feedback.textContent = "";
  feedback.className = "feedback";
  hideSolutions();
  updateDifficultyTabs();
  renderNumbers();
  renderExpression();
  updateControlStates();
}

function updateDifficultyTabs() {
  difficultyButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.target) === target);
  });
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

  startTimer();
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
    startTimer();
    lastToken.value = operator;
  } else if (lastToken.type === "number" || lastToken.type === "closeParen") {
    startTimer();
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
    startTimer();
    tokens.push({ type: "openParen", value: "(" });
  } else {
    if (!lastToken || lastToken.type === "operator" || lastToken.type === "openParen") return;
    if (closeCount >= openCount) return;
    startTimer();
    tokens.push({ type: "closeParen", value: ")" });
  }

  selectedOperator = null;
  feedback.textContent = "";
  feedback.className = "feedback";
  renderExpression();
  updateControlStates();
}

function renderExpression() {
  if (tokens.length === 0) {
    expressionDisplay.textContent = "数字を選択";
  } else {
    expressionDisplay.textContent = tokens.map(formatToken).join(" ");
  }

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
  return {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  }[token.value];
}

function evaluateTokens(inputTokens) {
  if (!isCompleteExpression(inputTokens)) {
    return NaN;
  }

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

  if (Math.abs(value - target) < 0.000001) {
    solved = true;
    stopTimer();
    streak += 1;
    streakText.textContent = streak;
    showGood(`成功。${expressionDisplay.textContent} = ${target} / ${formatTime(timerElapsed)}`);
    showSolutions("正解しました。ほかの解き方も確認できます。");
    renderNumbers();
    updateControlStates();
    return;
  }

  streak = 0;
  streakText.textContent = streak;
  showBad(`${formatNumber(value)} になっています。別の組み合わせを試しましょう。`);
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
  const hint = solutionPatterns[0] || puzzle.solution;
  const visibleHint = hint.replace(/\d/g, "□");
  feedback.innerHTML = `<span class="hint-text">ヒント: ${visibleHint}</span>`;
  feedback.className = "feedback";
}

function revealAnswer() {
  if (solved) return;
  solved = true;
  stopTimer();
  streak = 0;
  streakText.textContent = streak;
  showBad(`正解例: ${solutionPatterns[0] || puzzle.solution} = ${target}`);
  showSolutions("正解を表示しました。");
  renderNumbers();
  updateControlStates();
}

function showSolutions() {
  solutionsList.innerHTML = "";
  solutionPatterns.forEach((solution) => {
    const item = document.createElement("li");
    item.textContent = `${solution} = ${target}`;
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

function startTimer() {
  if (timerStartedAt !== null || solved) return;
  timerStartedAt = Date.now() - timerElapsed;
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

function resetTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  timerStartedAt = null;
  timerElapsed = 0;
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
  const initialItems = numbers.map((number, index) => ({
    value: number,
    expression: String(number),
    key: `${number}-${index}`,
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
    {
      value: left.value + right.value,
      expression: `(${left.expression} + ${right.expression})`,
    },
    {
      value: left.value * right.value,
      expression: `(${left.expression} × ${right.expression})`,
    },
    {
      value: left.value - right.value,
      expression: `(${left.expression} − ${right.expression})`,
    },
    {
      value: right.value - left.value,
      expression: `(${right.expression} − ${left.expression})`,
    },
  ];

  if (Math.abs(right.value) > 0.000001) {
    combined.push({
      value: left.value / right.value,
      expression: `(${left.expression} ÷ ${right.expression})`,
    });
  }

  if (Math.abs(left.value) > 0.000001) {
    combined.push({
      value: right.value / left.value,
      expression: `(${right.expression} ÷ ${left.expression})`,
    });
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

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    puzzleIndex = 0;
    loadPuzzle(button.dataset.target);
  });
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
newPuzzleButton.addEventListener("click", () => loadPuzzle(target));

loadPuzzle();
