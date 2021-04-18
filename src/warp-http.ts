import {WarpCache} from "./warp-cache";
import type {WarpHttpOptions} from "./types";

export class WarpHttp {

  cachedResponse: boolean
  parser: DOMParser
  options: WarpHttpOptions
  cache: WarpCache

  constructor(options: WarpHttpOptions) {
    this.parser = new DOMParser();
    this.options = options
    this.cache = new WarpCache({ storage: this.options.storage, fallback: this.options.fallback})
  }

  async get(url: string): Promise<Document> {
    const cached = this.cache.get(url)
    if (this.options.enable && cached) {
      this.cachedResponse = true
      this.updateHistory(url)
      return this.toDocument(cached)
    }
    else {
      this.cachedResponse = false
      const response = await fetch(url);
      const text =  await response.text()
      if (this.options.enable) {
        this.cache.set(url, text);
      }
      this.updateHistory(url)
      return this.toDocument(text)
    }
  }

  toDocument(htmlText: string): Document {
    return this.parser.parseFromString(htmlText, 'text/html')
  }

  updateHistory(href: string): void {
    window.history.pushState({page: href}, '', href)
  }
}
