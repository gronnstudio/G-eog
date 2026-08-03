# Search & AI

Search is the connective tissue of "everything is connected": the corpus must be reachable from a keystroke anywhere. AI extends search into understanding — but under strict guardrails: **AI retrieves, summarizes, and suggests; humans author and verify.**

---

## 1. Instant search UX (Cmd-K)

- Opens < 16ms (palette pre-mounted, hidden); input focused immediately; results render as-you-type.
- **Perceived latency budget: < 50ms.** Achieved with a two-tier pipeline:
  - **Tier 0 — local:** a build-generated MiniSearch index (title + summary + tags of all nodes, ~200KB gzip) ships in the PWA cache and answers instantly, offline included.
  - **Tier 1 — server:** `GET /api/v1/search` (lexical) refines results; responses reconcile into the list without reordering the top hit the user is about to press Enter on (result stability rule: once a query is 300ms old, top-3 order is frozen unless the user keeps typing).
- Debounce 80ms for server tier only. Keyboard: full arrow/Enter/Tab semantics, `Cmd-Enter` opens in Explore (graph focused on the node).
- Result groups per `01-information-architecture.md` §8. Zero-result state: "Ask Equilibrium" CTA + closest fuzzy matches.
- Recent + frequently visited nodes shown on empty query (local only, never sent to server).

## 2. Lexical search (server)

Postgres FTS + trigram, as specified in `07-api-architecture.md` §3:
- `tsvector` column maintained by trigger: `setweight(title,'A') || setweight(summary,'B') || setweight(searchText,'C')`.
- `websearch_to_tsquery('english', q)` for operators; `pg_trgm` `similarity() > 0.3` catches typos/latin species names; merged via reciprocal rank fusion (k=60).
- Boosts: `status=VERIFIED` ×1.2, `updatedAt` < 90d ×1.1, exact title prefix ×1.5.

## 3. Semantic / natural-language search

**Embeddings pipeline** (runs in `internal/sync` on content change, keyed by `contentHash`):
1. Chunk article body: heading-aware splits, target 400 tokens, 80 overlap; prepend `"{category} › {title} › {heading}"` context header to each chunk.
2. Embed with `text-embedding-3-small` (1536d) → `ArticleChunk` table (`articleId, heading, anchor, embedding vector(1536)`), plus one whole-article embedding on `Article.embedding` (used for related-content and enrichment).
3. HNSW cosine index (`m=16, ef_construction=64`).

**Query path** (`mode=semantic` or `auto` fallback):
query → embed → top-20 chunks → collapse to articles (max-score per article) → rerank: `0.7·cosine + 0.15·status + 0.15·lexical overlap` → return with chunk anchor so the result deep-links to the matching section (`#heading`).

**Question detection** for `auto`: interrogatives, `?`, > 4 words with verb — cheap heuristic client-side, no LLM call just to route.

## 4. AI features

All LLM calls go through one module, `src/server/ai/`, with a single provider adapter, per-feature prompt files, and logged token spend. Model tier: small/fast for tagging & summaries, mid-tier for ask/tutor. Temperature ≤ 0.3 everywhere — this is a reference work.

### 4.1 Summaries
- "Key points" box on long articles (> 12 min read): 3–5 bullets generated **from the article text only**, cached by `contentHash` (so cost is once per revision, served via `GET /ai/summary/{id}` with `s-maxage=86400`).
- Labeled "AI-generated summary — read the full article for nuance." Reviewers can pin a human-written summary in frontmatter (`keyPoints:`), which always wins and suppresses the AI box.

### 4.2 Related suggestions
"Related" panel = union of (a) authored edges (always first, badge per edge type) and (b) embedding neighbors not already linked, labeled "You might also explore," max 3, cosine ≥ 0.78. Clicking an AI suggestion logs the pair; frequently-followed suggestions surface in the enrichment report as edge candidates (`05` §5) — reader behavior feeds curation, via human review.

### 4.3 Gap detection
Monthly job producing `docs/log` report + issues: missing nodes (terms referenced ≥ 3× with no article), thin neighborhoods (verified articles with < 3 inbound edges), stale verification (> 24 months), category imbalance. Output is a ranked worklist for contributors — surfaced on `/community` as "Wanted articles."

### 4.4 Ask Equilibrium (grounded Q&A / tutor)
`POST /api/v1/ai/ask`, SSE streaming.
- **RAG-strict:** retrieve top-8 chunks (semantic §3) → LLM answers **only** from provided chunks with inline citation markers `[1]`; every sentence-level claim must carry one. System prompt forbids outside knowledge; if retrieval confidence is low (top cosine < 0.72) the response is exactly: "Equilibrium doesn't cover this well yet" + nearest topics + a link to propose the article.
- Answers render with citation chips linking to source sections; a "verified sources only" toggle restricts retrieval to `status=verified`.
- **Tutor mode** (within `/learn`, authed): same grounding, plus path context (current step, prior checkpoints) to calibrate level; may generate practice questions **from step content**; never advances progress itself.

## 5. Guardrails

1. **No AI-authored content.** LLM output never enters `content/` except as reviewed frontmatter suggestions via the enrichment PR flow. AI text in the UI is always visually labeled and typographically distinct (monospace caption "AI" chip).
2. **Grounding or silence.** Ask/tutor cannot answer from model priors. Refusal-with-pointers is a designed, styled state, not an error.
3. **Citation integrity.** Streaming post-processor validates every `[n]` marker maps to a retrieved chunk; unmatched claims are stripped before render, and > 20% stripped aborts to the low-confidence state.
4. **Safety domains.** Foraging/medicinal/mushroom-ID queries append a fixed caution block and never render species-ID answers without linking the full verified profile; the tutor refuses to confirm edibility determinations outright.
5. **Privacy.** Queries are not stored with user identity; aggregate query logs (for gap detection) are k-anonymized (dropped unless ≥ 5 distinct sessions). No user notes/highlights are ever included in prompts.
6. **Cost and abuse.** Rate limits per `07`; per-day token ceiling with graceful degradation (ask disabled, search unaffected — search never depends on an LLM).
7. **Determinism where it matters.** Tagging/edge suggestion runs pinned model versions; prompt files are versioned in-repo; every enrichment PR records model + prompt hash in its description.

## 6. Evaluation

- Golden set: 150 query→expected-node pairs (maintained in `tests/search-golden.json`); CI reports MRR@5 on the lexical tier per deploy; semantic tier evaluated weekly.
- Ask feature: 50-question grounded-answer eval scored on citation validity (automated) and correctness (quarterly human pass).
- Regression gate: MRR@5 drop > 5% blocks deploy of search-related changes.
