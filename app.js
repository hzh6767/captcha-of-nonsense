(() => {
  "use strict";

  const challenges = [
    {
      question: "Which object looks most likely to remember your password?",
      note: "Our imaginary neural network will judge your vibes, not your logic.",
      answers: [["🧦", "left sock"], ["🪴", "office fern"], ["🥄", "small spoon"], ["🦆", "local duck"], ["🧊", "ice cube"], ["📎", "paperclip"]],
      preferred: 1,
      reason: "The fern has witnessed every password reset since 2019."
    },
    {
      question: "Choose the item that would make the best project manager.",
      note: "Leadership experience is measured in unexplained confidence.",
      answers: [["🍞", "toast"], ["🦀", "crab"], ["🛒", "cart"], ["🪩", "disco ball"], ["🧱", "brick"], ["🐌", "snail"]],
      preferred: 3,
      reason: "The disco ball distributes attention evenly and schedules excellent retrospectives."
    },
    {
      question: "Which one is secretly running the internet?",
      note: "Please ignore anything you learned in computer science.",
      answers: [["🐈", "cat"], ["🥔", "potato"], ["🧙", "wizard"], ["📠", "fax"], ["🪼", "jellyfish"], ["🗿", "statue"]],
      preferred: 1,
      reason: "The potato has redundant eyes and excellent uptime."
    },
    {
      question: "Identify the most emotionally available rectangle.",
      note: "Shape recognition is easy. Emotional geometry is not.",
      answers: [["🚪", "door"], ["📕", "book"], ["🧈", "butter"], ["📱", "phone"], ["🧱", "brick"], ["🎟️", "ticket"]],
      preferred: 2,
      reason: "Butter is soft, present, and willing to change."
    },
    {
      question: "Pick the creature most qualified to review your browser history.",
      note: "There is no correct answer, but there is an extremely judgmental one.",
      answers: [["🦉", "owl"], ["🐙", "octopus"], ["🐝", "bee"], ["🦝", "raccoon"], ["🐡", "pufferfish"], ["🦭", "seal"]],
      preferred: 3,
      reason: "The raccoon understands questionable late-night decisions."
    }
  ];

  const grid = document.querySelector("#answer-grid");
  const title = document.querySelector("#challenge-title");
  const note = document.querySelector("#challenge-note");
  const verify = document.querySelector("#verify");
  const result = document.querySelector("#result");
  const roundLabel = document.querySelector("#round-label");
  const scoreLabel = document.querySelector("#score-label");
  const meterValue = document.querySelector("#meter-value");
  const meterFill = document.querySelector("#meter-fill");
  let round = 0;
  let humanity = 50;
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
    const value = Math.max(4, Math.min(99, humanity));
    scoreLabel.textContent = `HUMANITY: ${value}%`;
    meterValue.textContent = `${value}%`;
    meterFill.style.width = `${value}%`;
  }

  function renderChallenge() {
    const challenge = challenges[round];
    selected = null;
    locked = false;
    title.textContent = challenge.question;
    note.textContent = challenge.note;
    roundLabel.textContent = `TEST ${String(round + 1).padStart(2, "0")} / ${String(challenges.length).padStart(2, "0")}`;
    verify.disabled = true;
    verify.textContent = "VERIFY MY HUMANITY";
    grid.replaceChildren();

    challenge.answers.forEach(([emoji, label], index) => {
      const button = document.createElement("button");
      const icon = document.createElement("span");
      const text = document.createElement("span");
      button.type = "button";
      button.className = "answer";
      button.setAttribute("aria-pressed", "false");
      icon.className = "emoji";
      icon.textContent = emoji;
      text.className = "label";
      text.textContent = label;
      button.append(icon, text);
      button.addEventListener("click", () => {
        if (locked) return;
        selected = index;
        [...grid.children].forEach((item, itemIndex) => {
          const active = itemIndex === index;
          item.classList.toggle("selected", active);
          item.setAttribute("aria-pressed", String(active));
        });
        verify.disabled = false;
        setResult("Choice recorded. The machine is pretending to think.", "Press verify when your answer feels unnecessarily final.");
      });
      grid.append(button);
    });
  }

  function advance() {
    round = (round + 1) % challenges.length;
    renderChallenge();
  }

  verify.addEventListener("click", () => {
    if (selected === null) return;
    if (locked) {
      advance();
      return;
    }
    locked = true;
    const challenge = challenges[round];
    const approved = selected === challenge.preferred;
    humanity += approved ? 11 : -4;
    updateMeter();
    verify.textContent = round === challenges.length - 1 ? "LOOP THE EXPERIMENT" : "NEXT NONSENSE TEST";
    setResult(
      approved ? "VERIFIED: suspiciously human." : "INCONCLUSIVE: possibly a very thoughtful appliance.",
      approved ? challenge.reason : `The model preferred ${challenge.answers[challenge.preferred][1]}. ${challenge.reason}`,
      approved
    );
  });

  document.querySelector("#skip").addEventListener("click", () => {
    humanity -= 2;
    updateMeter();
    advance();
    setResult("Question safely exorcised.", "Skipping is a deeply human response to bad metrics.", true);
  });

  document.querySelector("#reset").addEventListener("click", () => {
    round = 0;
    humanity = 50;
    updateMeter();
    renderChallenge();
    setResult("Awaiting a suspiciously human decision.", "Accuracy is optional. Commitment is mandatory.");
  });

  updateMeter();
  renderChallenge();
})();
