import test from "node:test";
import assert from "node:assert/strict";

import "../scoring-jokes.js";

const {
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
} = globalThis.NonsenseScoring;

test("challenge set is well formed", () => {
  assert.equal(challenges.length, 5);
  for (const challenge of challenges) {
    assert.equal(typeof challenge.question, "string");
    assert.ok(challenge.question.length > 0);
    assert.equal(typeof challenge.note, "string");
    assert.equal(typeof challenge.reason, "string");
    assert.ok(challenge.reason.length > 0);
    assert.equal(challenge.answers.length, 6);
    for (const answer of challenge.answers) {
      assert.equal(answer.length, 2);
      assert.equal(typeof answer[0], "string");
      assert.equal(typeof answer[1], "string");
      assert.ok(answer[1].length > 0);
    }
  }
});

test("every preferred index actually points at an answer", () => {
  for (const challenge of challenges) {
    assert.ok(Number.isInteger(challenge.preferred));
    assert.ok(challenge.preferred >= 0);
    assert.ok(challenge.preferred < challenge.answers.length);
  }
});

test("nextRound wraps around the challenge list", () => {
  assert.equal(nextRound(0, 5), 1);
  assert.equal(nextRound(3, 5), 4);
  assert.equal(nextRound(4, 5), 0);
});

test("isApproved matches the preferred index only", () => {
  for (const challenge of challenges) {
    for (let index = 0; index < challenge.answers.length; index += 1) {
      assert.equal(isApproved(challenge, index), index === challenge.preferred);
    }
  }
});

test("applyAnswer adds 11 on a hit and subtracts 4 on a miss", () => {
  assert.equal(PASS_DELTA, 11);
  assert.equal(FAIL_DELTA, -4);
  assert.equal(applyAnswer(50, true), 61);
  assert.equal(applyAnswer(50, false), 46);
  assert.equal(applyAnswer(applyAnswer(50, true), true), 72);
  assert.equal(applyAnswer(START_HUMANITY, false), 46);
});

test("applySkip subtracts 2", () => {
  assert.equal(SKIP_DELTA, -2);
  assert.equal(applySkip(50), 48);
});

test("meterValue clamps the display to the 4-99 window", () => {
  assert.equal(METER_MIN, 4);
  assert.equal(METER_MAX, 99);
  assert.equal(meterValue(50), 50);
  assert.equal(meterValue(3), 4);
  assert.equal(meterValue(-120), 4);
  assert.equal(meterValue(140), 99);
  assert.equal(meterValue(99), 99);
  assert.equal(meterValue(100), 99);
});

test("looping the experiment keeps the display pinned without throwing", () => {
  let score = START_HUMANITY;
  for (let index = 0; index < 20; index += 1) score = applyAnswer(score, true);
  assert.equal(score, 270);
  assert.equal(meterValue(score), 99);
  for (let index = 0; index < 60; index += 1) score = applySkip(score);
  assert.equal(score, 150);
  assert.equal(meterValue(score), 99);
  assert.equal(meterValue(-200), 4);
});

test("preferredLabel names the expected answer and never throws on bad data", () => {
  assert.equal(preferredLabel(challenges[0]), "office fern");
  assert.equal(preferredLabel(challenges[1]), "disco ball");
  assert.equal(preferredLabel({ answers: [], preferred: 4 }), "something unknowable");
  assert.equal(preferredLabel({ preferred: 0 }), "something unknowable");
  assert.equal(preferredLabel(undefined), "something unknowable");
});

test("visibleAnswers lists the labels in order", () => {
  assert.deepEqual(visibleAnswers(challenges[0]), [
    "left sock",
    "office fern",
    "small spoon",
    "local duck",
    "ice cube",
    "paperclip"
  ]);
  assert.deepEqual(visibleAnswers(undefined), []);
});

test("every challenge has a distinct question and at least one distractor", () => {
  const questions = new Set(challenges.map((challenge) => challenge.question));
  assert.equal(questions.size, challenges.length);
  for (const challenge of challenges) {
    assert.equal(new Set(challenge.answers.map(([, label]) => label)).size, challenge.answers.length);
    assert.ok(challenge.answers.length > 1);
  }
});
