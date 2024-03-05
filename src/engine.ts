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
  steps: 5,
  difference: 2,
  compensation: 5
}

const MIXER_SPACE = "oklab"
const MIXER_STEPS = 0.001

function findNextShade(
  start: string | Oklab,
  end: string,
  config: ShadeConfig
) {
  if (differ(start, end) < 0.1) {
    return
  }

  const mixer = interpolate([start, end], MIXER_SPACE)

  let next
  for (let change = MIXER_STEPS; change < 1; change += MIXER_STEPS) {
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

export type ColorSpectrum = Record<string, Oklab | string>

export function buildSpectrum(
  start: string,
  config: ShadeConfig = defaultShadeConfig
): ColorSpectrum {
  const lighter = buildShades(start, "#000", config)
  const darker = buildShades(start, "#fff", config)

  const table: ColorSpectrum = {}
  lighter.forEach((color: Oklab, index: number) => {
    table[`-${index + 1}`] = color
  })
  table["0"] = start
  darker.forEach((color: Oklab, index: number) => {
    table[`+${index + 1}`] = color
  })

  return table
}

export type SpectrumEntry = {
  id: string
  value: string | Oklab
}

export type SpectrumList = SpectrumEntry[]

function spectrumIdComparator(a: string, b: string) {
  const aNum = parseInt(a, 10)
  const bNum = parseInt(b, 10)

  return aNum - bNum
}

export function spectrumToList(spectrum: ColorSpectrum): SpectrumList {
  const result: SpectrumList = []
  Object.keys(spectrum)
    .sort(spectrumIdComparator)
    .forEach((id) => {
      result.push({ id, value: spectrum[id] })
    })

  return result
}
