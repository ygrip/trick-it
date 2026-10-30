import type { Guide, GuideSummary, ToolArticle } from '$lib/content/types';

// Build-time only: editorial JSON is validated by scripts/validate-content.mjs
// before the build and prerendered into static HTML.
const articleModules = import.meta.glob<ToolArticle>('/content/tools/*.json', { eager: true, import: 'default' });
const guideModules = import.meta.glob<Guide>('/content/guides/*.json', { eager: true, import: 'default' });

const articles = new Map(Object.values(articleModules).map((article) => [article.id, article]));

export const guides: Guide[] = Object.values(guideModules).sort((left, right) => right.published.localeCompare(left.published) || left.title.localeCompare(right.title));

export function articleForTool(id: string): ToolArticle | undefined {
  return articles.get(id);
}

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guideSummaries(): GuideSummary[] {
  return guides.map(({ slug, title, description, published, updated, tools }) => ({ slug, title, description, published, updated, tools }));
}

export function guidesForTool(id: string): GuideSummary[] {
  return guideSummaries().filter((guide) => guide.tools.includes(id));
}
