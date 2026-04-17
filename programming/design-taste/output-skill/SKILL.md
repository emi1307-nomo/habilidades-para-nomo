---
name: output-skill
description: Full-output enforcement — NO truncation, NO placeholders, NO shortcuts. Every file, function, and section delivered completely. Bans // ..., TODO, "for brevity", skeleton implementations. Use when you need complete production-ready code with zero omissions.
argument-hint: "[task requiring complete, untruncated output]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# Full-Output Enforcement

## Core Rule
**When a user requests specific deliverables — files, functions, sections — ALL items must be provided in full without omission.**

Exhaustiveness over brevity. Always.

## PROHIBITED Patterns

### In Code
- `// ...` or `...` standing in for missing logic
- `// TODO: implement this`
- `// rest of implementation`
- `/* same pattern as above */`
- Bare ellipses inside functions

### In Prose
- "For brevity, I'll skip..."
- "The rest follows the same pattern"
- "And so on for the remaining items"
- "Similar to the previous example"
- Describing what code would do instead of writing it

### In Structure
- Skeleton implementations (function signatures with empty bodies)
- Showing only first/last of a list
- Replacing repeated-but-necessary logic with "// repeat for X, Y, Z"
- Returning partial files and saying "add this to the existing code"

## Process

1. **Count deliverables upfront** — how many files, functions, sections?
2. **Generate each completely** — no stopping before the end
3. **Cross-check against original scope** before responding
4. **If approaching token limits** — write to a clean breakpoint (end of function/section), then pause with a structured indicator:

```
[PAUSE — completed X of Y sections. Ready to continue with Z]
```

Never compress or summarize remaining material. Never skip ahead.

## What "Complete" Means

### Complete File
- All imports present
- All functions fully implemented
- All edge cases handled (that were specified)
- Proper TypeScript types throughout
- No orphaned logic

### Complete Component
- All props typed
- All states initialized
- All handlers implemented
- JSX returns valid markup
- No `// TODO` left behind

### Complete Feature
- All specified endpoints/actions created
- All validation in place
- All UI states handled (loading, error, empty, success)
- All specified integrations wired up

## Token Limit Protocol
If the response is long and you need to split it:

```
[Part 1/3 — Files: layout.tsx, page.tsx complete]
[Part 2/3 — Files: components/Hero.tsx, components/Card.tsx — next message]
```

Then continue in the next message without waiting for the user to ask "continue".
