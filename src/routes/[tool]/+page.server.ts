import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime.js';
import { tools } from '$lib/server/catalog';
import { catalogToolForLocale } from '$lib/registry/catalog-locale.js';

export const prerender = true;
export const entries = () => tools.map((tool) => ({ tool: tool.id }));

export const load: PageServerLoad = ({ params, url, depends }) => {
  depends(url.href);
  const tool = tools.find((candidate) => candidate.id === params.tool);
  if (!tool) error(404, 'Tool not found');
  const locale = getLocale();
  const related = tools
    .filter((candidate) => candidate.category === tool.category && candidate.id !== tool.id)
    .slice(0, 6)
    .map((candidate) => ({ id: candidate.id, path: candidate.path, name: candidate.translations?.[locale]?.name ?? candidate.name, description: candidate.translations?.[locale]?.description ?? candidate.description }));
  return { tool: catalogToolForLocale(tool, locale), related };
};
