# Tool-owned article rollout — continuation tracker

## Status: 36 repositories tracked, **not release-ready**

This document tracks Trick-it [host PR #110](https://github.com/ygrip/trick-it/pull/110) and its 36 independent tool repositories. **Keep PR #110 open and unmerged until tool releases, native/fluent translation review, source verification, production builds, and browser checks are complete.** An article does not guarantee AdSense acceptance, and a word count is not a Google requirement.

The host now contains only the **article schema, renderer, seed/install tooling and platform-wide translations**, not editorial drafts for individual tools. All 16 earlier English host drafts were copied into their own tool repositories and removed from `docs/article-drafts/`. The one legacy tool-specific `json_intro` message was removed from all 12 host language catalogs. Generic host UI, consent, permissions, legal notices and navigation messages stay in the host.

**All 30 previously unfinished tools already had tool-owned 12-language interface and guide translations** before this continuation. The new editorial work is a separate, richer content layer; do not treat existing metadata localization as proof of reviewed article translations.

## Existing six article PRs (12-language drafts; native review pending)

| Tool | Draft PR |
| --- | --- |
| `json-tools` | [#7](https://github.com/ygrip/json-tools/pull/7) |
| `jwt-tools` | [#5](https://github.com/ygrip/jwt-tools/pull/5) |
| `protobuf-studio` | [#5](https://github.com/ygrip/protobuf-studio/pull/5) |
| `pojo-to-any` | [#7](https://github.com/ygrip/pojo-to-any/pull/7) |
| `csv-tools` | [#4](https://github.com/ygrip/csv-tools/pull/4) |
| `hex-tools` | [#5](https://github.com/ygrip/hex-tools/pull/5) |

These six already contain the Paraglide article pipeline, messages and draft manifests. Their earlier unreviewed host JSON references were also archived as `docs/editorial/unreviewed-host-draft.json` so nothing was silently discarded. **Do not replace verified tool content with an older host draft.** Recheck tests, release artifacts and technical assertions after recent commits; CSV Tools also has a separate export delimiter regression to verify.

## Ten tools with migrated English editorial drafts

| Tool | Draft PR |
| --- | --- |
| `background-remover` | [#4](https://github.com/ygrip/background-remover/pull/4) |
| `cron-planner` | [#3](https://github.com/ygrip/cron-planner/pull/3) |
| `curl-generator` | [#4](https://github.com/ygrip/curl-generator/pull/4) |
| `diff-checker` | [#4](https://github.com/ygrip/diff-checker/pull/4) |
| `har-studio` | [#3](https://github.com/ygrip/har-studio/pull/3) |
| `link-checker` | [#3](https://github.com/ygrip/link-checker/pull/3) |
| `og-metadata-generator` | [#3](https://github.com/ygrip/og-metadata-generator/pull/3) |
| `save-my-wiki` | [#6](https://github.com/ygrip/save-my-wiki/pull/6) |
| `seo-checker` | [#3](https://github.com/ygrip/seo-checker/pull/3) |
| `who-track-me` | [#8](https://github.com/ygrip/who-track-me/pull/8) |

These ten have the original, unreviewed English research draft in **their own repository** at `docs/editorial/english-source.json`. Cron Planner continues its existing article-kit PR #3; SEO Checker continues its export-feature PR #3, so its article claims must match the new feature. The other eight have separate draft editorial-ownership PRs. **This is a source migration, not publication**: the English draft must be fact checked, adapted to the Paraglide article contract, and translated in all 12 locales. Do not merge an incomplete tool PR.

## Twenty tools with 12-locale Paraglide editorial seeds

| Tool | Draft PR |
| --- | --- |
| `ai-music-maker` | [#5](https://github.com/ygrip/ai-music-maker/pull/5) |
| `app-icon-generator` | [#4](https://github.com/ygrip/app-icon-generator/pull/4) |
| `color-mapper` | [#4](https://github.com/ygrip/color-mapper/pull/4) |
| `encoder-decoder` | [#4](https://github.com/ygrip/encoder-decoder/pull/4) |
| `fake-data-generator` | [#4](https://github.com/ygrip/fake-data-generator/pull/4) |
| `fractal-studio` | [#3](https://github.com/ygrip/fractal-studio/pull/3) |
| `gif-maker` | [#4](https://github.com/ygrip/gif-maker/pull/4) |
| `hash-generator` | [#5](https://github.com/ygrip/hash-generator/pull/5) |
| `id-generator` | [#4](https://github.com/ygrip/id-generator/pull/4) |
| `image-compression` | [#3](https://github.com/ygrip/image-compression/pull/3) |
| `image-converter` | [#3](https://github.com/ygrip/image-converter/pull/3) |
| `image-editor` | [#3](https://github.com/ygrip/image-editor/pull/3) |
| `list-tools` | [#4](https://github.com/ygrip/list-tools/pull/4) |
| `markdown-studio` | [#4](https://github.com/ygrip/markdown-studio/pull/4) |
| `pdf-tools` | [#6](https://github.com/ygrip/pdf-tools/pull/6) |
| `qr-bar-coder` | [#5](https://github.com/ygrip/qr-bar-coder/pull/5) |
| `regex-mania` | [#4](https://github.com/ygrip/regex-mania/pull/4) |
| `svg-tools` | [#5](https://github.com/ygrip/svg-tools/pull/5) |
| `text-manipulation` | [#5](https://github.com/ygrip/text-manipulation/pull/5) |
| `time-wizard` | [#3](https://github.com/ygrip/time-wizard/pull/3) |

Each PR contains a tool-owned `project.article.inlang/settings.json`, **12 `messages/article/<locale>.json` starter catalogs** and `docs/editorial/ARTICLE_BRIEF.md`. Strings came from that tool's existing translated metadata and usage guide; these are **seeds**, not a complete, original technical article, verified FAQ, or fresh professional translation. The files are **not wired into build or `tool.manifest.json`**, so no weak editorial draft becomes public because a PR was opened.

## Required completion before merging tool PRs

1. Inspect the current tool source, README, manifest, tests and branch-specific features. Replace guide-derived placeholders with original, specific technical details, boundaries, real worked examples, documented error cases and honest FAQ answers. No invented functions, privacy guarantees, metrics or publication metadata.
2. Finalize the English article in tool-owned `messages/article/en.json`, with precise limits and substantive examples. Use the existing article schema; the host must never become the source of tool content.
3. Translate **all the same semantic keys** into `id ms fil th vi zh my km lo ja hi` with the tool's Paraglide project. Preserve code examples, numbers, technical terms and supported feature semantics. Compare generated output, not only JSON key equality. Fluent/native review remains required; do not label generated or inherited copy as verified.
4. Install/finish the article pipeline from `scripts/article-kit/`: compile messages, append articles to `tool.manifest.json`, validate exact released JSON, and keep the locale packs separate. Do not modify release digests or host registry generated files manually.
5. Run current tool build/unit/artifact tests, its local host integration and browser tests, inspect all 12 languages and release bytes. Resolve failures and publish reviewed source commits. **Only after each tool PR is merged and released**, re-pin the complete SHA through host registry sync; verify actual prere­ndered server HTML, canonical/hreflang, sitemap and ad behavior in host tests.
6. Recheck current AdSense policy, consent and content quality before a final host merge. The host's established locale indexing remains intact throughout this work. No blanket noindex or ad restrictions are implied by editorial status.

## Explicitly outstanding

- The six earlier translated article branches still need editorial/native-language review and independent checks.
- The ten migrated source drafts are **not** installed publication catalogs.
- The twenty new seed PRs are **not** full articles and do not modify release manifests.
- No new tool source release has been merged, pinned or deployed by this continuation; PR #110 should remain WIP.
- CSV Tools export fix remains unverified by CI until its separate Actions failure is investigated.
