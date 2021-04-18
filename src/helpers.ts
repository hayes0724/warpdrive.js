import type {WarpFrame} from "./warp-frame";

export function frameSelector(searchElement: HTMLElement, warpTarget: string): WarpFrame {
  return searchElement.querySelector(`warp-frame[warp-frame="${warpTarget}"]`)
}
