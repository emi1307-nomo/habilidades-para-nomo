# Empirical Results: LLM Output Truncation

## Key Findings

### Truncation is Deliberate
Experiment B: truncation stems from "deliberate behavioral choice, not a decoding failure."
Models aren't selecting suboptimal tokens — they're making intentional decisions to stop.

### Root Causes
- Instruction complexity exceeding internal effort thresholds
- Stopping pressure from alignment training
- Economic constraints during RLHF
- NOT memory limitations or context loss

### Stimulus Responsiveness (Microsoft Research)
- Financial incentives: **+45% improvement**
- Step-by-step instructions: logic accuracy from **34% → 80%**
- Combined stimuli: **up to +115% overall performance**

### Seasonal Effects
ChatGPT produces notably shorter outputs during December — correlates with holiday patterns in training data. Confirms behaviors are **learned patterns**, not inherent limits.

## Practical Implication
These behaviors are calibrated during training → responsive to prompt design and contextual framing.
The `output-skill` SKILL.md enforcement rules exist because of this research.
