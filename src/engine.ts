import { Oklab, differenceCie94, interpolate } from "culori"

// Choice of CIEDE94 for Color Palette Generation:
// We've opted for the CIEDE94 color difference formula for generating our color palettes
// due to its simpler approach to calculating color differences. While CIEDE2000 offers
// enhanced accuracy in modeling human visual perception, especially for colors with low
// chroma, it can result in larger perceived steps between such colors, impacting the
// harmonious transition within our palettes. CIEDE94, with its less complex handling of
// chroma, hue, and lightness differences, provides a more uniform distribution of color
// steps across both chroma-rich and grey-ish colors. This aligns better with our goal of
// creating aesthetically pleasing and evenly spaced color sets, making CIEDE94 more suited
// to our application's needs. The decision reflects a balance between perceptual accuracy
// and visual harmony, prioritizing the latter for our specific visual design objectives.
const differ = differenceCie94()

export interface ShadeConfig {
  steps: number
  difference: number
  compensation: number
}

const defaultShadeConfig: ShadeConfig = {
  steps: 15,
  difference: 2,
  compensation: 5
}

function findNextShade(
  start: string | Oklab,
  end: string,
  config: ShadeConfig
) {
  if (differ(start, end) < 0.1) {
    return
  }

  const mixer = interpolate([start, end], "oklab")

  let next
  for (let change = 0.001; change < 1; change += 0.001) {
    next = mixer(change)

    const diff = differ(start, next)
    const minDiff =
      config.difference + Math.pow(config.compensation, 1 - next.l) - 1

    if (diff >= minDiff) {
      return next
    }
  }
}

export function buildShades(
  start: string,
  end: string,
  config: ShadeConfig = defaultShadeConfig
) {
  const result = []
  let current: Oklab | string = start

  for (let i = 0; i < 100; i++) {
    const next = findNextShade(current, end, config)
    if (next) {
      result.push(next)
      current = next
    } else {
      break
    }

    if (result.length >= config.steps) {
      break
    }
  }

  return result
}
