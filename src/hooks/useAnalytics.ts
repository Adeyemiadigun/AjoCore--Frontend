const GTM_ID = import.meta.env.VITE_GTM_ID ?? ''

type EventParams = Record<string, string | number | boolean>

const eventQueue: { name: string; params?: EventParams }[] = []
let gtmLoaded = false

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === 'undefined') return
  if (gtmLoaded && window.dataLayer) {
    window.dataLayer.push({ event: name, ...params })
  } else {
    eventQueue.push({ name, params })
  }
}

export function initGTM() {
  if (!GTM_ID || gtmLoaded) return
  gtmLoaded = true
  eventQueue.forEach(({ name, params }) => trackEvent(name, params))
  eventQueue.length = 0
}

export function trackPageView(path: string) {
  trackEvent('page_view', { page_path: path })
}

export function trackClick(label: string, category?: string) {
  trackEvent('click', { click_label: label, click_category: category ?? 'engagement' })
}

export function trackConversion(label: string, value?: number) {
  trackEvent('conversion', { conversion_label: label, conversion_value: value })
}

declare global {
  interface Window {
    dataLayer?: object[]
  }
}
