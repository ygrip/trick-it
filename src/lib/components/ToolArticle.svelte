<script lang="ts">
  import { base } from '$app/paths';
  import type { GuideSummary, ToolArticle } from '$lib/content/types';
  import { safeJsonLd } from '$lib/seo/metadata.js';
  import ContentBlocks from './ContentBlocks.svelte';
  import InlineText from './InlineText.svelte';

  let { article, toolName, guides = [] }: { article: ToolArticle; toolName: string; guides?: GuideSummary[] } = $props();

  // FAQ answers may contain inline `code`/[link](...) markup; structured data gets plain text.
  function plain(text: string): string {
    return text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1').replace(/`([^`]+)`/g, '$1');
  }

  const faqSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((entry) => ({
      '@type': 'Question',
      name: plain(entry.question),
      acceptedAnswer: { '@type': 'Answer', text: plain(entry.answer) }
    }))
  });
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${safeJsonLd(faqSchema)}</script>`}
</svelte:head>

<!-- Editorial content is written in English; translated pages keep it with an explicit language. -->
<article class="tool-article surface" lang="en" aria-labelledby="about-tool">
  <section>
    <h2 id="about-tool">About {toolName}</h2>
    {#each article.about as paragraph, index (index)}<p><InlineText text={paragraph} /></p>{/each}
  </section>

  <section aria-labelledby="key-features">
    <h2 id="key-features">Key features</h2>
    <ul class="feature-list">
      {#each article.features as feature, index (index)}
        <li><strong>{feature.title}</strong><span><InlineText text={feature.body} /></span></li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="technical-reference">
    <h2 id="technical-reference">{article.reference.title}</h2>
    {#each article.reference.sections as section, index (index)}
      <h3>{section.heading}</h3>
      <ContentBlocks blocks={section.blocks} />
    {/each}
  </section>

  <section aria-labelledby="worked-example">
    <h2 id="worked-example">{article.example.title}</h2>
    <ContentBlocks blocks={article.example.blocks} />
  </section>

  <section aria-labelledby="limitations">
    <h2 id="limitations">Limitations and when to use something else</h2>
    <ul>{#each article.limits as limit, index (index)}<li><InlineText text={limit} /></li>{/each}</ul>
  </section>

  <section aria-labelledby="faq">
    <h2 id="faq">Frequently asked questions</h2>
    {#each article.faq as entry, index (index)}
      <details>
        <summary><InlineText text={entry.question} /></summary>
        <p><InlineText text={entry.answer} /></p>
      </details>
    {/each}
  </section>

  {#if guides.length > 0}
    <section aria-labelledby="related-guides">
      <h2 id="related-guides">Related guides</h2>
      <ul>{#each guides as guide (guide.slug)}<li><a href={`${base}/guides/${guide.slug}/`}>{guide.title}</a></li>{/each}</ul>
    </section>
  {/if}

  <p class="article-updated">Last reviewed <time datetime={article.updated}>{article.updated}</time>.</p>
</article>

<style>
  .tool-article { margin-top: 28px; padding: clamp(20px, 4vw, 40px); border-radius: 28px; line-height: 1.7; }
  .tool-article section + section { margin-top: 36px; }
  .tool-article :global(h2) { font-size: clamp(22px, 3vw, 30px); letter-spacing: -.03em; margin: 0 0 14px; }
  .tool-article :global(h3) { font-size: 19px; margin: 24px 0 8px; }
  .tool-article :global(p), .tool-article :global(li) { max-width: 75ch; color: var(--text-secondary, var(--muted)); }
  .feature-list { display: grid; gap: 14px; padding: 0; list-style: none; }
  .feature-list li { display: grid; gap: 4px; }
  .feature-list strong { color: var(--text); }
  details { padding: 12px 0; border-bottom: 1px solid var(--line); }
  summary { cursor: pointer; font-weight: 800; }
  .article-updated { margin-top: 32px; font-size: 14px; }
</style>
