# CAPTCHA of Nonsense

An intentionally useless offline CAPTCHA. It asks five absurd emoji questions, runs them through a tiny pretend-AI scoring system, and estimates whether you are a human, a toaster, or possibly a wizard.

## Run

Open `index.html` in any modern browser. There is no build step, dependency, account, network request, tracking, or API key.

## Features

- Five rotating nonsense challenges
- Single-select answer group exposed as a keyboard-navigable radio group
- A completely unscientific humanity meter
- Responsive layout and live result announcements
- All content generated locally in the browser

## Layout

- `index.html` — markup and the two script tags
- `scoring-jokes.js` — the challenge set and the pure scoring rules; also read by the tests
- `app.js` — DOM wiring and event handlers
- `style.css` — all styling
- `tests/scoring.test.mjs` — assertions for the pure logic

## Check

```powershell
npm run check
```

Parses both scripts without executing them. It is the same check the CI workflow runs before the tests.

## Test

```powershell
npm test
```

Runs the node test runner over `tests/scoring.test.mjs`. There are no dependencies to install.

## License

MIT. See `LICENSE`.
