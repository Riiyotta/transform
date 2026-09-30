// CMS data loader for the blog and case-study templates (specs/blog.md §7, specs/case-studies.md §7).
// The content JSON in /content is the extracted live CMS data; text is exact and must not be
// edited here (source typos such as "Transorm9" and "teamhas" are intentional).
// Image URLs in the JSON point at the live CDN; `localAsset` maps them onto the local copies in
// public/assets (sanitized names: decoded basename, lowercased, runs of non [a-z0-9.] -> '-').

const blogFiles = import.meta.glob('../../content/blog/*.json', { eager: true, import: 'default' })
const caseFiles = import.meta.glob('../../content/case-studies/*.json', { eager: true, import: 'default' })

export function localAsset(url) {
  if (!url) return null
  const base = decodeURIComponent(url.split('/').pop())
  return `/assets/${base.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`
}

// Webflow responsive variant: `<name>-p-500.<ext>` next to the original.
export function localAssetVariant(url, suffix) {
  const local = localAsset(url)
  return local && local.replace(/(\.[a-z0-9]+)$/, `${suffix}$1`)
}

function split(files) {
  let index = null
  const bySlug = {}
  for (const [path, data] of Object.entries(files)) {
    const name = path.split('/').pop().replace(/\.json$/, '')
    if (name === '_index') index = data
    else bySlug[name] = data
  }
  return { index, bySlug }
}

const blog = split(blogFiles)
const cases = split(caseFiles)

// Blog index: featured post, page-1 list (4) and the page-2 list appended by Load More (4).
export const blogIndex = {
  meta: blog.index.page1.meta,
  heroHeading: blog.index.page1.heroHeading,
  featured: blog.index.page1.featured[0],
  listHeading: blog.index.page1.listHeading,
  leftLabel: blog.index.page1.leftLabel,
  description: blog.index.page1.pagination.find((p) => p.cls.includes('blogs-descr')).text,
  loadMore: blog.index.page1.pagination.find((p) => p.cls.includes('load-more')),
  page1: blog.index.page1.list,
  page2: blog.index.page2.list,
}

export const caseStudiesIndex = {
  meta: cases.index.meta,
  heroHeading: cases.index.heroHeading,
  leftLabel: cases.index.leftLabel,
  list: cases.index.list,
}

// Detail lookups. Unknown slug -> null (the page renders nothing page-specific).
export const getPost = (slug) => blog.bySlug[slug] ?? null
export const getCaseStudy = (slug) => cases.bySlug[slug] ?? null
export const postSlugs = Object.keys(blog.bySlug)
export const caseStudySlugs = Object.keys(cases.bySlug)

// Group body blocks into their rich-text slots, in slot order, visible slots only
// (empty slots carry w-condition-invisible on live and are not rendered).
export function bodySlots(entry) {
  return entry.slots
    .filter((s) => s.visible)
    .map((s) => ({ slot: s.slot, blocks: entry.body.filter((b) => b.slot === s.slot) }))
}

// Template icons (specs/blog.md §8). Already in public/assets from the homepage set.
export const CMS_ICONS = {
  backArrow: localAsset('https://cdn.prod.website-files.com/684a82e3294991569082d379/68af375b6ed817d8303e6d01_arrow-white-left.svg'),
  cardArrow: localAsset('https://cdn.prod.website-files.com/684a82e3294991569082d379/687f9e315c0a9b7f071b0a0c_arrow.svg'),
}
