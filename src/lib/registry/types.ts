export type ToolLocale = 'en' | 'id' | 'ms' | 'fil' | 'th' | 'vi' | 'zh' | 'my' | 'km' | 'lo' | 'ja' | 'hi';
export type ToolCategory = 'media' | 'developer' | 'data' | 'productivity' | 'other';
export type ToolIcon = 'braces' | 'toolbox' | 'grid' | 'sparkles' | 'bolt' | 'heart' | 'filter' | 'lock' | 'shield' | 'search';
export type ToolPermissionName = 'clipboard-read' | 'clipboard-write' | 'geolocation' | 'downloads' | 'camera-capture' | 'share-image' | 'external-assets' | 'wasm' | 'workers' | 'services' | 'wiki-read' | 'dns-query';
export type ToolPermission = { name: ToolPermissionName; reason: string; required: boolean };
export type ToolAsset = { id: string; url: string; sha256: string; bytes: number; type: 'wasm' | 'script' | 'worker' | 'data'; defer: boolean };
export type ToolService = { id: string; handler: 'pagespeed-seo' | 'tracker-audit'; rateLimit: { limit: number; periodSeconds: 10 | 60 }; turnstile: boolean };
export type ToolSeo = { title: string; description: string; keywords: string[]; robots: 'index' | 'noindex' };
export type ToolGuide = { summary: string; steps: string[] };
export type ToolArticle = {
  headings: { about: string; features: string; limits: string; faq: string };
  about: string[];
  features: { title: string; body: string }[];
  reference: { title: string; sections: { heading: string; paragraphs: string[]; items?: string[] }[] };
  example: { title: string; paragraphs: string[]; code?: string };
  limits: string[];
  faq: { question: string; answer: string }[];
};
export type ToolTranslation = { name: string; description: string; guide?: ToolGuide; article?: ToolArticle; seo?: ToolSeo; permissionReasons?: Partial<Record<ToolPermissionName, string>> };

export type ToolLocalePack = { sha256: string; bytes: number } & (
  { file: string; url?: never } | { url: string; file?: never }
);

/** Public normalized metadata. Legacy v2 inputs receive safe, nonprivileged defaults. */
export type ToolManifest = {
  schemaVersion: 2 | 3;
  runtimeVersion: 1;
  locales: ToolLocale[];
  appearance: { theme: 'host'; protocolVersion: 1 };
  id: string;
  name: string;
  description: string;
  path: `/${string}`;
  category: ToolCategory;
  repository: string;
  version: string;
  capabilities: string[];
  status: 'stable' | 'beta' | 'experimental';
  icon: ToolIcon;
  seo: ToolSeo;
  guide: ToolGuide;
  /** Tool-owned reader documentation in the canonical language (English). */
  article?: ToolArticle;
  permissions: ToolPermission[];
  assets: ToolAsset[];
  /** Verified, separately downloadable tool-owned translation packs. */
  localePacks?: Partial<Record<ToolLocale, ToolLocalePack>>;
  services: ToolService[];
  translations: Partial<Record<ToolLocale, ToolTranslation>>;
  bundle: { format: 'html'; file: string; sha256: string };
  /** Host registration date (UTC ISO), used for "newest first" sorting. */
  addedAt?: string;
};

export { validateManifest } from './contract.js';
