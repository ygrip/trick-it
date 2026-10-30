# Continuation: useful, indexable tools and atlas pages

## Status: unfinished; do not deploy this branch

The goal is to make both `tools.readynaz.com` (this repository) and `nusantara.readynaz.com` (`ygrip/nusantara`) useful, indexable, and eligible for AdSense. The user wants host-owned tool content and, for the atlas, guides, an about page, key features, a technical reference, and FAQs. Do not claim any change guarantees approval.

This branch contains **unreviewed work in progress**, not a deployable solution. The companion branch `feat/editorial-content-adsense` in `ygrip/nusantara` contains incomplete work; it is not a PR and must be independently reviewed and completed. Neither branch is production-verified. Preserve existing work and any unrelated local changes when resuming.

## Important corrections

- Google does not prescribe a minimum word count, FAQ schema, a particular number of articles, or a mandatory wait after sitemap submission. Usefulness, originality, policy compliance, and experience matter more than length. Do not pad text or block a release merely to meet an arbitrary word target.
- Translated pages are not automatically duplicate or low-value content. A useful tool can be valuable with little prose. The earlier advice to noindex all translations and to assume all 519 subdomain URLs were thin was unsupported. The work-in-progress English-only indexing and ad restrictions are **not a settled decision**: review actual locale quality and Google documentation, then agree any broad deindexing with the user before deploying it.
- A successful sitemap status means Google read the sitemap; it does not mean its URLs are indexed or that AdSense reviewed them. AdSense may assess pages beyond a sitemap. Do not infer the reason for a rejection or compare sites' approval criteria from public HTML alone.
- Preserve the user's factual authorship and dates; do not assert a person wrote, reviewed, or published material without evidence. Review privacy and data-processing claims against the actual implementation. Avoid suggesting that changing consent or metadata alone fixes content quality.

## Resume in this order

1. **Inspect both branches and repository instructions.** Read `docs/editorial-content.md` as a proposed data format, not as an authoritative Google requirement. Compare both branches with their current upstream `main` branches. Check the current site and official Google guidance again. Inventory all existing changes, including untracked files, and do not overwrite unrelated work.
2. **Audit the partial tool implementation.** This branch has a proposed article JSON schema, rendering components, six-guide scaffolding, SEO and ad-policy changes, and 16 draft tool articles. Validate their claims against the pinned tools in `../trick-it-tools/<id>/` and the actual host/service contracts. The drafts have passed only the local structural validator, not editorial review. Identify missing catalog tools from `src/lib/registry/generated.json`. Do not invent features, privacy guarantees, examples, benchmarks, review dates, or author attribution.
3. **Finish useful tool content and guides.** Supply accurate examples, real inputs and outputs where verified, error cases, limitations, and source links. Link to related tools where useful. Build a guides index and a comparison hub if supported by the content. Render accessible, meaningful server HTML. FAQ structured data is optional and must exactly reflect visible content; it is not an approval mechanism. Validate all internal links and escape content safely. Reassess and remove hard-coded minimum-word gates and unsupported publication metadata.
4. **Complete Atlas Nusantara separately.** Use its `README.md`, `docs/DATA_SOURCES.md`, `docs/GEOMETRY.md`, `docs/SPECIES.md`, `docs/CUISINE.md`, `docs/DESTINATIONS.md`, and implementation as sources. Add a source-backed about page, features, technical reference, FAQ, and guides covering real layers and their limitations. Weather and hazard snapshots are not emergency alerts or necessarily live; data editions and coverage differ. Test each claim and link. The companion branch currently has page scaffolding but no completed editorial data, sitemap integration, or verified build.
5. **Review indexing and advertising deliberately.** Check canonical and `hreflang` consistency, localized routes, sitemap coverage, ad placement, navigation, and applicable consent requirements. Keep useful translated pages indexable unless there is an evidence-based reason and user approval to change that. Ensure no ads on non-content pages where prohibited and do not promise that a route guard controls every third-party ad behavior. Test in a browser with mocked provider scripts; do not generate invalid live ad traffic.
6. **Verify and publish separately.** Run each repository's relevant tests, type checks, production builds and SEO validators; test generated HTML, sitemap, noindex/canonical/hreflang, accessibility and mobile navigation. Record exact command results. Review full diffs, check CI, and open a separate PR for the atlas. Deploy only after user review and verify the public artifacts. Request AdSense review when the user considers the substantive work ready; approval is Google's decision.

## Known unfinished engineering issues

- `src/app.css` was added as a standalone draft, while the existing stylesheet is `src/routes/app.css`; move or integrate its styles deliberately and verify they are actually loaded.
- Article and guide schemas and validation currently impose arbitrary minimum word counts. Replace those with structural and factual review; do not equate length with value.
- Article dates and guide author metadata need evidence. No guides have yet been written. Do not ship placeholders or assume generated JSON represents human review.
- `INDEXED_LOCALES` currently restricts indexing and ad placements to English. This was an unverified proposed approach, not a policy requirement or a confirmed user decision. Reassess it and update tests and docs consistently.
- The atlas draft imports an absent `content/about.json`, uses provisional English-only pages, and does not yet add those routes to its static sitemap or reconcile metadata. Its data and route scaffolding must be reviewed before use.
- Previous local checks reported 319 tests passing before later edits and `svelte-check` zero errors before completion. These results do not validate the current partial branches. Run fresh checks after implementation.

## Pull request expectations

Keep this PR draft until the tool work is complete and independently verified. Open a separate draft or reviewable PR for `ygrip/nusantara` using the `github-ygrip` Punakawan connector. Describe exact evidence, unresolved editorial review, and deployment dependencies. Never include credentials, personal tax identifiers, temporary assets, or unreviewed unrelated files.
