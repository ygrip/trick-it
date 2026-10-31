# Tool article work: continuation handoff

## Status

This is unfinished, unreviewed work. Do not merge or deploy the host changes until the releases, translations, and integrations are reviewed and verified. The previously proposed article-gated indexing/ad restriction has been removed; all existing locale routes remain available. Each tool owns its article and its Paraglide catalogs; the host must consume pinned releases rather than host-authored drafts.

- Host branch `feat/tool-articles-adsense`: article contract, renderer, validation, article installation kit, and unchanged broad locale indexing. See `docs/tool-article-guide.md` and `docs/adsense-continuation.md`. Tool editorial readiness is tracked independently of search and ad eligibility. Existing pages in all 12 locales remain indexable in production.
- Six tools have pushed `feat/tool-article-paraglide` branches with 12 locale files: `json-tools` (`19fdd68`), `jwt-tools` (`a8a178f`), `protobuf-studio` (`df811d6`), `pojo-to-any` (`800886e`), `csv-tools` (`2a59eb1`), and `hex-tools` (`e1e69dc`). Agent-reported build/test passes for the last three; independently verify all current heads and editorial claims. None of the translations is native-reviewed.
- `cron-planner` branch `feat/tool-article-paraglide` contains only the installed article pipeline. No article catalogs are present; its build and tests are expected to need completion. It is not ready to merge.
- `seo-checker` branch `feat/assessment-export`, PR #3, contains the separate JSON/XML assessment download. Its latest reported checks: 33 unit and 19 browser tests passed before this handoff; rerun after further changes. It still needs its own 12-language article, based on the export feature after coordinating the branches.
- Atlas work is tracked separately in `ygrip/atlas-nusantara` PR #17 and its own `docs/EDITORIAL_CONTINUATION.md`.

## Tool pull requests

- [JSON Tools #7](https://github.com/ygrip/json-tools/pull/7), [JWT Tools #5](https://github.com/ygrip/jwt-tools/pull/5), [Protobuf Studio #5](https://github.com/ygrip/protobuf-studio/pull/5)
- [POJO to Any #7](https://github.com/ygrip/pojo-to-any/pull/7), [CSV Tools #4](https://github.com/ygrip/csv-tools/pull/4), [Hex Tools #5](https://github.com/ygrip/hex-tools/pull/5)
- [Cron Planner #3](https://github.com/ygrip/cron-planner/pull/3) (scaffolding only), [SEO Checker #3](https://github.com/ygrip/seo-checker/pull/3) (assessment export, article still needed)

These are open WIP PRs, not GitHub drafts; the connector cannot convert them to draft. Do not merge without completing the reviews and checks above.

## Next actions

1. Review the six tool PRs and their source-backed claims, generated manifest diffs, exact release bytes and per-locale output. Validate examples and privacy statements against the actual tool, not another draft. Arrange native review; do not label translations verified merely because keys match.
2. Complete `cron-planner` and the other 29 catalog tools without completed article branches: `ai-music-maker`, `app-icon-generator`, `background-remover`, `color-mapper`, `curl-generator`, `diff-checker`, `encoder-decoder`, `fake-data-generator`, `fractal-studio`, `gif-maker`, `har-studio`, `hash-generator`, `id-generator`, `image-compression`, `image-converter`, `image-editor`, `link-checker`, `list-tools`, `markdown-studio`, `og-metadata-generator`, `pdf-tools`, `qr-bar-coder`, `regex-mania`, `save-my-wiki`, `seo-checker`, `svg-tools`, `text-manipulation`, `time-wizard`, and `who-track-me`. Confirm the current catalog before beginning; the six completed plus these 30 total 36.
3. In each tool repository use the existing Paraglide article kit, write accurate content for all 12 languages, run the tool's build and tests, and open a separate PR. Keep generated release artifacts needed by that repository's release contract. The kit currently disallows literal braces in messages; evaluate this limitation instead of silently omitting useful examples.
4. CSV export follow-up: [CSV Tools #4](https://github.com/ygrip/csv-tools/pull/4) now normalizes a blank output delimiter to comma, with a focused JSON-to-CSV/query roundtrip regression test. Input parsing still uses blank for auto-detection. The original failure report remains unconfirmed and the new regression has **not** passed CI: the CSV repository's Actions job fails before showing test steps. Verify locally or restore its CI runner before treating this as finished.
5. Finish the host's guides and comparison hub if still desired. Validate locale fallback and language labels, accessibility, XML/HTML escaping, catalog size, integrity checks, sitemap/canonical/hreflang, ad and consent behavior, client-side navigation after a provider loads, and full prerendered pages. Tests must cover legacy tools and all translated release paths. Do not gate quality on word count or assume translated pages are low value.
6. After reviewed tool changes land, update host registry pins via its verified release workflow, build with the real pinned catalog, run tests and browser checks, review the full diffs and CI, then deploy only when approved. Verify the actual site after deployment. No AdSense approval is guaranteed.
