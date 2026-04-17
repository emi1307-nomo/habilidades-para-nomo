# Remediation: Prompt Engineering Techniques

## 1. Psychological Pattern Matching
Linguistic cues that activate better-performing data distributions in latent space.

**Phrases that work:**
- "Take a deep breath and work through this step by step"
- "This is very important to my career"
- "I'm going to tip you $200 for a complete answer"
- "You are an expert senior engineer with 20 years of experience"

Results: up to 80% accuracy gains on logic tasks (Microsoft EmotionPrompt research).

## 2. Explicit Syntax Binding
Constrains model discretion — forces tool execution over training weight shortcuts.

```
Generate the complete implementation. Do not use placeholders.
After generating, verify: does every function have a complete body?
Are all imports present? Are all edge cases handled?
```

Mandating evidence blocks forces the model to process data before generating:
```
First, list every file that needs to be modified.
Then implement each one completely before moving to the next.
```

## 3. XML-Structured Prompts
Organizes instructions into compartments — reduces parsing ambiguity.

```xml
<system>You are a senior Next.js engineer. Output complete code only.</system>
<context>Working on NOMO Digital, a restaurant SaaS. Stack: Next.js 16, Supabase, TypeScript.</context>
<task>Implement the complete order creation Server Action with Zod validation.</task>
<requirements>
- Complete implementation, no placeholders
- All imports included
- TypeScript types throughout
- Error handling at boundaries only
</requirements>
```

## 4. Verification Approaches

### Chain of Verification
```
After generating, ask yourself:
1. Is every function fully implemented?
2. Are there any // ... or TODO comments?
3. Would this code run without modification?
If any answer is no, fix it before responding.
```

### Self-Grading Loop
```
Grade your output on completeness (0-10).
If score < 9, identify what's missing and add it.
Only respond when score is 9 or 10.
```

### Reverse Prompting
Ask the model to generate its own optimal prompt structure, then use that structure.
