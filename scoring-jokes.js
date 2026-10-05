/*
 * Pure challenge data and scoring rules for CAPTCHA of Nonsense.
 * Loaded as a classic script by index.html and read from globalThis by the
 * node test in tests/scoring.test.mjs. No dependencies, no DOM, no network.
 */
(function (root) {
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

  const START_HUMANITY = 50;
  const PASS_DELTA = 11;
  const FAIL_DELTA = -4;
  const SKIP_DELTA = -2;
  const METER_MIN = 4;
  const METER_MAX = 99;

  function nextRound(round, total) {
    return (round + 1) % total;
  }

  function isApproved(challenge, index) {
    return index === challenge.preferred;
  }

  function applyAnswer(humanity, approved) {
    return humanity + (approved ? PASS_DELTA : FAIL_DELTA);
  }

  function applySkip(humanity) {
    return humanity + SKIP_DELTA;
  }

  function meterValue(humanity) {
    return Math.max(METER_MIN, Math.min(METER_MAX, humanity));
  }

  function preferredLabel(challenge) {
    const pick = challenge && challenge.answers && challenge.answers[challenge.preferred];
    return pick ? pick[1] : "something unknowable";
  }

  function visibleAnswers(challenge) {
    return challenge ? challenge.answers.map(([, label]) => label) : [];
  }

  const api = {
    challenges,
    START_HUMANITY,
    PASS_DELTA,
    FAIL_DELTA,
    SKIP_DELTA,
    METER_MIN,
    METER_MAX,
    nextRound,
    isApproved,
    applyAnswer,
    applySkip,
    meterValue,
    preferredLabel,
    visibleAnswers
  };

  root.NonsenseScoring = api;

  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
