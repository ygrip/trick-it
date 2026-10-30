<script lang="ts">
  import type { ToolArticle } from '$lib/registry/types';
  import { faqStructuredData } from '$lib/registry/article.js';
  import { safeJsonLd } from '$lib/seo/metadata.js';
  import { localizedPath } from '$lib/i18n';

  type Related = { id: string; path: string; name: string; description: string };
  let { article, language, related = [] }: { article: ToolArticle; language: string; related?: Related[] } = $props();
  const faqSchema = $derived(faqStructuredData(article));
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${safeJsonLd(faqSchema)}</script>`}
</svelte:head>

<!-- The article is written and released by the tool; `lang` states the language it is actually in. -->
<article class="tool-article surface" lang={language} aria-labelledby="about-tool">
  <section>
    <h2 id="about-tool">{article.headings.about}</h2>
    {#each article.about as paragraph, index (index)}<p>{paragraph}</p>{/each}
  </section>

  <section aria-labelledby="key-features">
    <h2 id="key-features">{article.headings.features}</h2>
    <ul class="feature-list">
      {#each article.features as feature, index (index)}
        <li><strong>{feature.title}</strong><span>{feature.body}</span></li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="technical-reference">
    <h2 id="technical-reference">{article.reference.title}</h2>
    {#each article.reference.sections as section, index (index)}
      <h3>{section.heading}</h3>
      {#each section.paragraphs as paragraph, paragraphIndex (paragraphIndex)}<p>{paragraph}</p>{/each}
      {#if section.items}<ul>{#each section.items as item, itemIndex (itemIndex)}<li>{item}</li>{/each}</ul>{/if}
    {/each}
  </section>

  <section aria-labelledby="worked-example">
    <h2 id="worked-example">{article.example.title}</h2>
    {#each article.example.paragraphs as paragraph, index (index)}<p>{paragraph}</p>{/each}
    {#if article.example.code}<pre class="article-code"><code>{article.example.code}</code></pre>{/if}
  </section>

  <section aria-labelledby="limitations">
    <h2 id="limitations">{article.headings.limits}</h2>
    <ul>{#each article.limits as limit, index (index)}<li>{limit}</li>{/each}</ul>
  </section>

  <section aria-labelledby="faq">
    <h2 id="faq">{article.headings.faq}</h2>
    {#each article.faq as entry, index (index)}
      <details><summary>{entry.question}</summary><p>{entry.answer}</p></details>
    {/each}
  </section>
</article>

{#if related.length > 0}
  <nav class="related-tools surface" aria-label="trick-it">
    <ul>
      {#each related as tool (tool.id)}
        <li><a href={localizedPath(`${tool.path}/`)}><strong>{tool.name}</strong><span>{tool.description}</span></a></li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .tool-article { margin-top: 28px; padding: clamp(20px, 4vw, 40px); border-radius: 28px; line-height: 1.7; }
  .tool-article section + section { margin-top: 36px; }
  .tool-article h2 { font-size: clamp(22px, 3vw, 30px); letter-spacing: -.03em; margin: 0 0 14px; }
  .tool-article h3 { font-size: 19px; margin: 24px 0 8px; }
  .tool-article p, .tool-article li { max-width: 75ch; color: var(--text-secondary, var(--muted)); overflow-wrap: anywhere; }
  .feature-list { display: grid; gap: 14px; padding: 0; list-style: none; }
  .feature-list li { display: grid; gap: 4px; }
  .feature-list strong { color: var(--text); }
  .article-code { overflow-x: auto; padding: 16px; border-radius: 16px; background: var(--surface-strong, rgba(127, 127, 127, .12)); line-height: 1.5; }
  .article-code code { white-space: pre; }
  details { padding: 12px 0; border-bottom: 1px solid var(--line); }
  summary { cursor: pointer; font-weight: 800; }
  .related-tools { margin-top: 20px; padding: 20px; border-radius: 24px; }
  .related-tools ul { display: grid; gap: 12px; padding: 0; margin: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .related-tools a { display: grid; gap: 2px; }
  .related-tools span { color: var(--muted); font-size: 14px; }
</style>
