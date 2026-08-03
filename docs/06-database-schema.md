# Database Schema (PostgreSQL + Prisma)

The database serves three jobs: (1) **index** the git corpus for query/search/graph APIs, (2) own **user data** (profiles, progress, annotations, discussions), (3) record **community process** (contributions, achievements). Article bodies stay in git; `Article` rows store metadata + rendered search text, synced post-deploy keyed on `contentHash`.

Runtime: Supabase Postgres (with RLS on user-owned tables), Prisma as the app-side client, `pgvector` extension for embeddings (`09-search-and-ai.md`).

---

## Prisma schema

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  extensions = [vector, pg_trgm]
}

// ---------- Identity ----------

model User {
  id            String    @id @db.Uuid            // = Supabase auth.users.id
  email         String    @unique
  role          Role      @default(READER)
  createdAt     DateTime  @default(now())
  profile       Profile?
  bookmarks     Bookmark[]
  notes         Note[]
  highlights    Highlight[]
  progress      StepProgress[]
  enrollments   Enrollment[]
  posts         DiscussionPost[]
  contributions Contribution[]
  achievements  UserAchievement[]
  expertise     Expertise[]
}

enum Role { READER CONTRIBUTOR REVIEWER EXPERT MAINTAINER }

model Profile {
  userId       String  @id @db.Uuid
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  handle       String  @unique                    // public URL slug
  displayName  String
  bio          String? @db.Text
  githubLogin  String? @unique                    // links contribution flow
  avatarUrl    String?
  website      String?
  isPublic     Boolean @default(true)
}

model Expertise {                                  // expert verification rights, per category
  userId     String   @db.Uuid
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  grantedBy  String   @db.Uuid                     // maintainer user id
  grantedAt  DateTime @default(now())
  @@id([userId, categoryId])
}

// ---------- Corpus index (synced from git) ----------

model Category {
  id          String    @id                        // slug, e.g. "soil"
  title       String
  realm       String                               // ground|life|systems|built|science|mind
  description String    @db.Text
  toneHue     Int                                  // OKLCH hue for category tone
  articles    Article[]
  expertise   Expertise[]
}

model Article {
  id           String     @id @default(cuid())
  slug         String                              // unique within category
  categoryId   String
  category     Category   @relation(fields: [categoryId], references: [id])
  type         NodeType   @default(ARTICLE)
  title        String
  summary      String     @db.Text
  status       ArticleStatus @default(DRAFT)
  difficulty   Difficulty
  searchText   String     @db.Text                 // stripped body for FTS
  embedding    Unsupported("vector(1536)")?
  contentHash  String                              // sha256 of source file
  filePath     String                              // content/knowledge/soil/....mdx
  readingMins  Int
  publishedAt  DateTime?
  updatedAt    DateTime
  tags         ArticleTag[]
  outEdges     Edge[]     @relation("EdgeFrom")
  inEdges      Edge[]     @relation("EdgeTo")
  citations    Citation[]
  revisions    Revision[]
  bookmarks    Bookmark[]
  notes        Note[]
  highlights   Highlight[]
  discussions  DiscussionThread[]
  steps        PathStep[]
  @@unique([categoryId, slug])
  @@index([status, updatedAt])
}

enum NodeType { ARTICLE SPECIES TECHNIQUE }
enum ArticleStatus { DRAFT REVIEWED VERIFIED }
enum Difficulty { BEGINNER INTERMEDIATE ADVANCED }

model Tag {
  id       String       @id                        // kebab-case slug
  articles ArticleTag[]
}

model ArticleTag {
  articleId String
  tagId     String
  source    TagSource @default(AUTHOR)             // AUTHOR | AI_SUGGESTED
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([articleId, tagId])
}

enum TagSource { AUTHOR AI_SUGGESTED }

model Edge {
  id       String   @id @default(cuid())
  fromId   String
  toId     String
  type     EdgeType
  source   TagSource @default(AUTHOR)
  from     Article  @relation("EdgeFrom", fields: [fromId], references: [id], onDelete: Cascade)
  to       Article  @relation("EdgeTo",   fields: [toId],   references: [id], onDelete: Cascade)
  @@unique([fromId, toId, type])
  @@index([toId])
}

enum EdgeType { DEPENDS_ON ENABLES PART_OF RELATES_TO CONTRASTS_WITH SYMBIOTIC_WITH SUCCEEDED_BY }

model Citation {
  id        String  @id @default(cuid())
  articleId String
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  sourceKey String                                  // BibTeX key in citations/sources.bib
  csl       Json                                    // parsed CSL-JSON snapshot
  doi       String?
  url       String?
  @@unique([articleId, sourceKey])
}

model Revision {
  id         String   @id @default(cuid())
  articleId  String
  article    Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  gitSha     String
  message    String
  authorGh   String                                 // GitHub login at commit time
  prNumber   Int?
  createdAt  DateTime
  @@index([articleId, createdAt])
}

