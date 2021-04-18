declare global {
  interface WindowInterface  {
    localStorage: | WarpStorage | Storage;
    sessionStorage: | WarpStorage | Storage;
  }
}

export type storageType = 'local' | 'session'

export type fallbackType = 'object' | 'cookie'

export type timingValue = 'start' | 'response' | 'end'

export type timingMeasure = 'total' | 'response' | 'render'

export interface WarpDriveOptions {
  linkMethod: 'exclude' | 'include',
  excludeLinks: Array<string>,
  includeLinks: Array<string>,
  redirectErrors: boolean
  performanceTimings: boolean,
  cache: WarpHttpOptions
}

export interface WarpHttpOptions extends WarpCacheOptions{
  enable?: boolean,
}

export interface WarpCacheOptions {
  storage: storageType,
  fallback: fallbackType,
}

export interface WarpStorage {
  _data?: unknown,
  _save?: unknown,
  setItem: (id: string, val: string) => void,
  getItem: (id: string) => string,
  removeItem: (id: string) => void,
  clear: () => void
}

export interface WarpLinksOptions {
  linkMethod: 'exclude' | 'include',
  excludeLinks: Array<string>,
  includeLinks: Array<string>,
  frame: string | false,
  redirectErrors: boolean
}

export interface WarpRenderEvent {
  page: string,
  target: string,
  timing: WarpRenderTiming,
  cachedResponse: boolean
}

export interface WarpRenderTiming {
  total: number | string,
  response: number | string,
  render: number | string
}

