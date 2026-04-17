# Remediation: Architectural Patterns

## 1. Lazy-Loaded Skills
Agents use skill folders with minimal YAML metadata (~100 tokens) for discovery.
Full markdown workflows load only when needed.

**Result:** 35% reduction in average context usage while maintaining reliability.

**Key:** Precise descriptions over vague ones. "Upgrade existing websites without rewriting" beats "design skill".

This is exactly how `~/.claude/skills/` works — Claude reads SKILL.md only when the skill is invoked.

## 2. Model Context Protocol (MCP)
Bidirectional standard connecting LLMs to live external data.

Instead of relying on static training knowledge:
- Models fetch current documentation directly into context window
- Transforms models from static stores → reasoning engines on real-time data
- Eliminates outdated responses and hallucination incentives

**For NOMO:** Could connect Claude to live Supabase schema, live docs, or project state.

## 3. Chunked Task Execution
For large outputs, break work into sequential phases:

```
Phase 1: Request structure/architecture only (no code yet)
Phase 2: Implement each component individually
Phase 3: Assembly and integration
```

Prevents the model from compressing responses due to perceived length constraints.

**Example for a full page:**
```
Step 1: "List all components needed for this page"
Step 2: "Implement [Component A] completely"
Step 3: "Implement [Component B] completely"
Step 4: "Show me the complete page.tsx assembling them"
```

## Combining All Three

Best results come from:
1. Lazy-load skill context (only load what's needed)
2. Use MCP for live data (no stale context)
3. Chunk large tasks (prevent compression pressure)
+ Psychological framing from prompt-engineering.md
