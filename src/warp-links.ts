import type {WarpLinksOptions} from "./types";
import type {WarpPage, WarpFrame} from "./index";

export class WarpLinks {

  links: Array<HTMLAnchorElement>
  options: WarpLinksOptions = {
    linkMethod: 'exclude',
    excludeLinks: [],
    includeLinks: [],
    frame: false,
    redirectErrors: true
  }

  constructor(options: WarpLinksOptions) {
    this.options = {...this.options, ...options}
    this.links = []
  }

  validate(): void {
    const excludeMode = this.options.linkMethod === 'exclude'
    const validator = excludeMode ? this.options.excludeLinks : this.options.includeLinks

    const checkLink = (link: HTMLAnchorElement) => {
      let valid = excludeMode;
      validator.forEach(rule => {
        if (excludeMode && valid && this.getLinkAttribute(link).includes(rule)) {
          valid = false
        }
        if (!excludeMode && !valid && this.getLinkAttribute(link).includes(rule)) {
          valid = true
        }
      })
      return valid
    }
    this.links = this.links.filter((link) =>
      this.isChild(link) &&
      this.isValidLink(link) &&
      checkLink(link))
  }

  isValidLink(link: HTMLAnchorElement): boolean {
    try {
      const validLink = new URL(link.href)
      return validLink.origin === window.location.origin
    } catch(e) {
      return false
    }
  }

  getLinkAttribute(link: HTMLAnchorElement): string {
    return link.getAttribute('href')
  }

  isChild(link: HTMLAnchorElement): boolean {
    if (this.options.frame) {
      const frameElement = link.closest('warp-frame') as WarpFrame
      frameElement.warpFrame
      return frameElement.warpFrame === this.options.frame
    }
    else {
      return !link.closest('warp-frame')
    }
  }

  upgradeLinks(warpElement: WarpPage | WarpFrame): void {
    this.links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        warpElement.page.warp(warpElement, link)
      })
    })
  }

}
