type AnalyticsParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (typeof window === 'undefined') return
  if (!measurementId || !window.gtag) return

  window.gtag('event', eventName, params)
}

export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined') return
  if (!measurementId || !window.gtag) return

  window.gtag('config', measurementId, {
    page_path: path,
    page_title: title,
  })
}
