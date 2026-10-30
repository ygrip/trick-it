import type { PageServerLoad } from './$types';
import { guideSummaries } from '$lib/server/content';
import { tools } from '$lib/server/catalog';

export const prerender = true;

export const load: PageServerLoad = () => {
  const toolNames = Object.fromEntries(tools.map((tool) => [tool.id, tool.name]));
  return { guides: guideSummaries(), toolNames };
};
