# Auth, Roles & Contribution

Two systems, deliberately separate:

- **Reading/learning identity** — Supabase Auth. Needed only for personal features (bookmarks, notes, progress, discussion). Reading never requires an account.
- **Contribution identity** — GitHub. Content changes are PRs against this repo; git history is the attribution and audit record. Linking a GitHub login to a Supabase account unifies the two (credits contributions to the profile).

---

## 1. Supabase auth flow

Providers: **GitHub OAuth** (primary — it doubles as the contribution link), **Google OAuth**, **magic link email**. No passwords.

Flow (PKCE, `@supabase/ssr`):
1. `/auth/sign-in` → `supabase.auth.signInWithOAuth({ provider, redirectTo: '/auth/callback' })`.
2. `/auth/callback` route handler exchanges the code, sets httpOnly cookies, redirects to `next` param (default: originating page — sign-in is always in-place, never loses context).
3. Middleware (`src/middleware.ts`) refreshes the session on navigation and injects `{ userId, role }` into request headers for server components; matcher excludes static assets and `/api/v1` GET corpus routes (they're anonymous anyway).
4. First sign-in trigger (Postgres function on `auth.users` insert) creates the `User` + `Profile` rows; handle derived from GitHub login when available, else editable suggestion.

Session UX: avatar in header; signed-out interactions with personal features (bookmark click, checkpoint submit) open a sign-in dialog and replay the action after callback. Local progress made while signed out (stored in IndexedDB) is offered for merge on first sign-in.

## 2. Roles

Stored in `User.role` (single ladder) + `Expertise` rows (per-category grants). Enforced in API handlers, RLS policies, and GitHub via CODEOWNERS/branch protection.

| Role | How obtained | Can do |
|---|---|---|
| **Reader** | Sign up | Everything anonymous + bookmarks, notes, highlights, progress. |
| **Contributor** | First merged PR (webhook auto-promotes when GitHub is linked) | + open discussions, propose content, appear in contributor feed. |
| **Reviewer** | ≥ 5 merged content PRs + maintainer approval | + peer-review PRs (approving review counts toward merge), triage discussions, approve AI enrichment PRs. |
| **Expert** | Credentialed/demonstrated domain expertise, granted per category by maintainers (recorded in `Expertise` with `grantedBy`) | + verification sign-off (`status: verified`) within their categories, resolve disputes in-domain. |
| **Maintainer** | GRØNN Studio + invited stewards | + merge rights, category RFCs, role grants, moderation, releases. |

Roles never gate reading. Expert status is per-category — a soil expert does not verify economics articles (CI checks the verifier's `Expertise` against the article's category).

## 3. Contribution flow — "Improve this page"

Every article footer renders `ImprovePageCTA` with two entry points:

- **Quick edit:** deep link to `github.com/<org>/equilibrium/edit/main/{filePath}` — GitHub auto-forks for non-collaborators, web editor, PR from fork. Ideal for typos/citations.
- **Full change:** link to `CONTRIBUTING.md` flow — fork, branch `content/{category}/{slug}-{change}`, local preview (`npm run dev`), PR using the content template (what changed, why, sources added).

### Pipeline (enforced by CI + branch protection on `main`)

```
propose (PR from fork)
  → automated validation   scripts/validate-content.ts: schema, edges, links,
                           citations, prose rules (05-content-model.md §4)
  → preview deploy         Vercel preview URL posted to the PR
  → peer review            ≥ 1 Reviewer approval; checks accuracy of claims
                           against cited sources, tone, structure
  → expert verification    required ONLY when the PR sets/keeps status: verified
                           or edits a verified article's body — an Expert in the
                           article's category approves via CODEOWNERS
                           (.github/CODEOWNERS maps content/knowledge/{cat}/ → expert team)
  → merge (squash)         maintainer or auto-merge when all checks green
  → post-merge             webhook: Contribution row, role promotion check,
                           achievement grants; deploy: content sync, embeddings,
                           Revision mirror, OG regeneration
```

Rules:
- Edits to a `verified` article that touch body prose automatically demote it to `reviewed` in the PR (validator enforces) unless an Expert re-verifies within the same PR — verification is a claim about specific content, not a permanent badge.
- New articles enter as `draft` (published but visibly badged) or `reviewed`; `verified` is never granted on first merge without expert review.
- AI enrichment PRs (`05` §5): frontmatter-only, Reviewer approval sufficient.
- Disagreements: discussion on the PR; unresolved → in-category Expert decides; cross-category or policy → maintainer RFC (issue with `rfc` label, 7-day comment window).

## 4. Verification model

`status` in frontmatter is the single source of truth (mirrored to DB):

| Status | Badge | Meaning |
|---|---|---|
| `draft` | grey outline | Published, structurally valid, unreviewed for accuracy. |
| `reviewed` | sage check | Peer-reviewed by a Reviewer: claims match cited sources. |
| `verified` | fern seal + expert name + date | Domain Expert attests accuracy and currency. Re-attestation prompted at 24 months (CI opens a "stale verification" issue). |

The `VerifiedBadge` tooltip links to `/about#methodology` explaining exactly this table — trust must be inspectable.

## 5. Version history

- **Source of truth:** git. `Revision` rows mirror commits touching each article (sha, message, author, PR#) via the sync job.
- **UI:** `RevisionHistory` on each article lists revisions with links to the GitHub diff; "verified as of" pins the sha the Expert approved.
- **User-facing changelog:** merged PRs labeled `content:major` surface in `/community` feed and the RSS content-updates channel.
- Attribution: `authors` frontmatter (substantial authorship) + full git history (every hand). Contributor profile pages aggregate both via `githubLogin`.

## 6. Account lifecycle & safety

- Deletion: Supabase account deletion cascades all user-owned rows (`onDelete: Cascade`); git history is unaffected (contributions are public record under CC BY-SA — stated at signup).
- Moderation: discussion posts flaggable; Maintainers can lock threads (`ThreadStatus.LOCKED`), remove posts (soft-delete with tombstone), and revoke roles. Code of Conduct lives at `/about#conduct` + `CODE_OF_CONDUCT.md`; enforcement is a maintainer duty.
- Rate limits on writes per `07-api-architecture.md`; new accounts (< 24h) cannot post discussions (spam damper).
