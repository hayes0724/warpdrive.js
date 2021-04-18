import {WarpInterface} from "./warp-interface";
import {WarpLinks} from "./warp-links";
import type {WarpPage} from "./warp-page";

export class WarpFrame extends WarpInterface {

  constructor() {
    super()
    this.type = 'frame'
  }

  mount(): void {
    setTimeout(() => {
      const warpPage = document.querySelector('warp-page') as WarpPage
      this.options = warpPage.options
      this.warpLinks = new WarpLinks( {
        linkMethod: this.options.linkMethod,
        excludeLinks: this.options.excludeLinks,
        includeLinks: this.options.includeLinks,
        redirectErrors: this.options.redirectErrors,
        frame: this.warpFrame
      })
      this.loadLinks()
    }, 0)
  }
}
