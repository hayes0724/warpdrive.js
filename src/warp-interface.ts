import type {WarpLinks} from "./warp-links";
import type {WarpPage} from "./warp-page";
import type {WarpFrame} from "./warp-frame";
import {WarpDriveOptions} from "./types";

export class WarpInterface extends HTMLElement {
  warpLinks: WarpLinks
  options: WarpDriveOptions
  initialized: boolean
  type: 'page' | 'frame'

  constructor() {
    super();
    this.initialized = false
  }

  connectedCallback(): void {
    this.mount()
  }

  get ready(): boolean {
    return this.hasAttribute('ready');
  }

  set ready(val: boolean) {
    if (val) {
      setTimeout(() => {
        this.setAttribute('ready', '');
      }, 0)
    } else {
      this.removeAttribute('ready');
    }
  }

  get page(): WarpPage {
    return document.querySelector('warp-page')
  }

  get warpFrame(): string {
    return this.getAttribute('warp-frame')
  }

  get warpTarget(): string {
    return this.getAttribute('warp-target')
  }

  get frameElement(): WarpPage | WarpFrame {
    return this.warpTarget ? document.querySelector(`warp-frame[warp-frame="${this.warpTarget}"]`) : this
  }

  set frameElement(html: WarpPage | WarpFrame) {
    this.frameElement.innerHTML = html.innerHTML
  }

  mount(): void {
    setTimeout(() => this.loadLinks(), 0)
  }

  loadLinks(): void {
    const elementLinks = this.querySelectorAll('a')
    this.warpLinks.links = []
    this.warpLinks.links.push(...Array.from(elementLinks))
    this.warpLinks.validate()
    this.warpLinks.upgradeLinks(this)
    this.ready = true
    this.initialized = true
  }
}
