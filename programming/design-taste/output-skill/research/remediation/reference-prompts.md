# Reference Prompts: Enforce Complete Output

Copy-paste these into system instructions or append to requests.

---

## General Purpose
```
Provide the complete output without any summarization, abbreviation, or truncation.
Do not use ellipses (...), "etc.", or similar shortcuts.
Do not reference earlier parts of your response instead of repeating necessary content.
Every section must contain complete, substantive content.
```

---

## Code Generation
```
Generate the complete, production-ready implementation.
Requirements:
- All functions fully implemented (no empty bodies)
- All imports included at the top
- All edge cases handled as specified
- No TODO comments
- No "// ... rest of implementation" shortcuts
- No descriptions replacing actual code
- TypeScript types throughout
If you approach token limits, stop at a clean breakpoint (end of function/file)
and indicate: [PAUSE — completed X of Y. Continue in next message]
```

---

## Analysis & Documentation
```
Provide exhaustive analysis where each section contains complete, substantive content.
Do not reference earlier sections instead of providing the actual information.
Do not use phrases like "as mentioned above" or "similar to the previous example".
Every point must be fully explained in its own section.
```

---

## Step-by-Step Reasoning
```
Work through this problem completely before generating your final response.
Show your full reasoning process.
Do not skip steps or summarize intermediate conclusions.
Output the complete solution after working through all steps.
```

---

## Continuation Handling
```
If you reach a token limit mid-output:
1. Stop at a natural breakpoint (end of function, end of section)
2. Output: [PART X/Y COMPLETE — next: describe what comes next]
3. Wait for me to say "continue"
4. Resume exactly where you left off — do not repeat completed content
```

---

## Anti-Laziness Framing
```
This implementation will go directly to production.
A senior engineer will review it immediately after you generate it.
Incomplete code, placeholders, or shortcuts will cause production failures.
Generate the complete, final implementation only.
```
