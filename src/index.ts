import {WarpPage} from "./warp-page";
import {WarpFrame} from "./warp-frame";
import {WarpHttp} from "./warp-http";
import {WarpLinks} from "./warp-links";
import {WarpInterface} from "./warp-interface";
import {WarpCache} from "./warp-cache";

import type {WarpDriveOptions} from "./types";

class WarpDrive {
  options: WarpDriveOptions = {
    linkMethod: 'exclude',
    excludeLinks: [],
    includeLinks: [],
    performanceTimings: false,
    redirectErrors: true,
    cache: {
      enable: true,
      storage: 'local',
      fallback: 'object'
    }
  }

  constructor(options: WarpDriveOptions) {
    this.options = {...this.options, ...options}
    document.head.insertAdjacentHTML("beforeend", this.styles())
    this.loadCustomElements()
  }

  loadCustomElements(): void {
    if (!customElements.get('warp-page')) {
      customElements.define('warp-page', WarpPage)
    }
    if (!customElements.get('warp-frame')) {
      customElements.define('warp-frame', WarpFrame)
    }
    customElements
      .whenDefined('warp-page')
      .then(() => {
        const getPage = (): WarpPage => document.querySelector('warp-page')
        getPage().options = this.options
      })
  }

  styles(): string {
    return (`
    <style>
        warp-page, warp-frame {
            width: 100%;
            height: 100%;
            display: block;
            opacity: 0;
        }
        warp-page[ready], warp-frame[ready] {
            opacity: 1;
        }
    </style>
  `)
  }

}

export {
  WarpDrive,
  WarpFrame,
  WarpPage,
  WarpHttp,
  WarpLinks,
  WarpInterface,
  WarpCache
}
