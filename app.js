"use strict";

(() => {
    const CONFIG = {
        historyWindow: 25,
        presets: {
            realMatch: {
                label: "Real Match",
                text: "ABABDABACDABABCABAB",
                pattern: "ABABCABAB",
                d: 256,
                q: 101,
                mode: "rk"
            },
            multipleMatches: {
                label: "Multiple Matches",
                text: "AABAACAADAABAABA",
                pattern: "AABA",
                d: 256,
                q: 101,
                mode: "rk"
            },
            noMatch: {
                label: "No Match",
                text: "HELLOALGORITHMS",
                pattern: "WORLD",
                d: 256,
                q: 101,
                mode: "rk"
            },
            spuriousHit: {
                label: "Spurious Hit",
                text: "CAAEC",
                pattern: "ABD",
                d: 256,
                q: 5,
                mode: "spurious"
            }
        },
        modes: {
            rk: {
                label: "Rabin-Karp Rolling Hash",
                pseudocode: "rk"
            },
            naive: {
                label: "Naive Search Comparison",
                pseudocode: "naive"
            },
            kmp: {
                label: "KMP Comparison View",
                pseudocode: "kmp"
            },
            spurious: {
                label: "Spurious Hit Demonstration",
                pseudocode: "rk"
            },
            formula: {
                label: "Hash Formula View",
                pseudocode: "rk"
            }
        },
        views: {
            text: "Text and Pattern",
            hash: "Hash Computation",
            rolling: "Rolling Hash",
            verification: "Hash Match / Verification",
            comparison: "Comparison",
            summary: "Summary"
        },
        counters: [
            { key: "windowsChecked", label: "Windows Checked" },
            { key: "hashComputations", label: "Hash Computations" },
            { key: "rollingHashUpdates", label: "Rolling Hash Updates" },
            { key: "hashMatches", label: "Hash Matches" },
            { key: "characterComparisons", label: "Character Verifications" },
            { key: "realMatches", label: "Real Matches" },
            { key: "spuriousHits", label: "Spurious Hits" },
            { key: "naiveComparisons", label: "Naive Comparisons" },
            { key: "kmpComparisons", label: "KMP Comparisons" }
        ],
        pseudocode: {
            rk: [
                { line: 1, code: "RabinKarp(T, P, d, q):", tooltip: "Start the Rabin-Karp search with text T, pattern P, base d, and prime modulus q." },
                { line: 2, code: "n = length(T)", tooltip: "Store the text length so we know how many windows are possible." },
                { line: 3, code: "m = length(P)", tooltip: "Store the pattern length so each window uses exactly m characters." },
                { line: 4, code: "h = d^(m-1) mod q", tooltip: "Precompute the highest power of d used by the outgoing character in the rolling update." },
                { line: 5, code: "pHash = hash(P[0..m-1])", tooltip: "Compute the pattern hash once before sliding across the text." },
                { line: 6, code: "tHash = hash(T[0..m-1])", tooltip: "Compute the hash of the first text window." },
                { line: 7, code: "for s = 0 to n - m:", tooltip: "Slide the window across every possible starting position s." },
                { line: 8, code: "    if pHash == tHash:", tooltip: "A matching hash means the window is a candidate and must be verified." },
                { line: 9, code: "        verify T[s..s+m-1] against P", tooltip: "Compare characters one by one to reject collisions and confirm real matches." },
                { line: 10, code: "        if all characters match:", tooltip: "If verification succeeds for all m characters, the pattern truly occurs here." },
                { line: 11, code: "            report match at s", tooltip: "Record the starting position of the real match." },
                { line: 12, code: "    if s < n - m:", tooltip: "If another window exists, prepare the next hash." },
                { line: 13, code: "        tHash = (d * (tHash - T[s] * h) + T[s+m]) mod q", tooltip: "Update the next window hash in O(1) by removing the outgoing char and adding the incoming char." },
                { line: 14, code: "        if tHash < 0:", tooltip: "Modulo arithmetic can produce a negative intermediate value." },
                { line: 15, code: "            tHash = tHash + q", tooltip: "Add q to keep the stored hash non-negative." }
            ],
            naive: [
                { line: 1, code: "NaiveSearch(T, P):", tooltip: "Start the simple baseline algorithm." },
                { line: 2, code: "for s = 0 to n - m:", tooltip: "Try every possible alignment of the pattern against the text." },
                { line: 3, code: "    j = 0", tooltip: "Start comparing from the first pattern character." },
                { line: 4, code: "    while j < m and T[s+j] == P[j]:", tooltip: "Keep comparing characters until a mismatch appears or the full pattern matches." },
                { line: 5, code: "        j = j + 1", tooltip: "Advance to the next character only after a successful comparison." },
                { line: 6, code: "    if j == m:", tooltip: "If j reaches m, every pattern character matched this window." },
                { line: 7, code: "        report match at s", tooltip: "Record the position of the real match." }
            ],
            kmp: [
                { line: 1, code: "KMP(T, P):", tooltip: "Start the Knuth-Morris-Pratt search." },
                { line: 2, code: "pi = computePrefixFunction(P)", tooltip: "Precompute the failure-function table that tells KMP where to fall back." },
                { line: 3, code: "q = 0", tooltip: "q stores how many pattern characters currently match." },
                { line: 4, code: "for i = 0 to n - 1:", tooltip: "Scan the text from left to right exactly once." },
                { line: 5, code: "    while q > 0 and P[q] != T[i]:", tooltip: "If the next character mismatches, follow the prefix table instead of restarting from zero." },
                { line: 6, code: "        q = pi[q - 1]", tooltip: "Jump to the longest proper prefix that is also a suffix." },
                { line: 7, code: "    if P[q] == T[i]:", tooltip: "If the next character matches, extend the matched prefix." },
                { line: 8, code: "        q = q + 1", tooltip: "Advance the length of the current matched prefix." },
                { line: 9, code: "    if q == m:", tooltip: "A full pattern match has been found." },
                { line: 10, code: "        report match at i - m + 1", tooltip: "Record the match starting index." },
                { line: 11, code: "        q = pi[q - 1]", tooltip: "Continue efficiently by falling back according to the prefix table." }
            ]
        }
    };

    const DEFAULT_COUNTERS = Object.freeze({
        windowsChecked: 0,
        hashComputations: 0,
        rollingHashUpdates: 0,
        hashMatches: 0,
        characterComparisons: 0,
        realMatches: 0,
        spuriousHits: 0,
        naiveComparisons: 0,
        kmpComparisons: 0
    });

    const state = {
        activeMode: "rk",
        activeView: "text",
        speed: 1,
        currentStepIndex: 0,
        runData: null,
        status: "Idle",
        timerId: null
    };

    const refs = {};

    function createCounters() {
        return { ...DEFAULT_COUNTERS };
    }

    function createResults() {
        return {
            matches: [],
            spuriousHits: []
        };
    }

    function createVerificationState(overrides = {}) {
        return {
            checkedPairs: [],
            mismatchIndex: null,
            isRealMatch: false,
            isSpurious: false,
            verified: false,
            ...overrides
        };
    }

    function cloneCounters(counters = {}) {
        return { ...DEFAULT_COUNTERS, ...counters };
    }

    function cloneResults(results = {}) {
        return {
            matches: [...(results.matches || [])],
            spuriousHits: [...(results.spuriousHits || [])]
        };
    }

    function cloneVerification(verification = {}) {
        return {
            ...createVerificationState(),
            ...verification,
            checkedPairs: (verification.checkedPairs || []).map((pair) => ({ ...pair }))
        };
    }

    function cloneStep(step) {
        return {
            ...step,
            pseudoLines: [...(step.pseudoLines || [])],
            activeTextIndices: [...(step.activeTextIndices || [])],
            activePatternIndices: [...(step.activePatternIndices || [])],
            counters: cloneCounters(step.counters),
            results: cloneResults(step.results),
            verification: cloneVerification(step.verification),
            rolling: step.rolling ? { ...step.rolling } : null,
            kmpState: step.kmpState
                ? { ...step.kmpState, prefixTable: [...(step.kmpState.prefixTable || [])] }
                : null,
            hashFocus: step.hashFocus ? { ...step.hashFocus } : null
        };
    }

    function createStep(partial) {
        return {
            mode: "",
            modeLabel: "",
            stepNumber: 0,
            action: "",
            actionKey: "",
            historyResult: "",
            pseudoLines: [],
            explanation: "",
            windowStart: null,
            windowEnd: null,
            patternHash: null,
            windowHash: null,
            formulaText: "",
            iterativeText: "",
            hashFocus: null,
            rolling: null,
            activeTextIndices: [],
            activePatternIndices: [],
            verification: createVerificationState(),
            counters: createCounters(),
            results: createResults(),
            kmpState: null,
            hashMatched: false,
            ...partial,
            counters: cloneCounters(partial.counters),
            results: cloneResults(partial.results),
            verification: cloneVerification(partial.verification)
        };
    }

    function pushStep(trace, partial) {
        trace.push(createStep(partial));
    }

    function range(start, endExclusive) {
        const values = [];
        for (let index = start; index < endExclusive; index += 1) {
            values.push(index);
        }
        return values;
    }

    function normalizeInput(text) {
        return String(text ?? "")
            .replace(/\r/g, " ")
            .replace(/\n/g, " ")
            .replace(/\t/g, " ");
    }

    function hasUnsupportedControlCharacters(text) {
        return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text);
    }

    function charCodeValue(char) {
        return char.charCodeAt(0);
    }

    function isPrime(n) {
        if (!Number.isInteger(n) || n <= 1) {
            return false;
        }
        if (n === 2) {
            return true;
        }
        if (n % 2 === 0) {
            return false;
        }
        const limit = Math.floor(Math.sqrt(n));
        for (let candidate = 3; candidate <= limit; candidate += 2) {
            if (n % candidate === 0) {
                return false;
            }
        }
        return true;
    }

    function computeInitialHash(string, length, d, q) {
        let hash = 0;
        for (let index = 0; index < length; index += 1) {
            hash = (d * hash + charCodeValue(string[index])) % q;
        }
        return hash;
    }

    function computeHighOrderMultiplier(m, d, q) {
        let h = 1;
        for (let index = 0; index < m - 1; index += 1) {
            h = (h * d) % q;
        }
        return h;
    }

    function rollingHashUpdate(oldHash, outgoingChar, incomingChar, h, d, q) {
        let newHash = (d * (oldHash - charCodeValue(outgoingChar) * h) + charCodeValue(incomingChar)) % q;
        if (newHash < 0) {
            newHash += q;
        }
        return newHash;
    }

    function verifyMatch(text, pattern, startIndex) {
        const checkedPairs = [];
        for (let patternIndex = 0; patternIndex < pattern.length; patternIndex += 1) {
            const textIndex = startIndex + patternIndex;
            const textChar = text[textIndex];
            const patternChar = pattern[patternIndex];
            const match = textChar === patternChar;
            checkedPairs.push({
                offset: patternIndex,
                textIndex,
                patternIndex,
                textChar,
                patternChar,
                match
            });
            if (!match) {
                return {
                    matched: false,
                    checkedPairs,
                    mismatchIndex: patternIndex,
                    comparisons: checkedPairs.length
                };
            }
        }
        return {
            matched: true,
            checkedPairs,
            mismatchIndex: null,
            comparisons: checkedPairs.length
        };
    }

    function arraysEqual(left, right) {
        if (left.length !== right.length) {
            return false;
        }
        for (let index = 0; index < left.length; index += 1) {
            if (left[index] !== right[index]) {
                return false;
            }
        }
        return true;
    }

    function formatPositions(values) {
        return values.length ? values.join(", ") : "None";
    }

    function formatChar(char) {
        if (char === " ") {
            return '" "';
        }
        return `"${char}"`;
    }

    function formatMaybeNumber(value) {
        return value === null || value === undefined ? "—" : String(value);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function clampWindowStart(start, n, m) {
        if (n <= m) {
            return 0;
        }
        return Math.max(0, Math.min(start, n - m));
    }

    function getWindow(text, start, length) {
        return text.slice(start, start + length);
    }

    function createHashBreakdown(string, d, q) {
        const charDetails = [];
        const iterativeSteps = [];
        const terms = [];
        let hash = 0;
        const length = string.length;

        for (let index = 0; index < length; index += 1) {
            const char = string[index];
            const value = charCodeValue(char);
            const power = length - 1 - index;
            const previousHash = hash;
            hash = (d * hash + value) % q;
            charDetails.push({
                index,
                char,
                value,
                power
            });
            terms.push(`${value} × ${d}^${power}`);
            iterativeSteps.push({
                index,
                char,
                value,
                previousHash,
                newHash: hash,
                expression: `(${d} × ${previousHash} + ${value}) mod ${q} = ${hash}`
            });
        }

        return {
            string,
            finalHash: hash,
            charDetails,
            iterativeSteps,
            polynomialText: `hash("${string}") = (${terms.join(" + ")}) mod ${q} = ${hash}`
        };
    }

    function rabinKarpSearch(text, pattern, d, q) {
        const n = text.length;
        const m = pattern.length;
        const trace = [];
        const counters = createCounters();
        const results = createResults();
        const h = computeHighOrderMultiplier(m, d, q);
        const patternBreakdown = createHashBreakdown(pattern, d, q);
        const initialWindowString = getWindow(text, 0, m);
        const initialWindowBreakdown = createHashBreakdown(initialWindowString, d, q);
        const patternHash = patternBreakdown.finalHash;
        let currentWindowHash = initialWindowBreakdown.finalHash;

        pushStep(trace, {
            action: "Initialize search",
            actionKey: "setup",
            historyResult: "Ready",
            pseudoLines: [2, 3, 4],
            explanation: `The text length is n = ${n} and the pattern length is m = ${m}, so Rabin-Karp will inspect ${n - m + 1} window${n - m === 0 ? "" : "s"}. The high-order multiplier is h = ${d}^(${m - 1}) mod ${q} = ${h}.`,
            windowStart: 0,
            windowEnd: m - 1,
            formulaText: `n = ${n}\nm = ${m}\nh = ${d}^(${m - 1}) mod ${q} = ${h}`,
            counters,
            results
        });

        for (const step of patternBreakdown.iterativeSteps) {
            counters.hashComputations += 1;
            pushStep(trace, {
                action: "Build pattern hash",
                actionKey: "pattern-hash",
                historyResult: "Hash build",
                pseudoLines: [5],
                explanation: `We incorporate pattern[${step.index}] = ${formatChar(step.char)} with numeric value ${step.value}. The iterative update gives the partial pattern hash ${step.newHash}.`,
                windowStart: 0,
                windowEnd: m - 1,
                patternHash: step.newHash,
                windowHash: null,
                formulaText: patternBreakdown.polynomialText,
                iterativeText: step.expression,
                hashFocus: {
                    kind: "pattern",
                    activeIndex: step.index
                },
                activePatternIndices: [step.index],
                counters,
                results
            });
        }

        pushStep(trace, {
            action: "Pattern hash ready",
            actionKey: "pattern-hash-complete",
            historyResult: "Pattern ready",
            pseudoLines: [5],
            explanation: `The full pattern hash is pHash = ${patternHash}. Every text window will be compared against this fingerprint first.`,
            windowStart: 0,
            windowEnd: m - 1,
            patternHash,
            windowHash: null,
            formulaText: patternBreakdown.polynomialText,
            hashFocus: {
                kind: "pattern",
                activeIndex: null
            },
            counters,
            results
        });

        for (const step of initialWindowBreakdown.iterativeSteps) {
            counters.hashComputations += 1;
            pushStep(trace, {
                action: "Build first window hash",
                actionKey: "window-hash",
                historyResult: "Hash build",
                pseudoLines: [6],
                explanation: `We now hash the first text window character T[${step.index}] = ${formatChar(step.char)} with value ${step.value}. The partial window hash becomes ${step.newHash}.`,
                windowStart: 0,
                windowEnd: m - 1,
                patternHash,
                windowHash: step.newHash,
                formulaText: initialWindowBreakdown.polynomialText,
                iterativeText: step.expression,
                hashFocus: {
                    kind: "window",
                    activeIndex: step.index
                },
                activeTextIndices: [step.index],
                counters,
                results
            });
        }

        pushStep(trace, {
            action: "First window hash ready",
            actionKey: "window-hash-complete",
            historyResult: "Window ready",
            pseudoLines: [6],
            explanation: `The first text window ${formatChar(initialWindowString)} has hash tHash = ${currentWindowHash}. Now the sliding process can begin.`,
            windowStart: 0,
            windowEnd: m - 1,
            patternHash,
            windowHash: currentWindowHash,
            formulaText: initialWindowBreakdown.polynomialText,
            hashFocus: {
                kind: "window",
                activeIndex: null
            },
            activeTextIndices: range(0, m),
            counters,
            results
        });

        for (let start = 0; start <= n - m; start += 1) {
            const window = getWindow(text, start, m);
            const hashesEqual = patternHash === currentWindowHash;
            counters.windowsChecked += 1;

            pushStep(trace, {
                action: `Check window ${start}`,
                actionKey: "window-check",
                historyResult: hashesEqual ? "Hash equal" : "Hash mismatch",
                pseudoLines: hashesEqual ? [7, 8] : [7],
                explanation: `The current window is T[${start}..${start + m - 1}] = "${window}". Its hash is ${currentWindowHash}, while the pattern hash is ${patternHash}.${hashesEqual ? " The hashes match, so this window becomes a candidate and must be verified." : " Because the hashes differ, this window cannot be a real match."}`,
                windowStart: start,
                windowEnd: start + m - 1,
                patternHash,
                windowHash: currentWindowHash,
                activeTextIndices: range(start, start + m),
                activePatternIndices: range(0, m),
                hashMatched: hashesEqual,
                counters,
                results
            });

            if (hashesEqual) {
                counters.hashMatches += 1;

                pushStep(trace, {
                    action: "Hash values matched",
                    actionKey: "hash-match",
                    historyResult: "Verify",
                    pseudoLines: [8, 9],
                    explanation: `The pattern hash and window hash are both ${patternHash}. Rabin-Karp now performs character-by-character verification so a collision cannot be mistaken for a real match.`,
                    windowStart: start,
                    windowEnd: start + m - 1,
                    patternHash,
                    windowHash: currentWindowHash,
                    activeTextIndices: range(start, start + m),
                    activePatternIndices: range(0, m),
                    verification: createVerificationState({ verified: true }),
                    hashMatched: true,
                    counters,
                    results
                });

                const verification = verifyMatch(text, pattern, start);
                const checkedPairs = [];

                for (const pair of verification.checkedPairs) {
                    checkedPairs.push(pair);
                    counters.characterComparisons += 1;
                    const mismatch = !pair.match;

                    pushStep(trace, {
                        action: "Verify candidate window",
                        actionKey: "verify-char",
                        historyResult: mismatch ? "Mismatch" : "Match",
                        pseudoLines: [9],
                        explanation: mismatch
                            ? `Verification compares T[${pair.textIndex}] = ${formatChar(pair.textChar)} with P[${pair.patternIndex}] = ${formatChar(pair.patternChar)}. They differ, so the hash match is not enough to accept the window.`
                            : `Verification compares T[${pair.textIndex}] = ${formatChar(pair.textChar)} with P[${pair.patternIndex}] = ${formatChar(pair.patternChar)}. They match, so Rabin-Karp continues checking the next character.`,
                        windowStart: start,
                        windowEnd: start + m - 1,
                        patternHash,
                        windowHash: currentWindowHash,
                        activeTextIndices: [pair.textIndex],
                        activePatternIndices: [pair.patternIndex],
                        verification: createVerificationState({
                            checkedPairs: [...checkedPairs],
                            mismatchIndex: mismatch ? pair.patternIndex : null,
                            verified: true
                        }),
                        hashMatched: true,
                        counters,
                        results
                    });

                    if (mismatch) {
                        results.spuriousHits.push(start);
                        counters.spuriousHits += 1;
                        pushStep(trace, {
                            action: "Reject spurious hit",
                            actionKey: "spurious",
                            historyResult: "Spurious hit",
                            pseudoLines: [9],
                            explanation: `This window is a spurious hit. The hashes matched at shift ${start}, but verification failed at pattern index ${pair.patternIndex}, so Rabin-Karp rejects the window.`,
                            windowStart: start,
                            windowEnd: start + m - 1,
                            patternHash,
                            windowHash: currentWindowHash,
                            activeTextIndices: [pair.textIndex],
                            activePatternIndices: [pair.patternIndex],
                            verification: createVerificationState({
                                checkedPairs: [...checkedPairs],
                                mismatchIndex: pair.patternIndex,
                                isSpurious: true,
                                verified: true
                            }),
                            hashMatched: true,
                            counters,
                            results
                        });
                        break;
                    }
                }

                if (verification.matched) {
                    results.matches.push(start);
                    counters.realMatches += 1;
                    pushStep(trace, {
                        action: "Report real match",
                        actionKey: "real-match",
                        historyResult: "Real match",
                        pseudoLines: [10, 11],
                        explanation: `All ${m} characters matched after verification, so Rabin-Karp reports a real occurrence of the pattern at position ${start}.`,
                        windowStart: start,
                        windowEnd: start + m - 1,
                        patternHash,
                        windowHash: currentWindowHash,
                        activeTextIndices: range(start, start + m),
                        activePatternIndices: range(0, m),
                        verification: createVerificationState({
                            checkedPairs: [...verification.checkedPairs],
                            isRealMatch: true,
                            verified: true
                        }),
                        hashMatched: true,
                        counters,
                        results
                    });
                }
            }

            if (start < n - m) {
                const outgoingChar = text[start];
                const incomingChar = text[start + m];
                const outgoingValue = charCodeValue(outgoingChar);
                const incomingValue = charCodeValue(incomingChar);
                const rawValue = d * (currentWindowHash - outgoingValue * h) + incomingValue;
                const moddedValue = rawValue % q;
                const adjustedValue = moddedValue < 0 ? moddedValue + q : moddedValue;
                const nextWindowHash = rollingHashUpdate(currentWindowHash, outgoingChar, incomingChar, h, d, q);
                counters.rollingHashUpdates += 1;

                pushStep(trace, {
                    action: "Update rolling hash",
                    actionKey: "rolling-update",
                    historyResult: "Slide window",
                    pseudoLines: adjustedValue !== moddedValue ? [12, 13, 14, 15] : [12, 13],
                    explanation: `The window slides from shift ${start} to shift ${start + 1}. Rabin-Karp removes ${formatChar(outgoingChar)} with value ${outgoingValue}, multiplies by d = ${d}, and adds ${formatChar(incomingChar)} with value ${incomingValue}. This updates the next window hash in O(1).`,
                    windowStart: start + 1,
                    windowEnd: start + m,
                    patternHash,
                    windowHash: nextWindowHash,
                    rolling: {
                        oldHash: currentWindowHash,
                        newHash: nextWindowHash,
                        outgoingChar,
                        incomingChar,
                        outgoingValue,
                        incomingValue,
                        h,
                        rawValue,
                        moddedValue,
                        adjustedValue,
                        expression: `${d} × (${currentWindowHash} - ${outgoingValue} × ${h}) + ${incomingValue}`
                    },
                    activeTextIndices: [start, start + m],
                    counters,
                    results
                });

                currentWindowHash = nextWindowHash;
            }
        }

        pushStep(trace, {
            action: "Summarize Rabin-Karp run",
            actionKey: "summary",
            historyResult: "Done",
            pseudoLines: [7],
            explanation: `Rabin-Karp checked ${counters.windowsChecked} window${counters.windowsChecked === 1 ? "" : "s"}, found ${results.matches.length} real match${results.matches.length === 1 ? "" : "es"}, and recorded ${results.spuriousHits.length} spurious hit${results.spuriousHits.length === 1 ? "" : "s"}.`,
            windowStart: Math.max(0, n - m),
            windowEnd: n - 1,
            patternHash,
            windowHash: currentWindowHash,
            counters,
            results
        });

        return {
            matches: [...results.matches],
            spuriousHits: [...results.spuriousHits],
            counters: cloneCounters(counters),
            trace,
            patternHash,
            initialWindowHash: initialWindowBreakdown.finalHash,
            h,
            patternBreakdown,
            initialWindowBreakdown
        };
    }

    function naiveSearch(text, pattern) {
        const n = text.length;
        const m = pattern.length;
        const trace = [];
        const counters = createCounters();
        const results = createResults();

        pushStep(trace, {
            action: "Initialize naive search",
            actionKey: "setup",
            historyResult: "Ready",
            pseudoLines: [1, 2],
            explanation: `Naive search will examine all ${n - m + 1} possible alignments and compare characters directly from left to right.`,
            windowStart: 0,
            windowEnd: m - 1,
            counters,
            results
        });

        for (let start = 0; start <= n - m; start += 1) {
            pushStep(trace, {
                action: `Align pattern at ${start}`,
                actionKey: "naive-align",
                historyResult: "Align",
                pseudoLines: [2, 3],
                explanation: `Naive search places the pattern over T[${start}..${start + m - 1}] and begins comparing from pattern index j = 0.`,
                windowStart: start,
                windowEnd: start + m - 1,
                activeTextIndices: range(start, start + m),
                activePatternIndices: range(0, m),
                counters,
                results
            });

            let patternIndex = 0;
            const checkedPairs = [];

            while (patternIndex < m) {
                const textIndex = start + patternIndex;
                const textChar = text[textIndex];
                const patternChar = pattern[patternIndex];
                const match = textChar === patternChar;
                checkedPairs.push({
                    textIndex,
                    patternIndex,
                    textChar,
                    patternChar,
                    match
                });
                counters.naiveComparisons += 1;

                pushStep(trace, {
                    action: "Compare characters directly",
                    actionKey: "naive-compare",
                    historyResult: match ? "Match" : "Mismatch",
                    pseudoLines: match && patternIndex < m - 1 ? [4, 5] : [4],
                    explanation: match
                        ? `Naive search compares T[${textIndex}] = ${formatChar(textChar)} with P[${patternIndex}] = ${formatChar(patternChar)}. They match, so the algorithm moves to the next character.`
                        : `Naive search compares T[${textIndex}] = ${formatChar(textChar)} with P[${patternIndex}] = ${formatChar(patternChar)}. They differ, so this alignment fails immediately.`,
                    windowStart: start,
                    windowEnd: start + m - 1,
                    activeTextIndices: [textIndex],
                    activePatternIndices: [patternIndex],
                    verification: createVerificationState({
                        checkedPairs: [...checkedPairs],
                        mismatchIndex: match ? null : patternIndex,
                        verified: true
                    }),
                    counters,
                    results
                });

                if (!match) {
                    break;
                }

                patternIndex += 1;
            }

            if (patternIndex === m) {
                results.matches.push(start);
                pushStep(trace, {
                    action: "Report naive match",
                    actionKey: "naive-match",
                    historyResult: "Real match",
                    pseudoLines: [6, 7],
                    explanation: `All ${m} characters matched at alignment ${start}, so naive search reports a real match at position ${start}.`,
                    windowStart: start,
                    windowEnd: start + m - 1,
                    activeTextIndices: range(start, start + m),
                    activePatternIndices: range(0, m),
                    verification: createVerificationState({
                        checkedPairs: [...checkedPairs],
                        isRealMatch: true,
                        verified: true
                    }),
                    counters,
                    results
                });
            }
        }

        pushStep(trace, {
            action: "Summarize naive search",
            actionKey: "summary",
            historyResult: "Done",
            pseudoLines: [2],
            explanation: `Naive search completed ${counters.naiveComparisons} direct character comparison${counters.naiveComparisons === 1 ? "" : "s"} and found ${results.matches.length} real match${results.matches.length === 1 ? "" : "es"}.`,
            windowStart: Math.max(0, n - m),
            windowEnd: n - 1,
            counters,
            results
        });

        return {
            matches: [...results.matches],
            counters: cloneCounters(counters),
            trace
        };
    }

    function kmpPrefixFunction(pattern) {
        const prefixTable = new Array(pattern.length).fill(0);
        let prefixLength = 0;

        for (let index = 1; index < pattern.length; index += 1) {
            while (prefixLength > 0 && pattern[prefixLength] !== pattern[index]) {
                prefixLength = prefixTable[prefixLength - 1];
            }
            if (pattern[prefixLength] === pattern[index]) {
                prefixLength += 1;
            }
            prefixTable[index] = prefixLength;
        }

        return prefixTable;
    }

    function kmpSearch(text, pattern) {
        const n = text.length;
        const m = pattern.length;
        const prefixTable = kmpPrefixFunction(pattern);
        const trace = [];
        const counters = createCounters();
        const results = createResults();
        let matchedLength = 0;

        pushStep(trace, {
            action: "Build KMP prefix table",
            actionKey: "kmp-prefix",
            historyResult: "Prefix table",
            pseudoLines: [1, 2, 3],
            explanation: `KMP starts by computing the prefix table π = [${prefixTable.join(", ")}]. This table tells the algorithm how far it can fall back after a mismatch without rechecking characters unnecessarily.`,
            windowStart: 0,
            windowEnd: m - 1,
            kmpState: {
                q: matchedLength,
                i: -1,
                prefixTable
            },
            counters,
            results
        });

        for (let textIndex = 0; textIndex < n; textIndex += 1) {
            while (matchedLength > 0 && pattern[matchedLength] !== text[textIndex]) {
                counters.kmpComparisons += 1;
                pushStep(trace, {
                    action: "Follow prefix fallback",
                    actionKey: "kmp-fallback",
                    historyResult: "Fallback",
                    pseudoLines: [5, 6],
                    explanation: `KMP compares P[${matchedLength}] = ${formatChar(pattern[matchedLength])} with T[${textIndex}] = ${formatChar(text[textIndex])}. They mismatch, so it falls back to q = π[${matchedLength - 1}] = ${prefixTable[matchedLength - 1]}.`,
                    windowStart: clampWindowStart(textIndex - matchedLength, n, m),
                    windowEnd: Math.min(n - 1, clampWindowStart(textIndex - matchedLength, n, m) + m - 1),
                    activeTextIndices: [textIndex],
                    activePatternIndices: [matchedLength],
                    kmpState: {
                        q: matchedLength,
                        i: textIndex,
                        prefixTable
                    },
                    counters,
                    results
                });
                matchedLength = prefixTable[matchedLength - 1];
            }

            counters.kmpComparisons += 1;
            if (pattern[matchedLength] === text[textIndex]) {
                const previousMatchedLength = matchedLength;
                matchedLength += 1;
                pushStep(trace, {
                    action: "Extend current prefix match",
                    actionKey: "kmp-compare",
                    historyResult: "Match",
                    pseudoLines: [7, 8],
                    explanation: `KMP compares P[${previousMatchedLength}] = ${formatChar(pattern[previousMatchedLength])} with T[${textIndex}] = ${formatChar(text[textIndex])}. They match, so the current matched prefix length becomes q = ${matchedLength}.`,
                    windowStart: clampWindowStart(textIndex - matchedLength + 1, n, m),
                    windowEnd: Math.min(n - 1, clampWindowStart(textIndex - matchedLength + 1, n, m) + m - 1),
                    activeTextIndices: [textIndex],
                    activePatternIndices: [previousMatchedLength],
                    kmpState: {
                        q: matchedLength,
                        i: textIndex,
                        prefixTable
                    },
                    counters,
                    results
                });
            } else {
                pushStep(trace, {
                    action: "Keep current prefix length",
                    actionKey: "kmp-compare",
                    historyResult: "Mismatch",
                    pseudoLines: [7],
                    explanation: `KMP compares P[${matchedLength}] = ${formatChar(pattern[matchedLength])} with T[${textIndex}] = ${formatChar(text[textIndex])}. They mismatch, and because q = ${matchedLength}, the algorithm continues without restarting the entire pattern from scratch.`,
                    windowStart: clampWindowStart(textIndex - matchedLength, n, m),
                    windowEnd: Math.min(n - 1, clampWindowStart(textIndex - matchedLength, n, m) + m - 1),
                    activeTextIndices: [textIndex],
                    activePatternIndices: matchedLength < m ? [matchedLength] : [],
                    kmpState: {
                        q: matchedLength,
                        i: textIndex,
                        prefixTable
                    },
                    counters,
                    results
                });
            }

            if (matchedLength === m) {
                const matchStart = textIndex - m + 1;
                results.matches.push(matchStart);
                pushStep(trace, {
                    action: "Report KMP match",
                    actionKey: "kmp-match",
                    historyResult: "Real match",
                    pseudoLines: [9, 10, 11],
                    explanation: `The matched prefix length reached m = ${m}, so KMP reports a match at position ${matchStart}. It then falls back to q = π[${m - 1}] = ${prefixTable[m - 1]} to continue efficiently.`,
                    windowStart: matchStart,
                    windowEnd: matchStart + m - 1,
                    activeTextIndices: [textIndex],
                    activePatternIndices: [m - 1],
                    kmpState: {
                        q: matchedLength,
                        i: textIndex,
                        prefixTable
                    },
                    verification: createVerificationState({
                        isRealMatch: true,
                        verified: true
                    }),
                    counters,
                    results
                });
                matchedLength = prefixTable[matchedLength - 1];
            }
        }

        pushStep(trace, {
            action: "Summarize KMP search",
            actionKey: "summary",
            historyResult: "Done",
            pseudoLines: [4],
            explanation: `KMP completed ${counters.kmpComparisons} comparison${counters.kmpComparisons === 1 ? "" : "s"} in the search phase and found ${results.matches.length} real match${results.matches.length === 1 ? "" : "es"}.`,
            windowStart: Math.max(0, n - m),
            windowEnd: n - 1,
            kmpState: {
                q: matchedLength,
                i: n - 1,
                prefixTable
            },
            counters,
            results
        });

        return {
            matches: [...results.matches],
            counters: cloneCounters(counters),
            prefixTable,
            trace
        };
    }

    function finalizeTrace(trace, modeKey, staticCounters) {
        return trace.map((step, index) => {
            const next = cloneStep(step);
            next.mode = modeKey;
            next.modeLabel = CONFIG.modes[modeKey].label;
            next.stepNumber = index + 1;
            next.counters = cloneCounters({
                ...staticCounters,
                ...next.counters
            });
            return next;
        });
    }

    function buildSpuriousTrace(rkTrace, spuriousHits) {
        if (!spuriousHits.length) {
            const setupStep = cloneStep(rkTrace[0]);
            setupStep.action = "No spurious hit in this run";
            setupStep.actionKey = "no-spurious";
            setupStep.historyResult = "No collision";
            setupStep.pseudoLines = [8, 9];
            setupStep.explanation = "This input did not produce a spurious hit. Rabin-Karp still verified every hash match correctly, but no collision caused a false alarm in the current run.";
            const summaryStep = cloneStep(rkTrace[rkTrace.length - 1]);
            return [setupStep, summaryStep];
        }

        const focusWindows = new Set(spuriousHits);
        const indices = [];

        rkTrace.forEach((step, index) => {
            const nearbyWindow = typeof step.windowStart === "number"
                && [...focusWindows].some((hit) => Math.abs(hit - step.windowStart) <= 1);
            const relevantAction = new Set([
                "setup",
                "window-check",
                "hash-match",
                "verify-char",
                "spurious",
                "rolling-update",
                "summary"
            ]).has(step.actionKey);

            if (relevantAction && (nearbyWindow || step.actionKey === "setup" || step.actionKey === "summary")) {
                indices.push(index);
            }
        });

        return indices.map((index) => cloneStep(rkTrace[index]));
    }

    function buildFormulaTrace(rkTrace) {
        const allowed = new Set([
            "setup",
            "pattern-hash",
            "pattern-hash-complete",
            "window-hash",
            "window-hash-complete",
            "rolling-update",
            "summary"
        ]);
        return rkTrace.filter((step) => allowed.has(step.actionKey)).map((step) => cloneStep(step));
    }

    function buildRunData(text, pattern, d, q) {
        const rk = rabinKarpSearch(text, pattern, d, q);
        const naive = naiveSearch(text, pattern);
        const kmp = kmpSearch(text, pattern);
        const verification = {
            pass: arraysEqual(rk.matches, naive.matches),
            rkMatches: [...rk.matches],
            naiveMatches: [...naive.matches]
        };

        const staticForRk = {
            naiveComparisons: naive.counters.naiveComparisons,
            kmpComparisons: kmp.counters.kmpComparisons
        };
        const staticForNaive = {
            windowsChecked: rk.counters.windowsChecked,
            hashComputations: rk.counters.hashComputations,
            rollingHashUpdates: rk.counters.rollingHashUpdates,
            hashMatches: rk.counters.hashMatches,
            characterComparisons: rk.counters.characterComparisons,
            realMatches: rk.counters.realMatches,
            spuriousHits: rk.counters.spuriousHits,
            kmpComparisons: kmp.counters.kmpComparisons
        };
        const staticForKmp = {
            windowsChecked: rk.counters.windowsChecked,
            hashComputations: rk.counters.hashComputations,
            rollingHashUpdates: rk.counters.rollingHashUpdates,
            hashMatches: rk.counters.hashMatches,
            characterComparisons: rk.counters.characterComparisons,
            realMatches: rk.counters.realMatches,
            spuriousHits: rk.counters.spuriousHits,
            naiveComparisons: naive.counters.naiveComparisons
        };

        const traces = {
            rk: finalizeTrace(rk.trace, "rk", staticForRk),
            naive: finalizeTrace(naive.trace, "naive", staticForNaive),
            kmp: finalizeTrace(kmp.trace, "kmp", staticForKmp),
            spurious: finalizeTrace(buildSpuriousTrace(rk.trace, rk.spuriousHits), "spurious", staticForRk),
            formula: finalizeTrace(buildFormulaTrace(rk.trace), "formula", staticForRk)
        };

        return {
            text,
            pattern,
            n: text.length,
            m: pattern.length,
            d,
            q,
            h: rk.h,
            rk,
            naive,
            kmp,
            verification,
            traces
        };
    }

    function cacheDom() {
        refs.textInput = document.getElementById("textInput");
        refs.patternInput = document.getElementById("patternInput");
        refs.baseInput = document.getElementById("baseInput");
        refs.primeInput = document.getElementById("primeInput");
        refs.buildButton = document.getElementById("buildButton");
        refs.stepButton = document.getElementById("stepButton");
        refs.playButton = document.getElementById("playButton");
        refs.pauseButton = document.getElementById("pauseButton");
        refs.resetButton = document.getElementById("resetButton");
        refs.speedSlider = document.getElementById("speedSlider");
        refs.speedLabel = document.getElementById("speedLabel");
        refs.statusBadge = document.getElementById("statusBadge");
        refs.stepCounter = document.getElementById("stepCounter");
        refs.activeModeLabel = document.getElementById("activeModeLabel");
        refs.errorBanner = document.getElementById("errorBanner");
        refs.countersGrid = document.getElementById("countersGrid");
        refs.verificationSummary = document.getElementById("verificationSummary");
        refs.stringSvg = document.getElementById("stringSvg");
        refs.windowCaption = document.getElementById("windowCaption");
        refs.patternFormula = document.getElementById("patternFormula");
        refs.windowFormula = document.getElementById("windowFormula");
        refs.iterativeFormula = document.getElementById("iterativeFormula");
        refs.rollingSvg = document.getElementById("rollingSvg");
        refs.rollingCaption = document.getElementById("rollingCaption");
        refs.rollingInvariant = document.getElementById("rollingInvariant");
        refs.rollingStats = document.getElementById("rollingStats");
        refs.rollingFormula = document.getElementById("rollingFormula");
        refs.hashMatchSummary = document.getElementById("hashMatchSummary");
        refs.verificationResultCard = document.getElementById("verificationResultCard");
        refs.verificationPairs = document.getElementById("verificationPairs");
        refs.comparisonBody = document.getElementById("comparisonBody");
        refs.prefixTableCard = document.getElementById("prefixTableCard");
        refs.summaryGrid = document.getElementById("summaryGrid");
        refs.complexityNote = document.getElementById("complexityNote");
        refs.pseudocodeList = document.getElementById("pseudocodeList");
        refs.currentActionBadge = document.getElementById("currentActionBadge");
        refs.explanationBox = document.getElementById("explanationBox");
        refs.verificationPanel = document.getElementById("verificationPanel");
        refs.hashSnapshot = document.getElementById("hashSnapshot");
        refs.historyBody = document.getElementById("historyBody");
        refs.workedExampleContent = document.getElementById("workedExampleContent");
        refs.modeButtons = [...document.querySelectorAll("[data-mode]")];
        refs.viewTabs = [...document.querySelectorAll("[data-view]")];
        refs.viewPanels = [...document.querySelectorAll("[data-view-panel]")];
        refs.presetButtons = [...document.querySelectorAll("[data-preset]")];
    }

    function bindEvents() {
        refs.buildButton.addEventListener("click", handleBuild);
        refs.stepButton.addEventListener("click", handleStepForward);
        refs.playButton.addEventListener("click", handlePlay);
        refs.pauseButton.addEventListener("click", handlePause);
        refs.resetButton.addEventListener("click", handleReset);
        refs.speedSlider.addEventListener("input", handleSpeedChange);

        refs.textInput.addEventListener("input", handleInputMutation);
        refs.patternInput.addEventListener("input", handleInputMutation);
        refs.baseInput.addEventListener("input", handleInputMutation);
        refs.primeInput.addEventListener("input", handleInputMutation);

        refs.presetButtons.forEach((button) => {
            button.addEventListener("click", () => handlePreset(button.dataset.preset));
        });

        refs.modeButtons.forEach((button) => {
            button.addEventListener("click", () => setMode(button.dataset.mode));
        });

        refs.viewTabs.forEach((button) => {
            button.addEventListener("click", () => setView(button.dataset.view));
        });

        refs.historyBody.addEventListener("click", (event) => {
            const row = event.target.closest("[data-step-index]");
            if (!row) {
                return;
            }
            const targetIndex = Number(row.dataset.stepIndex);
            if (!Number.isNaN(targetIndex)) {
                pausePlayback();
                state.currentStepIndex = targetIndex;
                state.status = "Paused";
                render();
            }
        });

        refs.historyBody.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }
            const row = event.target.closest("[data-step-index]");
            if (!row) {
                return;
            }
            event.preventDefault();
            const targetIndex = Number(row.dataset.stepIndex);
            if (!Number.isNaN(targetIndex)) {
                pausePlayback();
                state.currentStepIndex = targetIndex;
                state.status = "Paused";
                render();
            }
        });
    }

    function getInputSnapshot() {
        return {
            text: normalizeInput(refs.textInput.value),
            pattern: normalizeInput(refs.patternInput.value),
            d: Number(refs.baseInput.value),
            q: Number(refs.primeInput.value)
        };
    }

    function validateInputs({ text, pattern, d, q }) {
        const errors = [];

        if (!text.length) {
            errors.push("Text T cannot be empty.");
        }
        if (!pattern.length) {
            errors.push("Pattern P cannot be empty.");
        }
        if (pattern.length > text.length) {
            errors.push("Pattern length must be less than or equal to text length.");
        }
        if (hasUnsupportedControlCharacters(text) || hasUnsupportedControlCharacters(pattern)) {
            errors.push("Inputs may contain letters, numbers, spaces, and simple punctuation, but not unsupported control characters.");
        }
        if (!Number.isInteger(d) || d <= 0) {
            errors.push("Base d must be a positive integer.");
        }
        if (!Number.isInteger(q) || q <= 0) {
            errors.push("Prime modulus q must be a positive integer.");
        } else if (!isPrime(q)) {
            errors.push("Prime modulus q must be a prime number.");
        }

        return errors;
    }

    function showErrors(errors) {
        if (!errors.length) {
            refs.errorBanner.classList.add("hidden");
            refs.errorBanner.innerHTML = "";
            return;
        }
        refs.errorBanner.classList.remove("hidden");
        refs.errorBanner.innerHTML = `<ul class="stack-list">${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>`;
    }

    function handleBuild() {
        pausePlayback();
        const snapshot = getInputSnapshot();
        const errors = validateInputs(snapshot);
        showErrors(errors);

        if (errors.length) {
            state.runData = null;
            state.currentStepIndex = 0;
            state.status = "Idle";
            render();
            return;
        }

        state.runData = buildRunData(snapshot.text, snapshot.pattern, snapshot.d, snapshot.q);
        state.currentStepIndex = 0;
        state.status = "Ready";
        render();
    }

    function getActiveTrace() {
        if (!state.runData) {
            return [];
        }
        return state.runData.traces[state.activeMode] || [];
    }

    function getCurrentStep() {
        const trace = getActiveTrace();
        return trace[state.currentStepIndex] || null;
    }

    function handleStepForward() {
        const trace = getActiveTrace();
        if (!trace.length) {
            return;
        }
        pausePlayback();
        if (state.currentStepIndex < trace.length - 1) {
            state.currentStepIndex += 1;
            state.status = state.currentStepIndex === trace.length - 1 ? "Done" : "Paused";
        } else {
            state.status = "Done";
        }
        render();
    }

    function pausePlayback() {
        if (state.timerId) {
            clearInterval(state.timerId);
            state.timerId = null;
        }
    }

    function handlePlay() {
        const trace = getActiveTrace();
        if (!trace.length) {
            return;
        }
        if (state.currentStepIndex >= trace.length - 1) {
            state.currentStepIndex = 0;
        }
        pausePlayback();
        state.status = "Playing";
        const delay = Math.max(120, Math.round(900 / state.speed));
        state.timerId = window.setInterval(() => {
            const activeTrace = getActiveTrace();
            if (state.currentStepIndex >= activeTrace.length - 1) {
                pausePlayback();
                state.status = "Done";
                render();
                return;
            }
            state.currentStepIndex += 1;
            if (state.currentStepIndex >= activeTrace.length - 1) {
                pausePlayback();
                state.status = "Done";
            }
            render();
        }, delay);
        render();
    }

    function handlePause() {
        if (!state.runData) {
            return;
        }
        pausePlayback();
        state.status = "Paused";
        render();
    }

    function handleReset() {
        pausePlayback();
        state.currentStepIndex = 0;
        state.status = state.runData ? "Ready" : "Idle";
        render();
    }

    function handleSpeedChange() {
        state.speed = Number(refs.speedSlider.value);
        refs.speedLabel.textContent = `${state.speed.toFixed(2)}x`;
        if (state.status === "Playing") {
            handlePlay();
        }
    }

    function handleInputMutation() {
        pausePlayback();
        state.runData = null;
        state.currentStepIndex = 0;
        state.status = "Idle";
        showErrors([]);
        render();
    }

    function handlePreset(presetKey) {
        const preset = CONFIG.presets[presetKey];
        if (!preset) {
            return;
        }
        refs.textInput.value = preset.text;
        refs.patternInput.value = preset.pattern;
        refs.baseInput.value = String(preset.d);
        refs.primeInput.value = String(preset.q);
        setMode(preset.mode, false);
        pausePlayback();
        state.runData = null;
        state.currentStepIndex = 0;
        state.status = "Idle";
        showErrors([]);
        render();
    }

    function setMode(modeKey, rerender = true) {
        if (!CONFIG.modes[modeKey]) {
            return;
        }
        pausePlayback();
        state.activeMode = modeKey;
        state.currentStepIndex = 0;
        state.status = state.runData ? "Ready" : "Idle";
        if (rerender) {
            render();
        }
    }

    function setView(viewKey) {
        if (!CONFIG.views[viewKey]) {
            return;
        }
        state.activeView = viewKey;
        render();
    }

    function getStatusClass(status) {
        switch (status) {
        case "Ready":
            return "badge-ready";
        case "Playing":
            return "badge-playing";
        case "Paused":
            return "badge-paused";
        case "Done":
            return "badge-done";
        default:
            return "badge-idle";
        }
    }

    function render() {
        const trace = getActiveTrace();
        if (state.currentStepIndex >= trace.length && trace.length) {
            state.currentStepIndex = trace.length - 1;
        }
        const step = getCurrentStep();

        renderStatus(trace);
        renderButtons(trace);
        renderModeControls();
        renderViewControls();
        renderCounterGrid(step);
        renderVerificationSummary();
        renderSvg(step);
        renderHashView(step);
        renderRollingView(step);
        renderVerificationView(step);
        renderComparisonView();
        renderSummaryView();
        renderPseudocode(step);
        renderExplanation(step);
        renderHistory(trace);
    }

    function renderStatus(trace) {
        refs.statusBadge.textContent = state.status;
        refs.statusBadge.className = `badge ${getStatusClass(state.status)}`;
        refs.stepCounter.textContent = trace.length
            ? `Step ${state.currentStepIndex + 1} / ${trace.length}`
            : "Step 0 / 0";
        refs.activeModeLabel.textContent = CONFIG.modes[state.activeMode].label;
    }

    function renderButtons(trace) {
        const hasTrace = trace.length > 0;
        const atEnd = hasTrace && state.currentStepIndex >= trace.length - 1;
        refs.stepButton.disabled = !hasTrace || state.status === "Playing" || atEnd;
        refs.playButton.disabled = !hasTrace || state.status === "Playing";
        refs.pauseButton.disabled = !hasTrace || state.status !== "Playing";
        refs.resetButton.disabled = !hasTrace;
    }

    function renderModeControls() {
        refs.modeButtons.forEach((button) => {
            const isActive = button.dataset.mode === state.activeMode;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    }

    function renderViewControls() {
        refs.viewTabs.forEach((button) => {
            const isActive = button.dataset.view === state.activeView;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        refs.viewPanels.forEach((panel) => {
            panel.classList.toggle("is-active", panel.dataset.viewPanel === state.activeView);
        });
    }

    function renderCounterGrid(step) {
        const counters = step ? step.counters : DEFAULT_COUNTERS;
        refs.countersGrid.innerHTML = CONFIG.counters.map((counter) => `
            <article class="counter-card">
                <span class="label">${escapeHtml(counter.label)}</span>
                <span class="value mono">${escapeHtml(formatMaybeNumber(counters[counter.key]))}</span>
            </article>
        `).join("");
    }

    function renderVerificationSummary() {
        if (!state.runData) {
            refs.verificationSummary.innerHTML = `
                <p><strong>Verification Panel:</strong> Build the current input to see final match positions, spurious hits, and a Rabin-Karp vs naive correctness check.</p>
            `;
            return;
        }

        const verifiedHashMatches = state.runData.rk.counters.hashMatches
            === state.runData.rk.counters.realMatches + state.runData.rk.counters.spuriousHits;
        const verificationPass = state.runData.verification.pass && verifiedHashMatches;
        const verificationClass = verificationPass ? "result-good" : "result-bad";

        refs.verificationSummary.innerHTML = `
            <div class="pill-line">
                <p><strong>Matches found at positions:</strong> <span class="mono">${escapeHtml(formatPositions(state.runData.rk.matches))}</span></p>
                <p><strong>Spurious hits:</strong> <span class="mono">${escapeHtml(formatPositions(state.runData.rk.spuriousHits))}</span></p>
                <p><strong>Naive search positions:</strong> <span class="mono">${escapeHtml(formatPositions(state.runData.naive.matches))}</span></p>
                <p><strong>Verification:</strong> <span class="${verificationClass}"><strong>${verificationPass ? "PASS" : "FAIL"}</strong></span>, every hash match was checked character by character: <strong>${verifiedHashMatches ? "Yes" : "No"}</strong>.</p>
            </div>
        `;
    }

    function buildWindowCaption(step) {
        if (!state.runData || !step || step.windowStart === null || step.windowEnd === null) {
            return "Build the trace to show the current text window, its hash, and the active pattern alignment.";
        }
        const window = getWindow(state.runData.text, step.windowStart, state.runData.m);
        return `Current window: T[${step.windowStart}..${step.windowEnd}] = "${window}". Pattern P = "${state.runData.pattern}".`;
    }

    function buildRollingCaption(step) {
        if (!state.runData) {
            return "Build the trace to watch the rolling hash travel with the sliding window.";
        }

        const windowStart = step && typeof step.windowStart === "number" ? step.windowStart : 0;
        const windowEnd = step && typeof step.windowEnd === "number" ? step.windowEnd : state.runData.m - 1;
        const displayedHash = step?.windowHash ?? state.runData.rk.initialWindowHash;

        if (step?.rolling) {
            return `The hash badge moves from T[${windowStart - 1}..${windowEnd - 1}] to T[${windowStart}..${windowEnd}], updating ${step.rolling.oldHash} to ${displayedHash} as ${formatChar(step.rolling.outgoingChar)} leaves and ${formatChar(step.rolling.incomingChar)} enters.`;
        }

        return `The badge stays attached to T[${windowStart}..${windowEnd}] and shows the current window hash tHash = ${displayedHash}.`;
    }

    function renderSvg(step) {
        if (!state.runData) {
            refs.stringSvg.setAttribute("viewBox", "0 0 960 220");
            refs.stringSvg.innerHTML = `
                <text x="48" y="110" fill="#94a3b8" font-size="18">Build the steps to visualize indexed character boxes, the sliding pattern, and active comparisons.</text>
            `;
            refs.windowCaption.textContent = buildWindowCaption(null);
            return;
        }

        const { text, pattern, n, m } = state.runData;
        const boxSize = Math.max(34, Math.min(50, Math.floor(820 / Math.max(n, m, 1))));
        const leftPad = 72;
        const topPad = 28;
        const textY = 62;
        const patternY = 142;
        const width = leftPad + boxSize * n + 32;
        const height = 220;
        const currentStart = step && typeof step.windowStart === "number" ? step.windowStart : 0;
        const currentEnd = step && typeof step.windowEnd === "number" ? step.windowEnd : m - 1;
        const mismatchIndex = step?.verification?.mismatchIndex;
        const isReal = step?.verification?.isRealMatch || step?.actionKey === "real-match";
        const isSpurious = step?.verification?.isSpurious || step?.actionKey === "spurious";
        const highlightHash = step?.hashMatched || step?.actionKey === "hash-match";

        const activeTextIndices = new Set(step?.activeTextIndices || []);
        const activePatternIndices = new Set(step?.activePatternIndices || []);

        const textBoxes = text.split("").map((char, index) => {
            const x = leftPad + index * boxSize;
            const y = textY;
            const classes = ["char-rect"];
            if (index >= currentStart && index <= currentEnd) {
                classes.push("window");
            }
            if (activeTextIndices.has(index)) {
                classes.push("active");
            }
            if (isReal && index >= currentStart && index <= currentEnd) {
                classes.push("real");
            }
            if (isSpurious && index >= currentStart && index <= currentEnd) {
                classes.push("spurious");
            }
            if (mismatchIndex !== null && index === currentStart + mismatchIndex) {
                classes.push("mismatch");
            }

            return `
                <text x="${x + boxSize / 2}" y="${topPad}" class="char-index">${index}</text>
                <rect x="${x}" y="${y}" rx="12" ry="12" width="${boxSize - 6}" height="${boxSize - 6}" class="${classes.join(" ")}"></rect>
                <text x="${x + (boxSize - 6) / 2}" y="${y + (boxSize - 6) / 2 + 1}" class="char-text">${escapeHtml(char)}</text>
            `;
        }).join("");

        const patternBoxes = pattern.split("").map((char, index) => {
            const x = leftPad + (currentStart + index) * boxSize;
            const y = patternY;
            const classes = ["char-rect"];
            if (activePatternIndices.has(index)) {
                classes.push("active");
            }
            if (isReal) {
                classes.push("real");
            }
            if (isSpurious) {
                classes.push("spurious");
            }
            if (mismatchIndex !== null && index === mismatchIndex) {
                classes.push("mismatch");
            }

            return `
                <text x="${x + boxSize / 2}" y="${patternY - 18}" class="char-index">${index}</text>
                <rect x="${x}" y="${y}" rx="12" ry="12" width="${boxSize - 6}" height="${boxSize - 6}" class="${classes.join(" ")}"></rect>
                <text x="${x + (boxSize - 6) / 2}" y="${y + (boxSize - 6) / 2 + 1}" class="char-text">${escapeHtml(char)}</text>
            `;
        }).join("");

        const windowOutline = `
            <rect x="${leftPad + currentStart * boxSize - 4}" y="${textY - 4}" width="${m * boxSize - 2}" height="${boxSize + 2}" rx="16" ry="16" class="window-outline"></rect>
        `;
        const hashOutline = highlightHash ? `
            <rect x="${leftPad + currentStart * boxSize - 4}" y="${textY - 4}" width="${m * boxSize - 2}" height="${boxSize + 2}" rx="16" ry="16" class="hash-outline"></rect>
        ` : "";

        refs.stringSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        refs.stringSvg.innerHTML = `
            <text x="10" y="${textY + boxSize / 2 - 6}" class="char-label">Text T</text>
            <text x="10" y="${patternY + boxSize / 2 - 6}" class="char-label">Pattern P</text>
            ${textBoxes}
            ${windowOutline}
            ${hashOutline}
            ${patternBoxes}
        `;
        refs.windowCaption.textContent = buildWindowCaption(step);
    }

    function renderRollingSvg(step) {
        if (!state.runData) {
            refs.rollingSvg.setAttribute("viewBox", "0 0 960 230");
            refs.rollingSvg.innerHTML = `
                <text x="48" y="116" fill="#94a3b8" font-size="18">Build the steps to watch the hash value move with the window.</text>
            `;
            refs.rollingCaption.textContent = buildRollingCaption(null);
            return;
        }

        const { text, n, m } = state.runData;
        const rolling = step?.rolling ?? null;
        const boxSize = Math.max(34, Math.min(48, Math.floor(820 / Math.max(n, m, 1))));
        const rectWidth = boxSize - 6;
        const rectHeight = boxSize - 6;
        const leftPad = 72;
        const textY = 118;
        const width = leftPad + boxSize * n + 32;
        const height = 242;
        const currentStart = step && typeof step.windowStart === "number" ? step.windowStart : 0;
        const currentEnd = step && typeof step.windowEnd === "number" ? step.windowEnd : m - 1;
        const previousStart = rolling ? Math.max(0, currentStart - 1) : currentStart;
        const windowWidth = Math.max(rectWidth, m * boxSize - 2);
        const currentWindowX = leftPad + currentStart * boxSize - 4;
        const previousWindowX = leftPad + previousStart * boxSize - 4;
        const currentCenterX = leftPad + currentStart * boxSize + ((m * boxSize) - 6) / 2;
        const previousCenterX = leftPad + previousStart * boxSize + ((m * boxSize) - 6) / 2;
        const currentHashLabel = rolling
            ? `new tHash = ${step.windowHash}`
            : `tHash = ${step?.windowHash ?? state.runData.rk.initialWindowHash}`;
        const previousHashLabel = rolling ? `old tHash = ${rolling.oldHash}` : "";
        const pillWidth = Math.max(
            138,
            currentHashLabel.length * 8 + 28,
            previousHashLabel.length * 8 + 28
        );
        const pillHeight = 34;
        const previousPillY = 8;
        const currentPillY = rolling ? 48 : 38;
        const currentPillX = currentCenterX - pillWidth / 2;
        const previousPillX = previousCenterX - pillWidth / 2;
        const flowY = textY - 18;
        const outgoingIndex = rolling ? currentStart - 1 : null;
        const incomingIndex = rolling ? currentEnd : null;

        const textBoxes = text.split("").map((char, index) => {
            const x = leftPad + index * boxSize;
            const classes = ["char-rect"];
            if (index >= currentStart && index <= currentEnd) {
                classes.push("window");
            }
            if (index === outgoingIndex) {
                classes.push("rolling-outgoing");
            }
            if (index === incomingIndex) {
                classes.push("rolling-incoming");
            }

            return `
                <text x="${x + boxSize / 2}" y="88" class="char-index">${index}</text>
                <rect x="${x}" y="${textY}" rx="12" ry="12" width="${rectWidth}" height="${rectHeight}" class="${classes.join(" ")}"></rect>
                <text x="${x + rectWidth / 2}" y="${textY + rectHeight / 2 + 1}" class="char-text">${escapeHtml(char)}</text>
            `;
        }).join("");

        const previousWindow = rolling ? `
            <rect x="${previousWindowX}" y="${textY - 7}" width="${windowWidth}" height="${rectHeight + 8}" rx="16" ry="16" class="rolling-previous-window"></rect>
        ` : "";

        const currentWindow = `
            <rect x="${currentWindowX}" y="${textY - 7}" width="${windowWidth}" height="${rectHeight + 8}" rx="16" ry="16" class="rolling-current-window">
                ${rolling ? `<animate attributeName="x" from="${previousWindowX}" to="${currentWindowX}" dur="0.45s" fill="freeze"></animate>` : ""}
            </rect>
        `;

        const flowArrow = rolling ? `
            <line x1="${previousCenterX}" y1="${flowY}" x2="${currentCenterX}" y2="${flowY}" class="rolling-flow-line"></line>
            <polygon points="${currentCenterX},${flowY} ${currentCenterX - 12},${flowY - 6} ${currentCenterX - 12},${flowY + 6}" class="rolling-flow-head"></polygon>
        ` : "";

        const previousHashBadge = rolling ? `
            <g transform="translate(${previousPillX} ${previousPillY})">
                <rect width="${pillWidth}" height="${pillHeight}" rx="17" ry="17" class="rolling-hash-pill rolling-hash-pill-old"></rect>
                <text x="${pillWidth / 2}" y="${pillHeight / 2 + 1}" class="rolling-hash-text rolling-hash-text-old">${escapeHtml(previousHashLabel)}</text>
            </g>
        ` : "";

        const currentHashBadge = `
            <g transform="translate(${currentPillX} ${currentPillY})">
                ${rolling ? `<animateTransform attributeName="transform" type="translate" from="${previousPillX} ${previousPillY}" to="${currentPillX} ${currentPillY}" dur="0.45s" fill="freeze"></animateTransform>` : ""}
                <rect width="${pillWidth}" height="${pillHeight}" rx="17" ry="17" class="rolling-hash-pill"></rect>
                <text x="${pillWidth / 2}" y="${pillHeight / 2 + 1}" class="rolling-hash-text">${escapeHtml(currentHashLabel)}</text>
            </g>
        `;

        const guideLines = `
            <line x1="${currentCenterX}" y1="${currentPillY + pillHeight}" x2="${currentCenterX}" y2="${textY - 10}" class="rolling-guide-line"></line>
            ${rolling ? `<line x1="${previousCenterX}" y1="${previousPillY + pillHeight}" x2="${previousCenterX}" y2="${textY - 10}" class="rolling-guide-line"></line>` : ""}
        `;

        const transitionLabels = rolling ? `
            <text x="${leftPad + outgoingIndex * boxSize + rectWidth / 2}" y="${textY + rectHeight + 22}" class="rolling-transition-label outgoing">out</text>
            <text x="${leftPad + incomingIndex * boxSize + rectWidth / 2}" y="${textY + rectHeight + 22}" class="rolling-transition-label incoming">in</text>
        ` : "";

        const summaryText = rolling
            ? `Shift ${previousStart} to ${currentStart}: remove ${formatChar(rolling.outgoingChar)}, add ${formatChar(rolling.incomingChar)}.`
            : `Current window T[${currentStart}..${currentEnd}] carries the hash value shown above it.`;

        refs.rollingSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        refs.rollingSvg.innerHTML = `
            <text x="10" y="${textY + rectHeight / 2 - 4}" class="char-label">Text T</text>
            <text x="10" y="34" class="char-label">tHash</text>
            ${flowArrow}
            ${previousHashBadge}
            ${currentHashBadge}
            ${guideLines}
            ${textBoxes}
            ${previousWindow}
            ${currentWindow}
            ${transitionLabels}
            <text x="${leftPad}" y="${height - 16}" fill="#c3d0e2" font-size="13">${escapeHtml(summaryText)}</text>
        `;
        refs.rollingCaption.textContent = buildRollingCaption(step);
    }

    function buildBreakdownLines(breakdown, activeIndex) {
        const lines = [
            { text: breakdown.polynomialText, active: false }
        ];
        breakdown.iterativeSteps.forEach((step) => {
            lines.push({
                text: `i = ${step.index}, char = ${formatChar(step.char)}, value = ${step.value}, hash = ${step.expression}`,
                active: activeIndex === step.index
            });
        });
        return lines;
    }

    function renderCodeBlock(container, lines) {
        container.innerHTML = lines.map((line) => `
            <div class="code-line${line.active ? " is-active" : ""}">${escapeHtml(line.text)}</div>
        `).join("");
    }

    function renderHashView(step) {
        if (!state.runData) {
            renderCodeBlock(refs.patternFormula, [{ text: "The pattern hash formula will appear here after building the trace.", active: false }]);
            renderCodeBlock(refs.windowFormula, [{ text: "The current window hash formula will appear here after building the trace.", active: false }]);
            renderCodeBlock(refs.iterativeFormula, [{ text: "The iterative modular updates will be explained step by step during playback.", active: false }]);
            return;
        }

        const patternActiveIndex = step?.hashFocus?.kind === "pattern" ? step.hashFocus.activeIndex : null;
        const patternLines = buildBreakdownLines(state.runData.rk.patternBreakdown, patternActiveIndex);
        renderCodeBlock(refs.patternFormula, patternLines);

        let windowBreakdown = state.runData.rk.initialWindowBreakdown;
        let windowActiveIndex = step?.hashFocus?.kind === "window" ? step.hashFocus.activeIndex : null;
        if (step && typeof step.windowStart === "number") {
            const currentWindow = getWindow(state.runData.text, step.windowStart, state.runData.m);
            windowBreakdown = createHashBreakdown(currentWindow, state.runData.d, state.runData.q);
            if (step.actionKey !== "window-hash") {
                windowActiveIndex = null;
            }
        }
        renderCodeBlock(refs.windowFormula, buildBreakdownLines(windowBreakdown, windowActiveIndex));

        const iterativeLines = [];
        if (step?.iterativeText) {
            iterativeLines.push({ text: `Current update: ${step.iterativeText}`, active: true });
        }
        if (step?.rolling) {
            iterativeLines.push({
                text: `Rolling update: (${state.runData.d} × (${step.rolling.oldHash} - ${step.rolling.outgoingValue} × ${step.rolling.h}) + ${step.rolling.incomingValue}) mod ${state.runData.q} = ${step.rolling.newHash}`,
                active: true
            });
        }
        if (!iterativeLines.length) {
            iterativeLines.push({
                text: `Pattern hash = ${state.runData.rk.patternHash}, first window hash = ${state.runData.rk.initialWindowHash}. Rabin-Karp compares these numeric fingerprints before verifying characters.`,
                active: false
            });
        }
        renderCodeBlock(refs.iterativeFormula, iterativeLines);
    }

    function renderRollingView(step) {
        renderRollingSvg(step);

        if (!state.runData) {
            refs.rollingInvariant.innerHTML = "The rolling hash invariant will appear here after building the trace.";
            refs.rollingStats.innerHTML = "";
            renderCodeBlock(refs.rollingFormula, [{ text: "newHash = (d × (oldHash - outgoingChar × h) + incomingChar) mod q", active: false }]);
            return;
        }

        const rolling = step?.rolling;
        const windowStart = step && typeof step.windowStart === "number" ? step.windowStart : 0;
        const windowEnd = step && typeof step.windowEnd === "number" ? step.windowEnd : state.runData.m - 1;
        const currentWindow = getWindow(state.runData.text, windowStart, state.runData.m);
        const displayedHash = step?.windowHash ?? state.runData.rk.initialWindowHash;

        refs.rollingInvariant.innerHTML = `
            <strong>Rolling hash invariant:</strong> at shift <span class="mono">s = ${windowStart}</span>, the stored
            <span class="mono">tHash</span> equals the hash of the current text window
            <span class="mono">T[${windowStart}..${windowEnd}] = "${escapeHtml(currentWindow)}"</span> modulo
            <span class="mono">${state.runData.q}</span>. In this step, that value is <span class="mono">${displayedHash}</span>.
        `;

        const stats = [
            { label: "h = d^(m-1) mod q", value: state.runData.h },
            { label: "Old Hash", value: rolling ? rolling.oldHash : "—" },
            { label: "Outgoing Character", value: rolling ? `${rolling.outgoingChar} (${rolling.outgoingValue})` : "—" },
            { label: "Incoming Character", value: rolling ? `${rolling.incomingChar} (${rolling.incomingValue})` : "—" },
            { label: "New Hash", value: rolling ? rolling.newHash : displayedHash },
            { label: "Time Per Update", value: "O(1)" }
        ];
        refs.rollingStats.innerHTML = stats.map((item) => `
            <article class="summary-item">
                <span class="label">${escapeHtml(item.label)}</span>
                <span class="value mono">${escapeHtml(String(item.value))}</span>
            </article>
        `).join("");

        const formulaLines = rolling
            ? [
                { text: `newHash = (d × (oldHash - outgoingChar × h) + incomingChar) mod q`, active: false },
                { text: `newHash = (${state.runData.d} × (${rolling.oldHash} - ${rolling.outgoingValue} × ${rolling.h}) + ${rolling.incomingValue}) mod ${state.runData.q}`, active: true },
                { text: `Intermediate value = ${rolling.rawValue}`, active: false },
                { text: `Intermediate mod q = ${rolling.moddedValue}`, active: false },
                { text: `Adjusted non-negative hash = ${rolling.adjustedValue}`, active: false }
            ]
            : [
                { text: `The current step is not a rolling update, but the invariant still holds for the displayed window hash ${displayedHash}.`, active: false },
                { text: `Formula: newHash = (d × (oldHash - outgoingChar × h) + incomingChar) mod q`, active: false }
            ];
        renderCodeBlock(refs.rollingFormula, formulaLines);
    }

    function renderVerificationView(step) {
        if (!state.runData) {
            refs.hashMatchSummary.innerHTML = "Build the trace to compare the pattern hash with the current window hash.";
            refs.verificationResultCard.innerHTML = "When hashes match, character-by-character verification details will appear here.";
            refs.verificationPairs.innerHTML = "<p>No verification pairs yet.</p>";
            return;
        }

        const patternHash = step?.patternHash ?? state.runData.rk.patternHash;
        const windowHash = step?.windowHash ?? state.runData.rk.initialWindowHash;
        const windowLabel = step && typeof step.windowStart === "number"
            ? `T[${step.windowStart}..${step.windowEnd}]`
            : "Current window";

        refs.hashMatchSummary.innerHTML = `
            <div class="pill-line">
                <div><strong>Pattern hash:</strong> <span class="mono">${patternHash}</span></div>
                <div><strong>${escapeHtml(windowLabel)} hash:</strong> <span class="mono">${windowHash}</span></div>
                <div><strong>Hash equal?</strong> <span class="mono">${step?.hashMatched ? "Yes" : "No"}</span></div>
            </div>
        `;

        if (!step?.verification?.checkedPairs.length) {
            refs.verificationPairs.innerHTML = "<p>The current step has not started character verification yet.</p>";
        } else {
            refs.verificationPairs.innerHTML = step.verification.checkedPairs.map((pair) => `
                <div class="pair-chip ${pair.match ? "match" : "mismatch"}">
                    <strong>T[${pair.textIndex}] ↔ P[${pair.patternIndex}]</strong><br>
                    <span class="mono">${escapeHtml(pair.textChar)} ↔ ${escapeHtml(pair.patternChar)}</span><br>
                    <span>${pair.match ? "Match" : "Mismatch"}</span>
                </div>
            `).join("");
        }

        let resultMessage = "No hash match is being verified in this step.";
        let resultClass = "";
        if (step?.verification?.isRealMatch) {
            resultMessage = `Real match confirmed at position ${step.windowStart}.`;
            resultClass = "result-good";
        } else if (step?.verification?.isSpurious) {
            resultMessage = `Spurious hit detected at position ${step.windowStart}. The hashes matched, but the characters did not.`;
            resultClass = "result-warn";
        } else if (step?.hashMatched) {
            resultMessage = "Hashes match, so Rabin-Karp is verifying the candidate window character by character.";
            resultClass = "result-warn";
        }

        refs.verificationResultCard.innerHTML = `<p class="${resultClass}"><strong>${escapeHtml(resultMessage)}</strong></p>`;
    }

    function renderComparisonView() {
        if (!state.runData) {
            refs.comparisonBody.innerHTML = `
                <tr>
                    <td colspan="5">Build a run to compare Naive Search, Rabin-Karp, and KMP on the same input.</td>
                </tr>
            `;
            refs.prefixTableCard.innerHTML = "The KMP prefix table will appear here after building the trace.";
            return;
        }

        const rows = [
            {
                algorithm: "Naive Search",
                idea: "Try every alignment and compare characters directly.",
                complexity: "O(1) / O(nm) / O(nm)",
                measured: `${state.runData.naive.counters.naiveComparisons} character comparisons`,
                matches: formatPositions(state.runData.naive.matches)
            },
            {
                algorithm: "Rabin-Karp",
                idea: "Use rolling hashes to filter windows before verification.",
                complexity: "O(m) preprocess, expected O(n + m), worst O(nm)",
                measured: `${state.runData.rk.counters.windowsChecked} hash checks, ${state.runData.rk.counters.characterComparisons} verification comparisons`,
                matches: formatPositions(state.runData.rk.matches)
            },
            {
                algorithm: "KMP",
                idea: "Use the prefix function to skip repeated comparisons after mismatches.",
                complexity: "O(n + m) / O(n + m) / O(n + m)",
                measured: `${state.runData.kmp.counters.kmpComparisons} search comparisons`,
                matches: formatPositions(state.runData.kmp.matches)
            }
        ];

        refs.comparisonBody.innerHTML = rows.map((row) => `
            <tr>
                <td><strong>${escapeHtml(row.algorithm)}</strong></td>
                <td>${escapeHtml(row.idea)}</td>
                <td>${escapeHtml(row.complexity)}</td>
                <td>${escapeHtml(row.measured)}</td>
                <td class="mono">${escapeHtml(row.matches)}</td>
            </tr>
        `).join("");

        refs.prefixTableCard.innerHTML = `
            <div class="pill-line">
                <div><strong>Pattern:</strong> <span class="mono">${escapeHtml(state.runData.pattern)}</span></div>
                <div><strong>Prefix table π:</strong> <span class="mono">[${escapeHtml(state.runData.kmp.prefixTable.join(", "))}]</span></div>
            </div>
        `;
    }

    function renderSummaryView() {
        if (!state.runData) {
            refs.summaryGrid.innerHTML = "";
            refs.complexityNote.textContent = "Build a valid example to see the final summary, complexity interpretation, and correctness check.";
            return;
        }

        const verifiedHashMatches = state.runData.rk.counters.hashMatches
            === state.runData.rk.counters.realMatches + state.runData.rk.counters.spuriousHits;
        const verificationStatus = state.runData.verification.pass && verifiedHashMatches ? "PASS" : "FAIL";

        const items = [
            { label: "Pattern", value: state.runData.pattern },
            { label: "Text Length n", value: state.runData.n },
            { label: "Pattern Length m", value: state.runData.m },
            { label: "Base d", value: state.runData.d },
            { label: "Prime Modulus q", value: state.runData.q },
            { label: "Pattern Hash", value: state.runData.rk.patternHash },
            { label: "Matches Found", value: formatPositions(state.runData.rk.matches) },
            { label: "Spurious Hits", value: formatPositions(state.runData.rk.spuriousHits) },
            { label: "Verification", value: verificationStatus }
        ];

        refs.summaryGrid.innerHTML = items.map((item) => `
            <article class="summary-item">
                <span class="label">${escapeHtml(item.label)}</span>
                <span class="value mono">${escapeHtml(String(item.value))}</span>
            </article>
        `).join("");

        refs.complexityNote.innerHTML = `
            <strong>Complexity explanation:</strong> Rabin-Karp used <span class="mono">${state.runData.rk.counters.hashComputations}</span>
            initial hash updates and <span class="mono">${state.runData.rk.counters.rollingHashUpdates}</span> rolling updates.
            This run shows the expected structure of <span class="mono">O(n + m)</span> average behavior, while still reminding us that many collisions could push the worst case toward <span class="mono">O(nm)</span>.
        `;
    }

    function renderPseudocode(step) {
        const lines = CONFIG.pseudocode[CONFIG.modes[state.activeMode].pseudocode];
        const activeLines = new Set(step?.pseudoLines || []);
        refs.pseudocodeList.innerHTML = lines.map((line) => `
            <li class="pseudocode-line ${activeLines.has(line.line) ? "active" : ""}" data-tooltip="${escapeHtml(line.tooltip)}">
                <span class="line-number">${line.line}</span>
                <code>${escapeHtml(line.code)}</code>
            </li>
        `).join("");
    }

    function renderExplanation(step) {
        if (!step || !state.runData) {
            refs.currentActionBadge.textContent = "Idle";
            refs.explanationBox.innerHTML = "<p>Build the steps to receive a plain-English explanation with concrete values from the current run.</p>";
            refs.verificationPanel.innerHTML = "<p>Final matches, spurious hits, and the correctness check will appear here after building.</p>";
            refs.hashSnapshot.innerHTML = "<p>The current pattern hash, window hash, and rolling-hash data will appear here.</p>";
            return;
        }

        refs.currentActionBadge.textContent = step.action;
        refs.explanationBox.innerHTML = `<p>${escapeHtml(step.explanation)}</p>`;

        const verifiedHashMatches = state.runData.rk.counters.hashMatches
            === state.runData.rk.counters.realMatches + state.runData.rk.counters.spuriousHits;
        refs.verificationPanel.innerHTML = `
            <div class="pill-line">
                <div><strong>Real matches:</strong> <span class="mono">${escapeHtml(formatPositions(state.runData.rk.matches))}</span></div>
                <div><strong>Spurious hits:</strong> <span class="mono">${escapeHtml(formatPositions(state.runData.rk.spuriousHits))}</span></div>
                <div><strong>Naive check:</strong> <span class="${state.runData.verification.pass ? "result-good" : "result-bad"}">${state.runData.verification.pass ? "PASS" : "FAIL"}</span></div>
                <div><strong>Every hash match verified:</strong> ${verifiedHashMatches ? "Yes" : "No"}</div>
            </div>
        `;

        refs.hashSnapshot.innerHTML = `
            <div class="pill-line">
                <div><strong>Pattern hash:</strong> <span class="mono">${escapeHtml(formatMaybeNumber(step.patternHash ?? state.runData.rk.patternHash))}</span></div>
                <div><strong>Window hash:</strong> <span class="mono">${escapeHtml(formatMaybeNumber(step.windowHash))}</span></div>
                <div><strong>Window:</strong> <span class="mono">${step.windowStart !== null ? `T[${step.windowStart}..${step.windowEnd}]` : "—"}</span></div>
                <div><strong>h:</strong> <span class="mono">${state.runData.h}</span></div>
            </div>
        `;
    }

    function renderHistory(trace) {
        if (!trace.length) {
            refs.historyBody.innerHTML = `
                <tr>
                    <td colspan="8">Build a trace to populate the step history.</td>
                </tr>
            `;
            return;
        }

        const end = state.currentStepIndex + 1;
        const start = Math.max(0, end - CONFIG.historyWindow);
        const rows = trace.slice(start, end);
        refs.historyBody.innerHTML = rows.map((step, offset) => {
            const actualIndex = start + offset;
            const isCurrent = actualIndex === state.currentStepIndex;
            const pseudoLine = step.pseudoLines.length ? step.pseudoLines.join(", ") : "—";
            const windowLabel = step.windowStart === null ? "—" : `${step.windowStart}..${step.windowEnd}`;
            return `
                <tr class="history-row ${isCurrent ? "is-current" : ""}" data-step-index="${actualIndex}" tabindex="0">
                    <td>${step.stepNumber}</td>
                    <td>${escapeHtml(step.modeLabel)}</td>
                    <td>${escapeHtml(step.action)}</td>
                    <td class="mono">${escapeHtml(windowLabel)}</td>
                    <td class="mono">${escapeHtml(formatMaybeNumber(step.patternHash))}</td>
                    <td class="mono">${escapeHtml(formatMaybeNumber(step.windowHash))}</td>
                    <td>${escapeHtml(step.historyResult)}</td>
                    <td class="mono">${escapeHtml(pseudoLine)}</td>
                </tr>
            `;
        }).join("");
    }

    function renderWorkedExample() {
        const preset = CONFIG.presets.multipleMatches;
        const run = buildRunData(preset.text, preset.pattern, preset.d, preset.q);
        refs.workedExampleContent.innerHTML = `
            <p>
                For the worked example <span class="mono">T = "${escapeHtml(preset.text)}"</span> and
                <span class="mono">P = "${escapeHtml(preset.pattern)}"</span>, the pattern hash is
                <span class="mono">${run.rk.patternHash}</span> and the first window hash is
                <span class="mono">${run.rk.initialWindowHash}</span>.
            </p>
            <p>
                Rabin-Karp slides the window across ${run.n - run.m + 1} positions, updating each next hash in
                <span class="mono">O(1)</span> using the rolling formula instead of recomputing the whole window.
            </p>
            <p>
                Real matches appear at positions <span class="mono">${escapeHtml(formatPositions(run.rk.matches))}</span>.
                With <span class="mono">q = ${preset.q}</span>, this example has
                <span class="mono">${run.rk.spuriousHits.length}</span> spurious hit${run.rk.spuriousHits.length === 1 ? "" : "s"}.
                If you reduce <span class="mono">q</span>, collisions become more likely and the tool will show why verification is necessary.
            </p>
            <p>
                The final correctness check compares Rabin-Karp against naive search and returns
                <span class="${run.verification.pass ? "result-good" : "result-bad"}"><strong>${run.verification.pass ? "PASS" : "FAIL"}</strong></span>.
            </p>
        `;
    }

    function init() {
        cacheDom();
        bindEvents();
        refs.speedLabel.textContent = `${state.speed.toFixed(2)}x`;
        renderWorkedExample();
        render();
    }

    const exported = {
        normalizeInput,
        charCodeValue,
        isPrime,
        computeInitialHash,
        computeHighOrderMultiplier,
        rollingHashUpdate,
        rabinKarpSearch,
        naiveSearch,
        kmpPrefixFunction,
        kmpSearch,
        verifyMatch,
        buildRunData
    };

    if (typeof window !== "undefined") {
        window.addEventListener("DOMContentLoaded", init);
        window.RabinKarpVisualizer = exported;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = exported;
    }
})();
