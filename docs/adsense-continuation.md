# Continuation: useful, indexable tool pages

## Status: unfinished; do not deploy this branch

The goal is to make `tools.readynaz.com` useful, indexable, and eligible for AdSense. **The user requires each tool's guidelines and content to live in that tool's own repository**, not the host repository, and to cover all 12 supported languages using Paraglide JS. Site-wide guides and a comparison hub may live in the host repository. This branch contains **unreviewed work in progress**, not a deployable solution. Do not claim any change guarantees approval.

## Important corrections

- Google does not prescribe a minimum word count, FAQ schema, a particular number of articles, or a mandatory wait after sitemap submission. Usefulness, originality, policy compliance, and experience matter more than length. Do not pad text or block a release merely to meet an arbitrary word target.
- Translated pages are not automatically duplicate or low-value content. A useful tool can be valuable with little prose. The earlier English-only indexing and ad restrictions have been removed from this WIP branch. Review actual localized page quality before making any targeted future indexing decisions; broad deindexing requires user agreement.
- A successful sitemap status means Google read the sitemap; it does not mean its URLs are indexed or that AdSense reviewed them. AdSense may assess pages beyond a sitemap. Do not infer the reason for a rejection or compare sites' approval criteria from public HTML alone.
- Preserve factual authorship and dates; do not assert a person wrote, reviewed, or published material without evidence. Check privacy and data-processing claims against the implementation. Changing consent or metadata alone does not fix content quality.

## Resume in this order

1. **Inspect this branch and repository instructions.** Read `docs/editorial-content.md` as a proposed data format, not an authoritative Google requirement. Compare this branch with current upstream `main`. Check the current site and official Google guidance. Inventory all changes, including untracked files, and preserve unrelated work.
2. **Audit and relocate the partial implementation.** The branch has a proposed host-owned schema, rendering components, SEO and ad-policy changes, and 16 draft articles. These host-owned article drafts are provisional and do not satisfy the user's revised ownership requirement. Move or rework each tool's content and guidelines into its own `ygrip/<tool>` repository after checking its existing contract and source in `../trick-it-tools/<id>/`. Adapt the host registry, release pins, locale packs, and rendering to consume verified tool-owned content; do not manually edit generated registry files. Drafts passed only structural validation, not editorial review. Identify missing tools from `src/lib/registry/generated.json`. Do not invent features, privacy guarantees, examples, benchmarks, review dates, or author attribution.
3. **Finish and localize tool content.** In each tool repository, maintain the tool's guidelines and substantive content, with accurate examples, verified inputs and outputs, errors, limitations, and source links. Use each project's Paraglide JS setup and existing verified locale-pack/release workflow to provide all 12 supported languages: English, Indonesian, Malay, Filipino, Thai, Vietnamese, Chinese, Burmese, Khmer, Lao, Japanese, and Hindi. Review translation quality and technical terms; do not claim unreviewed machine translations are verified. Publish and pin tool releases through the existing workflow, then confirm the host renders each locale's content in server HTML. Add host-wide guides and a comparison hub where supported. FAQ structured data is optional and must match visible content; validate links and escape content safely. Remove arbitrary word-count gates and unsupported publication metadata.
4. **Review indexing and advertising deliberately.** Check canonical and `hreflang` consistency, localized routes, sitemap coverage, ad placement, navigation, and applicable consent requirements. Keep useful translations indexable unless there is an evidence-based reason and user approval to change that. Follow Google's ad-placement policies and do not promise that a route guard controls all third-party ad behavior. Test with mocked provider scripts; do not generate invalid live ad traffic.
5. **Verify and publish.** Run relevant tests, type checks, production build and SEO validators; check generated HTML, sitemap, robots directives, accessibility and mobile navigation. Record exact results. Review the complete diff and CI. Deploy only after user review and verify public artifacts. Request AdSense review when the substantive work is ready; approval is Google's decision.

## Known unfinished engineering issues

- `src/app.css` was added as a standalone draft, while the existing stylesheet is `src/routes/app.css`; integrate styles deliberately and verify they are loaded.
- Schemas and validation currently impose arbitrary minimum word counts. Replace them with structural and factual review.
- Article dates and guide author metadata need evidence. No guides have yet been written. Do not ship placeholders or assume generated JSON represents human review.
- The former article-gated tool indexing and advertising restriction was removed. All 12 tool locale routes remain in the sitemap. Confirm canonical URLs, `hreflang`, sitemap, translated tool interfaces, and ad behavior on built pages; publishing articles is a separate quality task.
- Earlier local checks passed before later edits; they do not validate the current branch. Run fresh checks after implementation.

Keep this PR marked WIP until implementation and verification are complete. Never include credentials, personal tax identifiers, temporary assets, or unrelated files.
