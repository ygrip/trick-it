# Tool-owned article (Paraglide JS, 12 languages)

Each tool repository owns the reader documentation for its page. The host renders it from the manifest (`article`, `translations[locale].article`); see [tool-contract-v3.md](tool-contract-v3.md). Publishing an article is independent of existing tool-page indexing and ad eligibility; factual, localized documentation is still the goal of this rollout.

## Safe migration from existing tool translations

For tools not yet carrying editorial copy, start with:

```sh
node scripts/article-kit/seed-locales.mjs ../trick-it-tools/<tool-id>
```

This helper is **non-publishing**. It copies the existing tool-owned manifest description and translated usage guides into 12 `messages/article/<locale>.json` starter files, creates a separate Paraglide project, and writes a tool-specific editorial brief. It refuses to overwrite existing files. **These are seeds, not article translations**: they deliberately omit unsupported technical sections, fabricated FAQ entries and editorial validation. Complete and review these in the tool repository before installing the build integration below. The host neither stores nor publishes the tool's article text.

The source-migration status and links to all 36 tool PRs are in [ARTICLE_PROGRESS.md](ARTICLE_PROGRESS.md). Existing host-only English draft JSON was relocated and removed from the host.

## Audit untranslated article keys without publishing

After drafting the English article, run this helper **from the host repository** against a sibling tool checkout:

```sh
node scripts/article-kit/audit-locales.mjs ../trick-it-tools/<tool-id>
node scripts/article-kit/audit-locales.mjs ../trick-it-tools/<tool-id> --json --strict
```

It compares required English article keys against the eleven other tool-owned Paraglide catalogs, including missing catalogs, missing keys, untranslated exact-English values and obsolete starter keys. The `--strict` option exits non-zero for missing keys or invalid values; it does **not** treat exactly matching technical strings as an automatic failure. It never modifies the tool, generates translations, updates `tool.manifest.json` or publishes a draft. Fluent review and semantic translation checks remain mandatory.

## Install in a tool repository

```sh
node ../trick-it/scripts/article-kit/install.mjs .
```

This adds `project.article.inlang/settings.json`, `scripts/apply-article.mjs`, `scripts/article.test.mjs`, the `i18n:article` script and chains it after `npm run build`. The article is a **separate Paraglide project** from the tool's interface catalog: copy lives in `messages/article/<locale>.json` and never reaches the runtime locale packs.

## Message keys (flat, unprefixed)

| Key | Meaning |
| --- | --- |
| `headingAbout`, `headingFeatures`, `headingLimits`, `headingFaq` | Section headings |
| `about1`..`aboutN` (2-6) | Opening paragraphs |
| `feature1Title`, `feature1Body`.. (4-12) | Key features |
| `referenceTitle`, `reference<N>Heading`, `reference<N>P<M>`, `reference<N>Item<M>` | Technical reference: 2-8 sections, each with 1-6 paragraphs and optional list items |
| `exampleTitle`, `exampleP1`..`exampleP<N>` (1-6), `exampleCode` (optional, language-neutral) | Worked example |
| `limit1`..`limitN` (2-8) | Honest limitations and when to use something else |
| `faq1Q`, `faq1A`.. (4-12) | Questions people actually ask |

Plain text only: no HTML, Markdown or links. **Never write `{` or `}` in a message**: Paraglide treats braces as placeholders and the compile breaks, and escaping them fails the article test. Describe such syntax in words or keep it out of the prose. Paragraphs are at most 1,200 characters and the whole article under 28,000. Target 650-900 English words (the validator limit is the 28,000-character total).

## Writing rules

1. Ground every statement in the tool's source (`README.md`, `tool.manifest.json`, `src/`, `docs/`). Name real options, limits, formats and error messages. Never invent features, benchmarks or privacy claims; say "nothing leaves the browser" only when manifest `services`/`assets` and the code confirm it, otherwise state exactly what is sent and why.
2. Standards and format facts (RFC numbers, spec behaviour) are welcome when correct and relevant.
3. No filler, keyword stuffing or text repeated across tools.
4. English is `messages/article/en.json`. Every other locale (`id ms fil th vi zh my km lo ja hi`) needs every key except `exampleCode`. Translate meaning and tone naturally for a technical reader; do not transliterate. Keep numbers, identifiers, code, error-message strings, file formats and product names exactly. Use each language's own script and number conventions only where the digits of the source are preserved (the test strips separators and compares digit sequences).
5. Native-speaker review is still required before claiming translation quality; do not describe machine-assisted drafts as verified.

## Verify

```sh
npm run build   # compiles Paraglide, assembles tool.manifest.json
npm test        # includes scripts/article.test.mjs (all 12 locales must publish)
```

Commit `messages/article/*`, `project.article.inlang/`, `scripts/apply-article.mjs`, `scripts/article.test.mjs`, `package.json`, `.gitignore` and the regenerated `tool.manifest.json`. The host then re-pins the tool release; see [registry-layout.md](registry-layout.md).
