# Remediation: Parameter Tuning

## Temperature Control

| Range | Behavior | Best For |
|-------|----------|----------|
| 0.0–0.3 | Highly deterministic | Code generation, data extraction |
| 0.4–0.7 | Balanced | General tasks, analysis |
| 0.8–1.2 | Creative variance | Copywriting, brainstorming |
| 1.5+ | High randomness | Creative but risks coherence |

**For code generation:** Use 0.1–0.3 for deterministic, complete output.

## Top-p Sampling
Narrows token selection to those whose combined probability crosses threshold.

- `top_p: 0.0–0.6` combined with low temperature → constrained, predictable behavior
- Use for tasks requiring complete, correct code output

## Claude-Specific (Anthropic API)
```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=8192,  # Set high to avoid premature stopping
    temperature=0.2,  # Low for code, higher for creative
    messages=[...]
)
```

**Key:** Always set `max_tokens` generously. Artificially low limits cause truncation.

## Gemini Thinking Level (Reference)
Gemini 3 uses `thinking_level` parameter:
- `minimal` → fastest, least thorough
- `low` → light reasoning
- `medium` → balanced (recommended for most tasks)
- `high` → complex math, code generation (92-95% quality scores)

Note: `thinking_level` and `thinking_budget` are mutually exclusive — don't combine.

## Practical Settings for NOMO Development
```python
# For complete code generation
temperature=0.1
max_tokens=8192
top_p=0.95

# For design/creative work
temperature=0.7
max_tokens=4096
top_p=0.9
```
