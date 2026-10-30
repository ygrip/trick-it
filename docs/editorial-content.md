# Editorial content: tool articles and guides

> **Superseded ownership proposal:** The user now requires tool-specific guidelines and content in each tool's own repository, localized into all 12 supported languages with Paraglide JS. The host-owned JSON format below is an unfinished draft, not the required final architecture. See [adsense-continuation.md](adsense-continuation.md) before implementing.

Every tool page renders a host-authored article below the running tool. Long-form guides live at `/guides/<slug>/`. Content is plain JSON in `content/`, validated by `node scripts/validate-content.mjs` (the build runs it with `--require-all`, so every catalog tool needs an article).

Why: a tool UI with a two-line description is a thin page to search engines and ad reviewers. The article explains what the tool does, how it behaves, where it breaks and how to use it, written from the tool's actual source.

## Rules for writers

1. **Ground every claim in the tool's source** (`../trick-it-tools/<id>/`: `README.md`, `tool.manifest.json`, `src/`, `docs/`). Name real options, formats, algorithms, limits and defaults. Never invent features, benchmarks, user counts or performance numbers.
2. **Standards and formats** (RFC numbers, spec behaviour, format quirks) may be explained from general knowledge when correct and relevant; prefer what the tool's code actually implements.
3. **Be useful, not padded.** No generic filler ("In today's fast-paced world…"), no keyword stuffing, no repeating the description. Each paragraph should teach something.
4. **Privacy statements** must match the code: only say "nothing is uploaded" when the tool genuinely runs locally. If it calls a service (manifest `services`, `fetch`), say what is sent and why.
5. **English, plain text.** Inline formatting is limited to `` `code` `` and `[label](/path/)` or `[label](https://…)` links. Link related tools with their path (e.g. `[JSON Tools](/json-tools/)`). No HTML, no Markdown headings or bold.
6. **Target 900–1,400 words per tool article** (validator minimum 700). Guides: 1,500–2,500 words (minimum 1,200).

## Tool article: `content/tools/<id>.json`

```json
{
  "id": "jwt-tools",
  "updated": "2026-10-30",
  "about": ["2-4 paragraphs: what problem it solves, who it is for, how it works under the hood"],
  "features": [{ "title": "Short feature name", "body": "1-3 sentences on what it does and why it matters" }],
  "reference": {
    "title": "Technical reference title, e.g. JWT structure and validation rules",
    "sections": [
      { "heading": "Section heading", "blocks": [
        { "type": "p", "text": "Paragraph with `code` and [links](/json-tools/)." },
        { "type": "list", "items": ["item"], "ordered": false },
        { "type": "table", "head": ["Column", "Column"], "rows": [["cell", "cell"]] },
        { "type": "code", "language": "json", "code": "{\n  \"alg\": \"HS256\"\n}" },
        { "type": "note", "text": "Caveat or warning" }
      ] }
    ]
  },
  "example": { "title": "Worked example title", "blocks": [ "…same block types; a realistic input, the steps, and what the reader should see" ] },
  "limits": ["Honest limitation or when to use something else (at least 2)"],
  "faq": [{ "question": "Real question a user would search", "answer": "Direct 2-4 sentence answer" }]
}
```

Counts: `about` 2–4, `features` 4–8, `reference.sections` 2–6, `faq` 4–8, `limits` ≥ 2.

## Guide: `content/guides/<slug>.json`

```json
{
  "slug": "jwt-validation-pitfalls",
  "title": "Guide title",
  "description": "Meta description, at most 170 characters",
  "published": "2026-10-30",
  "updated": "2026-10-30",
  "tools": ["jwt-tools"],
  "intro": ["1-3 opening paragraphs"],
  "sections": [{ "heading": "…", "blocks": ["…block types as above"] }]
}
```

`sections` 4–12. `tools` lists catalog tool ids the guide uses; the page links to them.
