# Contributing to Equilibrium

Welcome. Equilibrium (EOG) is a living, open knowledge hub for ecological and
regenerative thinking. It grows the way good software does — in the open, one
reviewed change at a time — but what we build together is a commons of clear,
trustworthy ecological knowledge.

You do not need to be a scientist, a developer or an expert to help. If you can
fix a typo, sharpen a sentence, add a citation or explain an idea plainly, there
is a place for you here. This guide explains how the project fits together and
how a contribution travels from your first edit to a verified, merged article.

## License and intent

Equilibrium is dual-licensed, and this is a deliberate part of the project's
intent:

- **Content** — every article, summary and citation — is shared under
  [Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
  Anyone may reuse and remix the knowledge, as long as they credit the
  contributors and share their derivative work under the same terms.
- **Code** — the Next.js application that renders the hub — is released under the
  **MIT License**.

By opening a pull request you agree that your content contributions are offered
under CC BY-SA 4.0 and your code contributions under MIT.

## How articles are structured

Articles are not loose Markdown files. They live as typed TypeScript data in
[`src/lib/knowledge/articles.ts`](src/lib/knowledge/articles.ts), where each
entry conforms to the `Article` interface in
[`src/lib/knowledge/types.ts`](src/lib/knowledge/types.ts). Keeping articles as
structured data is what lets the site build the knowledge graph, learning paths
and citation lists automatically.

An `Article` has the following shape:

| Field | Type | Meaning |
| --- | --- | --- |
| `slug` | `string` | Stable URL identifier, e.g. `soil-food-web`. |
| `title` | `string` | The article's display title. |
| `category` | `CategoryId` | One of the domains defined in `types.ts` (e.g. `soil`, `fungi`, `water`). |
| `summary` | `string` | An editorial standfirst shown under the title. |
| `difficulty` | `"foundational" \| "intermediate" \| "advanced"` | Reader level. |
| `readingMinutes` | `number` | Estimated reading time. |
| `updated` | `string` | ISO date of the last substantive edit, e.g. `2026-01-14`. |
| `contributors` | `string[]` | Names of people who wrote or verified the article. |
| `tags` | `string[]` | Free-form keywords for search and filtering. |
| `related` | `string[]` | Slugs of related articles. **These are the edges of the knowledge graph** — choose them thoughtfully. |
| `sections` | `ArticleSection[]` | The body: each section is `{ heading?, body: string[] }`, where `body` is an array of paragraphs. |
| `citations` | `Citation[]` | Sources: each is `{ id, authors, year, title, source, url? }`. |

A minimal example:

```ts
{
  slug: "nitrogen-fixation",
  title: "Nitrogen Fixation",
  category: "soil",
  summary: "How certain plants and microbes pull inert atmospheric nitrogen into living systems.",
  difficulty: "intermediate",
  readingMinutes: 8,
  updated: "2026-08-04",
  contributors: ["Your Name"],
  tags: ["nitrogen", "microbes", "fertility"],
  related: ["soil-food-web", "nutrient-cycling", "compost-science"],
  sections: [
    {
      body: [
        "First paragraph, written for a curious newcomer …",
        "Second paragraph, building the idea …",
      ],
    },
    {
      heading: "How it works",
      body: ["A paragraph under a subheading …"],
    },
  ],
  citations: [
    {
      id: "author-2021",
      authors: "Author, A.",
      year: 2021,
      title: "A Primary Source on Nitrogen Fixation",
      source: "Journal of Soil Science",
      url: "https://example.org/paper",
    },
  ],
}
```

Every slug you list in `related` should be a real article, and ideally that
article should link back to yours. Well-tended `related` arrays are what make the
graph feel alive rather than a list of disconnected pages.

## The editing workflow

1. **Fork** the repository to your own GitHub account.
2. **Edit** the relevant data or page. Every article on the site carries an
   "Improve this page" link that takes you straight to its source.
3. **Open a pull request** against `main` with a short description of what you
   changed and why.
4. **Automated checks** run first — linting and type-checking confirm the data
   still conforms to the schema and that links and citations are well-formed.
5. **Peer review** happens in the open on the PR. Other contributors read your
   work, ask questions and suggest improvements.
6. **Expert verification** — for factual content, a domain expert checks the
   claims and signs off. Verified articles carry a mark of trust.
7. **Merge.** Once checks pass and reviewers approve, a maintainer merges your
   change and it becomes part of the commons.

You can run the same checks locally before pushing:

```bash
npm install
npm run lint
```

## The quality bar for an article

A good Equilibrium article is a small, generous act of teaching. Hold your draft
against this measure:

- **One clear idea.** Each article explains a single concept well, from the
  ground up, rather than surveying everything at once.
- **Plain, accessible language.** Prefer the everyday word to the technical one.
  When a term of art is unavoidable, define it in place.
- **Primary-source citations.** Back claims with the original research, book or
  dataset — not a blog post about it. Add each to the `citations` array.
- **Connected, not isolated.** Link related concepts through the `related`
  field so readers can follow the thread and the graph stays whole.
- **A neutral, calm tone.** Present the evidence and let readers draw
  conclusions. Avoid hype, advocacy and absolutes.

## Proposing a new category or connection

- **A new connection** between existing articles is the easiest contribution:
  add the relevant slug to each article's `related` array and open a PR. Say in
  the description why the two ideas belong together.
- **A new category** is a bigger step. Categories are defined as `CategoryId`
  values and `Category` records in `src/lib/knowledge`. Before adding one, open a
  [Discussion](https://github.com/gronnstudio/g-eog/discussions) to propose it,
  so the community can help place it well and avoid overlap with existing
  domains.

## Where to ask for help

Not sure where a change belongs, or whether an idea fits? Start a thread in
[GitHub Discussions](https://github.com/gronnstudio/g-eog/discussions). Questions
are welcome and no contribution is too small. Thank you for helping tend the
commons.
