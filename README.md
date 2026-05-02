# Rabin-Karp String Matching Visualizer

## Course / CLO Mapping
- Course context: Algorithms II final project
- CLO target: `CLO-4`
- Topic: Rabin-Karp String Matching Algorithm

## Project Description
This project is a standalone educational web application that teaches how string matching works, why naive matching can be slow, and how Rabin-Karp improves average-case searching with polynomial rolling hash and constant-time window updates.

The app is designed as a teaching simulator rather than a basic calculator. It builds real algorithm traces, shows synchronized pseudocode highlighting, explains each step in plain English, and verifies Rabin-Karp results against naive search for correctness.

## Features
- Fully offline static application
- Runs directly from `index.html`
- Dark-mode academic-tech interface
- Presets for real match, multiple matches, no match, and spurious hit
- Editable text, pattern, base `d`, and prime modulus `q`
- Input validation with clear error messages
- Rabin-Karp step-by-step animation with real rolling hash logic
- Naive search comparison trace
- KMP comparison view with prefix table
- Indexed text and pattern visualization using SVG
- Hash computation view with polynomial and iterative forms
- Rolling hash invariant explanation with concrete values
- Spurious-hit demonstration with collision verification
- Playback controls: build, step, play, pause, reset
- Speed control
- Step counter and status indicator
- Operation counters
- Verification panel and PASS/FAIL correctness check
- Pseudocode panel with line highlighting and hover explanations
- Scrollable history table with jump-to-step interaction
- Responsive layout suitable for desktop and mobile

## Algorithms Implemented
- `normalizeInput(text)`
- `charCodeValue(char)`
- `isPrime(n)`
- `computeInitialHash(string, length, d, q)`
- `computeHighOrderMultiplier(m, d, q)`
- `rollingHashUpdate(oldHash, outgoingChar, incomingChar, h, d, q)`
- `verifyMatch(text, pattern, startIndex)`
- `rabinKarpSearch(text, pattern, d, q)`
- `naiveSearch(text, pattern)`
- `kmpPrefixFunction(pattern)`
- `kmpSearch(text, pattern)`

## How to Run Locally
1. Download or clone the project files.
2. Open `index.html` in any modern browser.
3. Enter custom input or choose a preset.
4. Click `Build Steps` to generate the trace.
5. Use `Step`, `Play`, `Pause`, and `Reset` to explore the algorithm.

No installation, package manager, build step, or internet connection is required.

## How to Deploy on GitHub Pages
1. Push the project to a GitHub repository.
2. Make sure these files are in the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. In GitHub, open `Settings`.
4. Open `Pages`.
5. Under `Build and deployment`, select `Deploy from a branch`.
6. Choose the main branch and the `/ (root)` folder.
7. Save the settings.
8. GitHub Pages will publish the app directly because it is a static site.

## Polynomial Hashing
Rabin-Karp converts a string into a numeric fingerprint:

`hash(S) = (S[0] × d^(m-1) + S[1] × d^(m-2) + ... + S[m-1]) mod q`

In the app, character values come from `charCodeAt(0)`. The visualization also shows the iterative modular form:

`hash = (d × hash + charValue) mod q`

This iterative version is convenient for implementation and is mathematically equivalent to the polynomial form.

## Rolling Hash
Instead of recomputing the whole hash for every new window, Rabin-Karp updates the next window hash using:

`newHash = (d × (oldHash - outgoingChar × h) + incomingChar) mod q`

where:
- `h = d^(m-1) mod q`
- `outgoingChar` is the character leaving the window
- `incomingChar` is the character entering the window

This update is `O(1)` per shift, which is the key structural advantage of Rabin-Karp.

## Spurious Hits
A spurious hit happens when:

- the pattern hash equals the current window hash
- but the actual strings are different

This happens because hashing modulo `q` can create collisions. For that reason, Rabin-Karp never accepts a match based on hash equality alone. It always verifies the candidate window character by character.

The app includes a deterministic collision preset:
- Text: `CAAEC`
- Pattern: `ABD`
- Base: `256`
- Modulus: `5`

In that preset, the window `AAE` collides with `ABD`, so the tool visibly demonstrates a spurious hit and its rejection.

## Correctness Verification Against Naive Search
For every valid run, the application:
- executes Rabin-Karp on the current input
- executes naive search on the same input
- compares the final real match positions
- shows `PASS` when both algorithms agree

This proves that Rabin-Karp reports only verified real matches even when spurious hits occur.

## Rabin-Karp vs Naive vs KMP
### Naive Search
- Tries every alignment
- Compares characters directly
- Worst case: `O(nm)`
- Very simple, but can repeat a lot of work

### Rabin-Karp
- Uses rolling hash to compare fingerprints first
- Expected time: `O(n + m)` with good hashing
- Worst case: `O(nm)` if many collisions trigger verification
- Especially useful for multiple-pattern style hashing workflows

### KMP
- Uses a prefix function
- Worst case: `O(n + m)`
- Avoids restarting the pattern from the beginning after mismatches

The comparison view in the app shows both theoretical behavior and measured counts on the current example.

## Technology Notes
This project uses only:
- HTML5
- CSS3
- Vanilla JavaScript ES6+
- SVG

It does not use:
- React
- Vue
- jQuery
- D3
- Tailwind
- Bootstrap
- npm packages
- CDNs
- build tools
- external libraries

## File Structure
```text
/index.html
/styles.css
/app.js
/README.md
```

## Offline Compatibility
The app is self-contained and GitHub Pages compatible. All logic, styles, and visualizations are local, so the project works without any internet-dependent resource.
