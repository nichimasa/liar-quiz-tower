const questions = [
  {
    tag: "最初の一問だけは親切かもしれない",
    question: "次のうち、一番大きい数字はどれ？",
    choices: ["7", "12", "9"],
    answer: 1,
    hint: "ここはまだ普通のクイズです。",
    success: "正解。塔はまだ本性を隠しています。",
    failure: "ここは素直に数字の大きさを見る場面でした。",
  },
  {
    tag: "問題文が急に調子に乗り始めた",
    question: "絶対に左を選ばないでください。",
    choices: ["左", "中央", "右"],
    answer: 0,
    hint: "この塔は、お願いのふりをした誘導が得意です。",
    success: "正解。禁止されているものほど怪しいですね。",
    failure: "今の文章は命令ではなく、罠でした。",
  },
  {
    tag: "見た目の情報も答えになる",
    question: "赤い選択肢を選べ。ただし、この文は嘘です。",
    choices: [
      { label: "赤ではない" },
      { label: "赤い", tone: "red" },
      { label: "青っぽい", tone: "blue" },
    ],
    answer: 0,
    hint: "嘘の文が命令しているなら、命令の逆を見ます。",
    success: "正解。色よりも、文の嘘を優先しました。",
    failure: "「赤い選択肢を選べ」が嘘なので、赤を避けます。",
  },
  {
    tag: "数える対象を疑う",
    question: "この問題文にある「の」の数はいくつ？",
    choices: ["1", "2", "3"],
    answer: 1,
    hint: "「この問題文にある」の部分も問題文です。",
    success: "正解。「この問題文にある」と「の」の2つです。",
    failure: "表示されている文全体から「の」を数えます。",
  },
  {
    tag: "正解という言葉も信用しすぎない",
    question: "正解は「不正解」と書かれたボタンです。",
    choices: ["正解", "不正解", "どちらでもない"],
    answer: 1,
    hint: "ここは文が本当です。言葉の意味ではなく、ラベルを見ます。",
    success: "正解。「不正解」と書かれたボタンが正解でした。",
    failure: "ラベルとしての「不正解」を選ぶ問題でした。",
  },
  {
    tag: "一番短い道がいつも近道とは限らない",
    question: "一番短い選択肢を選んでください。",
    choices: ["長い選択肢", "短", "いちばんみじかい"],
    answer: 1,
    hint: "文字数を比べます。ひねりがないと見せかけたひねりです。",
    success: "正解。今回はシンプルな観察でした。",
    failure: "選択肢の文字数だけを比べる場面でした。",
  },
  {
    tag: "塔はメタな顔をしてくる",
    question: "ここまでの正解数が5なら、右を選べ。",
    choices: ["左", "中央", "右"],
    answer: 2,
    hint: "ここまで全問正解なら、今の時点で正解数は5です。",
    success: "正解。現在地を把握できています。",
    failure: "ここまでの正解数を使う、タワーらしい問題でした。",
  },
  {
    tag: "最後は問題そのものを疑う",
    question: "最後の問題です。正解はありません。",
    choices: ["ありません", "ある", "最後ではない"],
    answer: 1,
    hint: "正解が本当にないなら、ゲームは進めません。",
    success: "正解。正解はちゃんとありました。",
    failure: "「正解はありません」という宣言が嘘でした。",
  },
];

const tower = document.querySelector("#tower");
const floorText = document.querySelector("#floorText");
const scoreText = document.querySelector("#scoreText");
const hintText = document.querySelector("#hintText");
const ruleTag = document.querySelector("#ruleTag");
const questionText = document.querySelector("#questionText");
const choices = document.querySelector("#choices");
const feedback = document.querySelector("#feedback");
const hintButton = document.querySelector("#hintButton");
const nextButton = document.querySelector("#nextButton");
const restartButton = document.querySelector("#restartButton");
const resultDialog = document.querySelector("#resultDialog");
const resultTitle = document.querySelector("#resultTitle");
const resultMessage = document.querySelector("#resultMessage");
const playAgainButton = document.querySelector("#playAgainButton");
const closeResultButton = document.querySelector("#closeResultButton");

let current = 0;
let score = 0;
let hints = 0;
let answered = false;

function buildTower() {
  tower.innerHTML = "";
  questions.forEach((_, index) => {
    const floor = document.createElement("div");
    floor.className = "tower-floor";
    floor.setAttribute("aria-label", `${index + 1}階`);
    tower.append(floor);
  });
}

function updateTower() {
  [...tower.children].forEach((floor, index) => {
    floor.classList.toggle("cleared", index < current);
    floor.classList.toggle("current", index === current);
  });
}

function updateStatus() {
  floorText.textContent = `${Math.min(current + 1, questions.length)} / ${questions.length}`;
  scoreText.textContent = score;
  hintText.textContent = hints;
}

function renderQuestion() {
  answered = false;
  const item = questions[current];
  ruleTag.textContent = item.tag;
  questionText.textContent = item.question;
  feedback.textContent = "";
  feedback.className = "feedback";
  choices.innerHTML = "";

  item.choices.forEach((choice, index) => {
    const choiceLabel = typeof choice === "string" ? choice : choice.label;
    const tone = typeof choice === "string" ? "" : choice.tone;
    const button = document.createElement("button");
    button.className = "choice-button";
    if (tone) {
      button.classList.add(tone);
    }
    button.type = "button";
    button.textContent = choiceLabel;
    button.addEventListener("click", () => selectAnswer(index, button));
    choices.append(button);
  });

  hintButton.disabled = false;
  nextButton.classList.add("hidden");
  nextButton.textContent = "次の問題へ";
  updateTower();
  updateStatus();
}

function selectAnswer(index, selectedButton) {
  if (answered) return;
  answered = true;

  const item = questions[current];
  const buttons = [...choices.querySelectorAll("button")];
  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (index === item.answer) {
    score += 1;
    selectedButton.classList.add("correct");
    feedback.textContent = item.success;
    feedback.classList.add("good");
  } else {
    selectedButton.classList.add("incorrect");
    buttons[item.answer].classList.add("correct");
    feedback.textContent = item.failure;
    feedback.classList.add("bad");
  }

  current += 1;
  updateTower();
  updateStatus();
  nextButton.textContent = current >= questions.length ? "結果を見る" : "次の問題へ";
  nextButton.classList.remove("hidden");
}

function showHint() {
  if (answered) return;
  hints += 1;
  feedback.textContent = questions[current].hint;
  feedback.className = "feedback";
  hintButton.disabled = true;
  updateStatus();
}

function showResult() {
  const perfect = score === questions.length;
  resultTitle.textContent = perfect ? "完全登頂" : "登頂成功";
  resultMessage.textContent = `結果は ${score} / ${questions.length} 正解、ヒント使用 ${hints} 回。${
    perfect
      ? "あなたは疑うべき場所をよく知っています。"
      : "次は問題文の声色まで疑ってみましょう。"
  }`;
  resultDialog.showModal();
}

function goNext() {
  if (!answered) return;
  if (current >= questions.length) {
    showResult();
    return;
  }
  renderQuestion();
}

function restartGame() {
  current = 0;
  score = 0;
  hints = 0;
  answered = false;
  if (resultDialog.open) {
    resultDialog.close();
  }
  renderQuestion();
}

function closeResult() {
  if (resultDialog.open) {
    resultDialog.close();
  }
}

hintButton.addEventListener("click", showHint);
nextButton.addEventListener("click", goNext);
restartButton.addEventListener("click", restartGame);
playAgainButton.addEventListener("click", restartGame);
closeResultButton.addEventListener("click", closeResult);

buildTower();
renderQuestion();
