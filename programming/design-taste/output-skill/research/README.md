# Research: LLM Output Truncation

Why models produce incomplete outputs — and how to fix it.

## Key Finding
Truncation is a **deliberate behavioral choice**, not a decoding failure.
Models intentionally stop early due to alignment training, not capability limits.

## What Works
- Financial/psychological framing: +45% to +115% performance improvement (Microsoft research)
- Step-by-step instructions: logic task accuracy from 34% → 80%
- XML-structured prompts: reduce parsing ambiguity
- Explicit syntax binding: force tool execution over training weight shortcuts

## Structure
- `findings/` — empirical results and references
- `remediation/` — prompt engineering, parameter tuning, architectural patterns, reference prompts
- `root-causes/` — cognitive shortcuts, RLHF, training data bias, output limits