// ---------- Learning ----------

model LearningPath {
  id             String   @id                       // slug
  title          String
  summary        String   @db.Text
  difficulty     Difficulty
  estimatedHours Int
  steps          PathStep[]
  enrollments    Enrollment[]
}

model PathStep {
  id         String   @id @default(cuid())
  pathId     String
  path       LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  order      Int
  kind       StepKind
  articleId  String?                                // when kind = ARTICLE
  article    Article? @relation(fields: [articleId], references: [id])
  filePath   String?                                // interstitial / checkpoint source
  progress   StepProgress[]
  @@unique([pathId, order])
}

enum StepKind { ARTICLE INTERSTITIAL CHECKPOINT }

model Enrollment {
  userId      String   @db.Uuid
  pathId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  path        LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  startedAt   DateTime @default(now())
  completedAt DateTime?
  @@id([userId, pathId])
}

model StepProgress {
  userId      String   @db.Uuid
  stepId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  step        PathStep @relation(fields: [stepId], references: [id], onDelete: Cascade)
  completedAt DateTime @default(now())
  score       Int?                                  // checkpoint result, 0–100
  @@id([userId, stepId])
}

// ---------- Personal library ----------

model Bookmark {
  userId    String   @db.Uuid
  articleId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@id([userId, articleId])
}

model Note {
  id        String   @id @default(cuid())
  userId    String   @db.Uuid
  articleId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  body      String   @db.Text                       // markdown, private by default
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([userId, articleId])
}

model Highlight {
  id           String  @id @default(cuid())
  userId       String  @db.Uuid
  articleId    String
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  article      Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  anchor       Json                                 // { textStart, textEnd, prefix, suffix } W3C-style text quote anchor
  color        String  @default("sage")
  createdAt    DateTime @default(now())
}

// ---------- Community ----------

model DiscussionThread {
  id        String   @id @default(cuid())
  articleId String
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  title     String
  createdAt DateTime @default(now())
  status    ThreadStatus @default(OPEN)
  posts     DiscussionPost[]
}

enum ThreadStatus { OPEN RESOLVED LOCKED }

model DiscussionPost {
  id        String   @id @default(cuid())
  threadId  String
  thread    DiscussionThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  authorId  String   @db.Uuid
  author    User     @relation(fields: [authorId], references: [id])
  parentId  String?                                 // single-level replies only (enforced in app)
  body      String   @db.Text
  createdAt DateTime @default(now())
  editedAt  DateTime?
}

model Contribution {                                // mirror of merged GitHub PRs
  id        String   @id @default(cuid())
  userId    String?  @db.Uuid                       // null until GitHub login is linked
  user      User?    @relation(fields: [userId], references: [id])
  githubLogin String
  prNumber  Int      @unique
  kind      ContributionKind
  articleIds String[]                               // affected articles
  mergedAt  DateTime
}

enum ContributionKind { NEW_ARTICLE EDIT REVIEW VERIFICATION ENRICHMENT INFRA }

model Achievement {
  id          String @id                            // e.g. "first-contribution"
  title       String
  description String
  users       UserAchievement[]
}

model UserAchievement {
  userId        String @db.Uuid
  achievementId String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  earnedAt      DateTime @default(now())
  @@id([userId, achievementId])
}
```

---

## Design notes

- **Git is upstream for corpus tables.** `Category`, `Article`, `Edge`, `Citation`, `Revision`, `LearningPath`, `PathStep` are written only by the sync job (service role); RLS denies client writes. `contentHash` makes sync idempotent; deletions in git soft-delete via `status` reversion + orphaned-row sweep.
- **`Article.id` is a cuid, not the slug** — slugs can be renamed (with redirects) without breaking user data (bookmarks, notes, edges).
- **Edges are duplicated from frontmatter** rather than read from `graph.json` at runtime so the graph API can filter/traverse in SQL (`@@index([toId])` covers inbound lookups) and so AI-suggested edges (`source: AI_SUGGESTED`, pre-review) can be staged without touching git.
- **Highlights use text-quote anchors** (prefix/suffix + quoted text) instead of offsets, so they survive article edits; re-anchoring runs on content sync, and unresolvable highlights are flagged in the user's library rather than silently dropped.
- **RLS summary:** user-owned tables (`Bookmark`, `Note`, `Highlight`, `StepProgress`, `Enrollment`) — owner-only. `Profile` readable when `isPublic`. Discussions readable by all, writable by `CONTRIBUTOR+`, moderation by `MAINTAINER`. Corpus tables read-only to clients.
- **Vector index:** `CREATE INDEX ON "Article" USING hnsw (embedding vector_cosine_ops);` plus a GIN `pg_trgm` index on `searchText` — both created in a raw SQL migration since Prisma can't express them declaratively.
