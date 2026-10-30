<script lang="ts">
  import { base } from '$app/paths';
  import Seo from '$lib/components/Seo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import AdSlot from '$lib/components/AdSlot.svelte';
  import ContentBlocks from '$lib/components/ContentBlocks.svelte';
  import InlineText from '$lib/components/InlineText.svelte';
  import config from '$lib/seo/generated.json';
  import { safeJsonLd } from '$lib/seo/metadata.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const guide = $derived(data.guide);
  const canonical = $derived(config.origin ? `${config.origin}${config.base}/guides/${guide.slug}/` : '');
  const articleSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: 'en',
    ...(canonical ? { url: canonical, mainEntityOfPage: canonical } : {}),
    author: { '@type': 'Person', name: 'Yunaz Gilang Ramadhan', url: 'https://readynaz.com/about/' },
    publisher: { '@type': 'Organization', name: 'trick-it' }
  });
</script>

<Seo title={guide.title} description={guide.description} path={`/guides/${guide.slug}/`} />
<svelte:head>
  {@html `<script type="application/ld+json">${safeJsonLd(articleSchema)}</script>`}
</svelte:head>

<main id="main-content" class="page-shell guide-shell" lang="en">
  <nav class="guide-crumbs" aria-label="Breadcrumb"><a href={`${base}/`}>trick-it</a> / <a href={`${base}/guides/`}>Guides</a></nav>
  <article class="guide surface">
    <header>
      <h1>{guide.title}</h1>
      <p class="guide-meta">By Yunaz Gilang Ramadhan · Published <time datetime={guide.published}>{guide.published}</time> · Updated <time datetime={guide.updated}>{guide.updated}</time></p>
      {#each guide.intro as paragraph, index (index)}<p class="guide-lede"><InlineText text={paragraph} /></p>{/each}
    </header>
    {#each guide.sections as section, index (index)}
      <section>
        <h2>{section.heading}</h2>
        <ContentBlocks blocks={section.blocks} />
      </section>
    {/each}
    {#if data.relatedTools.length > 0}
      <aside class="guide-tools" aria-labelledby="guide-tools-title">
        <h2 id="guide-tools-title">Tools used in this guide</h2>
        <ul>
          {#each data.relatedTools as tool (tool.id)}
            <li><a href={`${base}${tool.path}/`}>{tool.name}</a> — {tool.description}</li>
          {/each}
        </ul>
      </aside>
    {/if}
  </article>
  <AdSlot placement="tool" />
  <SiteFooter />
</main>

<style>
  .guide-crumbs { padding: 16px 0; font-weight: 700; color: var(--muted); }
  .guide { padding: clamp(20px, 5vw, 48px); border-radius: 28px; line-height: 1.75; }
  .guide h1 { font-size: clamp(30px, 5vw, 48px); letter-spacing: -.04em; line-height: 1.15; margin: 0 0 12px; }
  .guide-meta { font-size: 14px; color: var(--muted); }
  .guide-lede { font-size: 18px; }
  .guide section { margin-top: 36px; }
  .guide :global(h2) { font-size: clamp(22px, 3vw, 30px); letter-spacing: -.03em; margin: 0 0 12px; }
  .guide :global(p), .guide :global(li) { max-width: 75ch; }
  .guide-tools { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--line); }
</style>
