(() => {
  "use strict";

  const {
    challenges,
    START_HUMANITY,
    nextRound,
    isApproved,
    applyAnswer,
    applySkip,
    meterValue,
    preferredLabel
  } = globalThis.NonsenseScoring;

  const ANSWER_HEADLINE = "Awaiting a suspiciously human decision.";
  const ANSWER_COPY = "Accuracy is optional. Commitment is mandatory.";
  const RECORDED_HEADLINE = "Choice recorded. The machine is pretending to think.";
  const RECORDED_COPY = "Press verify when your answer feels unnecessarily final.";

  const grid = document.querySelector("#answer-grid");
  const title = document.querySelector("#challenge-title");
  const note = document.querySelector("#challenge-note");
  const verify = document.querySelector("#verify");
  const result = document.querySelector("#result");
  const roundLabel = document.querySelector("#round-label");
  const scoreLabel = document.querySelector("#score-label");
  const meterNumber = document.querySelector("#meter-value");
  const meterFill = document.querySelector("#meter-fill");
  const skip = document.querySelector("#skip");
  let round = 0;
  let humanity = START_HUMANITY;
  let selected = null;
  let locked = false;

  function setResult(headline, detail, passed = false) {
    result.replaceChildren();
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = headline;
    span.textContent = detail;
    result.append(strong, span);
    result.classList.toggle("pass", passed);
  }

  function updateMeter() {
    const value = meterValue(humanity);
    scoreLabel.textContent = `HUMANITY: ${value}%`;
    meterNumber.textContent = `${value}%`;
    meterFill.style.width = `${value}%`;
  }

  function paintSelection(index) {
    [...grid.children].forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle("selected", active);
      item.setAttribute("aria-checked", String(active));
      item.tabIndex = active ? 0 : -1;
    });
  }

  function choose(index, focusChosen = false) {
    if (locked) return;
    selected = index;
    paintSelection(index);
    if (focusChosen) grid.children[index].focus();
    verify.disabled = false;
    setResult(RECORDED_HEADLINE, RECORDED_COPY);
  }

  function onAnswerKeydown(event) {
    if (locked) return;
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (keys.indexOf(event.key) === -1) return;
    event.preventDefault();
    const current = Number(event.currentTarget.dataset.index);
    const last = grid.children.length - 1;
    let target = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = current === last ? 0 : current + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = current === 0 ? last : current - 1;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = last;
    choose(target, true);
  }

  function createAnswer([emoji, label], index) {
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const text = document.createElement("span");
    button.type = "button";
    button.className = "answer";
    button.dataset.index = String(index);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.tabIndex = -1;
    icon.className = "emoji";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = emoji;
    text.className = "label";
    text.textContent = label;
    button.append(icon, text);
    button.addEventListener("click", () => choose(index));
    button.addEventListener("keydown", onAnswerKeydown);
    return button;
  }

  function renderChallenge() {
    const challenge = challenges[round];
    selected = null;
    locked = false;
    title.textContent = challenge.question;
    note.textContent = challenge.note;
    roundLabel.textContent = `TEST ${String(round + 1).padStart(2, "0")} / ${String(challenges.length).padStart(2, "0")}`;
    verify.disabled = true;
    skip.disabled = false;
    verify.textContent = "VERIFY MY HUMANITY";
    grid.replaceChildren();

    challenge.answers.forEach((answer, index) => {
      grid.append(createAnswer(answer, index));
    });
    if (grid.children.length > 0) grid.children[0].tabIndex = 0;

    setResult(ANSWER_HEADLINE, ANSWER_COPY);
  }

  function advance() {
    round = nextRound(round, challenges.length);
    renderChallenge();
    title.focus();
  }

  verify.addEventListener("click", () => {
    if (selected === null) return;
    if (locked) {
      advance();
      return;
    }
    locked = true;
    const challenge = challenges[round];
    const approved = isApproved(challenge, selected);
    humanity = applyAnswer(humanity, approved);
    updateMeter();
    [...grid.children].forEach((item) => {
      item.disabled = true;
    });
    skip.disabled = true;
    verify.textContent = round === challenges.length - 1 ? "LOOP THE EXPERIMENT" : "NEXT NONSENSE TEST";
    setResult(
      approved ? "VERIFIED: suspiciously human." : "INCONCLUSIVE: possibly a very thoughtful appliance.",
      approved ? challenge.reason : `The model preferred ${preferredLabel(challenge)}. ${challenge.reason}`,
      approved
    );
  });

  skip.addEventListener("click", () => {
    humanity = applySkip(humanity);
    updateMeter();
    advance();
    setResult("Question safely exorcised.", "Skipping is a deeply human response to bad metrics.", true);
  });

  document.querySelector("#reset").addEventListener("click", () => {
    round = 0;
    humanity = START_HUMANITY;
    updateMeter();
    renderChallenge();
    setResult(ANSWER_HEADLINE, ANSWER_COPY);
  });

  title.tabIndex = -1;
  updateMeter();
  renderChallenge();
})();
