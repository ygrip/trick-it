import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { guideBySlug, guides } from '$lib/server/content';
import { tools } from '$lib/server/catalog';

export const prerender = true;
export const entries = () => guides.map((guide) => ({ slug: guide.slug }));

export const load: PageServerLoad = ({ params }) => {
  const guide = guideBySlug(params.slug);
  if (!guide) error(404, 'Guide not found');
  const relatedTools = guide.tools.flatMap((id) => {
    const tool = tools.find((candidate) => candidate.id === id);
    if (!tool) return [];
    return [{ id: tool.id, name: tool.name, description: tool.description, path: tool.path }];
  });
  return { guide, relatedTools };
};
