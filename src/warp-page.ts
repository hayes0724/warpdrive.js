import {WarpInterface} from "./warp-interface";
import {WarpHttp} from "./warp-http";
import {WarpLinks} from "./warp-links";
import {WarpRender} from "./warp-render";
import {timingValue} from "./types";

export class WarpPage extends WarpInterface {

  http: WarpHttp
  warpRender: WarpRender
  type: 'page'

  constructor() {
    super()
    this.type = 'page'
  }

  set timing(name: timingValue) {
    if (this.options.performanceTimings) {
      performance.mark(name)
    }
  }

  mount(): void {
    setTimeout(() => {
      this.warpRender = new WarpRender(this.options.performanceTimings)
      this.warpLinks = new WarpLinks( {
        linkMethod: this.options.linkMethod,
        excludeLinks: this.options.excludeLinks,
        includeLinks: this.options.includeLinks,
        redirectErrors: this.options.redirectErrors,
        frame: false
      })
      this.http = new WarpHttp(this.options.cache)
      this.loadLinks()
    }, 0)
  }

  warp(warpElement: WarpInterface, link: HTMLAnchorElement): void {
    this.timing = 'start'
    warpElement.frameElement.ready = false
    this.http
      .get(link.href)
      .then(document => {
        this.timing = 'response'
        this.warpRender.render(warpElement, document)
        setTimeout(() => {
          this.timing = 'end'
          this.warpRender.renderEvent(warpElement, link)
        }, 0)
      })
      .catch((error) => {
        console.error('WarpLink: failed to load new page')
        console.error(error)
        this.http.cache.clear()
        if (this.options.redirectErrors) {
          window.location.href = link.href
        }
      })
  }

}
