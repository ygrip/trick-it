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

These ten now contain both the untouched original English research draft in `docs/editorial/english-source.json` and an **unreviewed adaptation** in tool-owned `messages/article/en.json`, with `project.article.inlang/settings.json`. Table rows were linearized to text items and any code blocks remain in the original source pending careful MessageFormat-safe handling. Cron Planner continues its existing article-kit PR #3; SEO Checker continues its export-feature PR #3. **These are not released or verified translations.** Fact-check each claim against current tool code, add the other eleven actual article translations, finish the release pipeline, and run tool/browser tests before merging.

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

## Follow-up edits — 31 October 2026 (six advanced article PRs)

Source-level correctness and article-example regression work was committed on each independent tool branch, without merging, releasing or repinning any tool:

| Tool PR | Commit | Source check / correction |
| --- | --- | --- |
| [JSON Tools #7](https://github.com/ygrip/json-tools/pull/7) | [`2957efd`](https://github.com/ygrip/json-tools/commit/2957efd1a9dc7ba696683208efc59c5ba12e529b) | Correct singleton-item JSONPath claim in all 12 article catalogs plus manifest; test array vs object selectors |
| [JWT Trust Lab #5](https://github.com/ygrip/jwt-tools/pull/5) | [`c4ab117`](https://github.com/ygrip/jwt-tools/commit/c4ab117daa3f56229e7b3aaa4bfd7b545f270b93) | Remove unsupported near-universal HTTP 401 claim in all 12 article catalogs and manifest |
| [Protobuf Studio #5](https://github.com/ygrip/protobuf-studio/pull/5) | [`e7b8bb1`](https://github.com/ygrip/protobuf-studio/commit/e7b8bb17febd0d8a2d3586bc93b935b41848b47f) | Add a regression test for the 14-byte `Person` wire-format worked example |
| [POJO to Any #7](https://github.com/ygrip/pojo-to-any/pull/7) | [`ba7fa51`](https://github.com/ygrip/pojo-to-any/commit/ba7fa51e00f81cd6dac3f95f93c954f69d31e384) | Add a Kotlin model/optional-field source example test |
| [CSV Studio #4](https://github.com/ygrip/csv-tools/pull/4) | [`00055e1`](https://github.com/ygrip/csv-tools/commit/00055e1fd1c3ae3c250ba5e381b3a41ee14154a8) | Add semicolon-delimited RFC 9535 query/export example regression |
| [Hex Studio #5](https://github.com/ygrip/hex-tools/pull/5) | [`9bf7cb7`](https://github.com/ygrip/hex-tools/commit/9bf7cb77f9a54662124bfe54be73af38fb9312db) | Add Playwright check for PNG header and byte inspector example |

**Verification:** These commits were pushed, not locally executed or green-lit. The latest linked Actions runs for all six failed with zero job steps and no runner assigned. Treat these as unverified code until a runner actually executes and succeeds. None of the six has fluent/native review sign-off or is ready for release; all remain draft. Host PR #110 remains draft.

## Required completion before merging tool PRs

1. Inspect the current tool source, README, manifest, tests and branch-specific features. Replace guide-derived placeholders with original, specific technical details, boundaries, real worked examples, documented error cases and honest FAQ answers. No invented functions, privacy guarantees, metrics or publication metadata.
2. Finalize the English article in tool-owned `messages/article/en.json`, with precise limits and substantive examples. Use the existing article schema; the host must never become the source of tool content.
3. Translate **all the same semantic keys** into `id ms fil th vi zh my km lo ja hi` with the tool's Paraglide project. Preserve code examples, numbers, technical terms and supported feature semantics. Compare generated output, not only JSON key equality. Fluent/native review remains required; do not label generated or inherited copy as verified.
4. Install/finish the article pipeline from `scripts/article-kit/`: compile messages, append articles to `tool.manifest.json`, validate exact released JSON, and keep the locale packs separate. Do not modify release digests or host registry generated files manually.
5. Run current tool build/unit/artifact tests, its local host integration and browser tests, inspect all 12 languages and release bytes. Resolve failures and publish reviewed source commits. **Only after each tool PR is merged and released**, re-pin the complete SHA through host registry sync; verify actual prerendered server HTML, canonical/hreflang, sitemap and ad behavior in host tests.
6. Recheck current AdSense policy, consent and content quality before a final host merge. The host's established locale indexing remains intact throughout this work. No blanket noindex or ad restrictions are implied by editorial status.

## Explicitly outstanding

- The six earlier translated article branches still need editorial/native-language review and independent checks.
- The ten migrated English drafts have **unreviewed Paraglide English article catalogs**, but the 11 other locales and publication integration are unfinished.
- The twenty new seed PRs are **not** full articles and do not modify release manifests.
- No new tool source release has been merged, pinned or deployed by this continuation; PR #110 should remain WIP.
- CSV Tools export fix remains unverified by CI until its separate Actions failure is investigated.
- The latest host CI on commit `63e5ecc9` **passed** registry verification, unit checks, production builds, browser and mobile checks ([run 41175623438](https://github.com/ygrip/trick-it/actions/runs/41175623438)); deployment was skipped. Earlier private-tool HTTP 403 failures were observed on prior runs but are not a current host CI failure. Preserve source SHA and bundle digest checks.
- The six advanced tool PRs all retriggered Actions after 31 October content/test updates but each latest run **failed before scheduling any step** (`steps: []`, no runner assigned). This is a CI infrastructure/runner or account configuration blocker, not evidence that a test executed and failed; inspect each Actions run UI and resolve before release. Native/fluent editorial review and browser verification are also pending.
