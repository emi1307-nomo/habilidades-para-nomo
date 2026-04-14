---
name: prompt-engineering
description: Design, debug, and optimize prompts for LLMs — few-shot learning, chain-of-thought, system prompts, prompt templates, A/B testing, metrics tracking. Use when building AI features, automations, or optimizing existing prompts.
argument-hint: "[task or prompt to design/optimize]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# Prompt Engineering

Structured workflows for designing, debugging, and optimizing LLM prompts.

## Core Workflows

### 1. Create a New Prompt

```
1. Analyze requirements
   - What input does the model receive?
   - What output format is needed?
   - What are the edge cases?
   - What should it never do?

2. Select patterns (see below)

3. Draft prompt

4. Validate against:
   - Happy path (normal input)
   - Edge cases (unusual but valid input)
   - Adversarial inputs (attempts to break it)

5. Measure: accuracy, consistency, token usage
```

### 2. Optimize an Existing Prompt

```
1. Measure baseline (10+ diverse test cases)
2. Identify failure mode (ambiguous instruction? missing context? wrong format?)
3. Change ONE variable at a time
4. Re-measure
5. Document what changed and why it worked
```

## Patterns

### System Prompt Structure

```
You are [role] helping [user type] to [primary goal].

## Context
[Relevant background the model needs]

## Instructions
1. [Explicit numbered steps]
2. [Be specific — avoid "be helpful"]

## Output Format
[Exact format: JSON schema, markdown structure, etc.]

## Constraints
- Never [hard rule 1]
- Always [hard rule 2]
- If [edge case], then [specific behavior]

## Examples
[Few-shot examples — see below]
```

### Few-Shot Examples

```
## Examples

Input: [example input 1]
Output: [example output 1]

Input: [example input 2 — edge case]
Output: [example output 2]

Input: [example input 3 — different pattern]
Output: [example output 3]
```

**Rules for few-shot:**
- 3-5 examples is usually optimal
- Include at least one edge case
- Order from simple to complex
- Examples must be correct — one bad example poisons the model

### Chain-of-Thought (for complex reasoning)

```
Analyze the following step by step:

1. First, identify [component A]
2. Then, determine [component B] based on A
3. Finally, produce [output] using A and B

Show your reasoning for each step before giving the final answer.
```

### Output Format Enforcement

```
Respond ONLY with valid JSON matching this schema. No explanation, no markdown.

{
  "status": "success" | "error",
  "data": { ... },
  "message": string
}

If you cannot complete the task, respond:
{ "status": "error", "data": null, "message": "reason" }
```

## Prompt Templates for NOMO / SaaS

### Menu Item Description Generator

```
You are a menu copywriter for restaurants.

Given a dish name and ingredients, write a compelling menu description.

Rules:
- Maximum 2 sentences
- Highlight the most appealing ingredient
- Never mention allergens (those are listed separately)
- Tone: warm, appetizing, simple language

Dish: {{name}}
Ingredients: {{ingredients}}
Cuisine type: {{cuisine}}

Description:
```

### Customer Support Classification

```
Classify this customer message into one category.

Categories:
- order_issue: problem with a current or recent order
- menu_question: asking about menu items, ingredients, or availability
- billing: payment or invoice related
- complaint: negative feedback
- other: anything else

Respond with ONLY the category name, nothing else.

Message: {{message}}
```

### Code Review Prompt

```
Review this {{language}} code for:
1. Security vulnerabilities (OWASP Top 10)
2. Performance issues
3. Type safety problems
4. Missing error handling

For each issue found:
- Severity: critical | high | medium | low
- Location: file:line
- Description: what's wrong
- Fix: corrected code snippet

Code:
{{code}}
```

## Quality Standards

- Target > 90% accuracy on 10+ diverse test cases
- < 5% variance across 3 repeated runs of the same input
- Test one variable at a time when optimizing
- Longer prompts are NOT always better — be explicit, not verbose
- Avoid instructions like "be helpful" — tell it exactly what to do

## Token Optimization

```
❌ Verbose: "Please carefully analyze the following user input and provide a comprehensive response that addresses all aspects of their question in a helpful and informative manner."

✅ Concise: "Answer the question. Be specific. Max 3 sentences."
```

## Prompt Versioning

```ts
// lib/prompts/menu-description.ts
export const MENU_DESCRIPTION_PROMPT = {
  version: "1.2.0",
  template: `You are a menu copywriter...`,
  // Keep old versions until you've validated the new one
}
```
