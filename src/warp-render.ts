import type {WarpInterface} from "./warp-interface";
import type {WarpFrame} from "./warp-frame";
import type {WarpPage} from "./warp-page";
import {WarpRenderTiming, WarpRenderEvent} from "./types";

export class WarpRender {

  performanceTimings

  constructor(performanceTimings: boolean) {
    this.performanceTimings = performanceTimings
  }

  render(warpElement: WarpInterface, html: Document): void {
    warpElement.frameElement = this.getReplacementFrame(html, warpElement)
    warpElement.frameElement.mount()
    warpElement.frameElement.ready = true
  }

  getReplacementFrame(html: Document, warpElement: WarpInterface): WarpPage | WarpFrame {
    if (warpElement.warpTarget) {
      return html.querySelector(`warp-frame[warp-frame="${warpElement.warpTarget}"]`)
    }
    else {
      if (warpElement.type === 'page') {
        return html.querySelector('warp-page')
      }
      else {
        return html.querySelector(`warp-frame[warp-frame="${warpElement.warpFrame}"]`)
      }
    }
  }

  renderEvent(warpElement: WarpInterface, link: HTMLAnchorElement): void {
    const results: WarpRenderTiming = {
      total: 'disabled',
      response: 'disabled',
      render: 'disabled'
    }
    if (this.performanceTimings) {
      performance.measure('total', 'start', 'end')
      performance.measure('response', 'start', 'response')
      performance.measure('render', 'response', 'end')
      results.total = performance.getEntriesByName('total')[0].duration
      results.response = performance.getEntriesByName('response')[0].duration
      results.render = performance.getEntriesByName('render')[0].duration
    }
    const renderDetails: WarpRenderEvent = {
      page: link.href,
      target: warpElement.warpTarget,
      timing: results,
      cachedResponse: warpElement.page.http.cachedResponse
    }
    document.dispatchEvent(new CustomEvent('warp.render', {detail: renderDetails}))
    performance.clearMarks()
    performance.clearMeasures()
  }

}
