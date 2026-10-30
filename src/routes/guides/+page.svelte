<script lang="ts">
  import { base } from '$app/paths';
  import Seo from '$lib/components/Seo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import { localizedPath } from '$lib/i18n';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const description = 'In-depth guides on JWTs, cron schedules, image formats, HAR debugging, encoding and regular expressions, with worked examples using trick-it tools.';
</script>

<Seo title="Developer guides" {description} path="/guides/" />

<main id="main-content" class="page-shell guides-shell" lang="en">
  <a class="guides-back" href={localizedPath('/')}>← trick-it</a>
  <header class="guides-hero">
    <p class="eyebrow">trick-it guides</p>
    <h1>Developer guides</h1>
    <p>Each guide explains a topic from first principles: how the format or standard works, the mistakes that cause real bugs, and how to check your own data. Where a trick-it tool helps, the guide shows exactly which feature to use and what it does not cover.</p>
  </header>
  <ul class="guide-list">
    {#each data.guides as guide (guide.slug)}
      <li class="surface">
        <a href={`${base}/guides/${guide.slug}/`}><h2>{guide.title}</h2></a>
        <p>{guide.description}</p>
        <p class="guide-meta">
          Updated <time datetime={guide.updated}>{guide.updated}</time>
          {#if guide.tools.length > 0}· Tools: {guide.tools.map((id) => data.toolNames[id] ?? id).join(', ')}{/if}
        </p>
      </li>
    {/each}
  </ul>
  <SiteFooter />
</main>

<style>
  .guides-back { display: inline-flex; min-height: 44px; align-items: center; font-weight: 800; }
  .guides-hero { padding: 24px 0 32px; max-width: 70ch; }
  .guides-hero h1 { font-size: clamp(32px, 5vw, 52px); letter-spacing: -.05em; margin: 8px 0; }
  .guides-hero p:last-child { color: var(--muted); line-height: 1.7; }
  .guide-list { display: grid; gap: 16px; padding: 0; list-style: none; }
  .guide-list li { padding: 22px; border-radius: 24px; }
  .guide-list h2 { margin: 0 0 8px; font-size: 22px; }
  .guide-list p { margin: 0; color: var(--muted); line-height: 1.6; }
  .guide-list .guide-meta { margin-top: 10px; font-size: 14px; }
</style>
