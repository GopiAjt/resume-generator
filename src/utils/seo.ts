const SITE_URL = 'https://www.resumegen.pro'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export type SeoMeta = {
  title: string
  description: string
  keywords?: string
  path?: string
  image?: string
  robots?: string
}

const setMetaByName = (name: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const setMetaByProperty = (property: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const setCanonical = (url: string) => {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.setAttribute('href', url)
}

export const getAbsoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}

export const updateSeoMeta = (meta: SeoMeta) => {
  const canonicalUrl = getAbsoluteUrl(meta.path)
  const imageUrl = meta.image || DEFAULT_IMAGE
  const robots = meta.robots || 'index, follow'

  document.title = meta.title
  setCanonical(canonicalUrl)

  setMetaByName('title', meta.title)
  setMetaByName('description', meta.description)
  if (meta.keywords) {
    setMetaByName('keywords', meta.keywords)
  }
  setMetaByName('robots', robots)

  setMetaByProperty('og:type', 'website')
  setMetaByProperty('og:url', canonicalUrl)
  setMetaByProperty('og:title', meta.title)
  setMetaByProperty('og:description', meta.description)
  setMetaByProperty('og:image', imageUrl)

  setMetaByProperty('twitter:card', 'summary_large_image')
  setMetaByProperty('twitter:url', canonicalUrl)
  setMetaByProperty('twitter:title', meta.title)
  setMetaByProperty('twitter:description', meta.description)
  setMetaByProperty('twitter:image', imageUrl)
}
