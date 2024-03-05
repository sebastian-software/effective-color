import {
  Color,
  Gamut,
  Mode,
  Oklab,
  clampChroma,
  converter,
  differenceCie94,
  formatCss,
  interpolate,
  oklab
} from "culori"

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
  colorSteps: number
  colorDifference: number
  darkColorCompensation: number
  mixerSteps: number
  outputSpace: Color["mode"]
  outputGamut: Gamut["mode"]
  outputCSS: boolean
  outputPrecision: number
}

const defaultShadeConfig: ShadeConfig = {
  colorSteps: 5,
  colorDifference: 2,
  darkColorCompensation: 5,
  mixerSteps: 0.001,
  outputSpace: "oklch",
  outputGamut: "p3",
  outputCSS: true,
  outputPrecision: 3
}

export function findNextShade(
  start: ColorValue,
  end: string,
  config: ShadeConfig
) {
  if (start == null || differ(start, end) < 0.1) {
    return
  }

  const mixer = interpolate([start, end], "oklab")

  let next
  for (
    let change = config.mixerSteps;
    change < 1;
    change += config.mixerSteps
  ) {
    next = mixer(change)

    const diff = differ(start, next)
    const minDiff =
      config.colorDifference +
      Math.pow(config.darkColorCompensation, 1 - next.l) -
      1

    if (diff >= minDiff) {
      return next
    }
  }
}

export function convertToOutputFormat(
  color: Color | undefined,
  config: Partial<ShadeConfig> = {}
) {
  const merged = { ...defaultShadeConfig, ...config }

  // FIXME: use toGamut instead of clampChroma but this is missing in TS definitions right now.

  const toOutputFormat = converter(merged.outputSpace)

  if (!color) {
    return ""
  }

  const raw = toOutputFormat(clampChroma(color, merged.outputGamut))

  // FIXME: Try finding a smarter solution for getting correct types on Object.keys loop
  const numberObject = raw as any as Record<string, number>
  if (merged.outputPrecision != null) {
    Object.keys(numberObject).forEach((key) => {
      if (typeof numberObject[key] === "number") {
        numberObject[key] = parseFloat(
          numberObject[key].toFixed(merged.outputPrecision)
        )
      }
    })
  }

  if (merged.outputCSS) {
    return formatCss(raw)
  }

  return raw
}

export type ColorValue = string | Color | undefined

export function buildShades(
  start: ColorValue,
  end: string,
  config: Partial<ShadeConfig> = {}
) {
  const merged = { ...defaultShadeConfig, ...config }

  const result = []
  let current: ColorValue = start

  for (let i = 0; i < 100; i++) {
    const next = findNextShade(current, end, merged)
    if (next) {
      result.push(convertToOutputFormat(next))
      current = next
    } else {
      break
    }

    if (result.length >= merged.colorSteps) {
      break
    }
  }

  return result
}

export type ColorSpectrum = Record<string, ColorValue>

export function buildSpectrum(
  start: ColorValue,
  config: Partial<ShadeConfig> = {}
): ColorSpectrum {
  const merged = { ...defaultShadeConfig, ...config }

  const parsed = oklab(start)

  const lighter = buildShades(parsed, "#000", merged)
  const darker = buildShades(parsed, "#fff", merged)

  const table: ColorSpectrum = {}
  lighter.forEach((color, index) => {
    table[`-${index + 1}`] = color
  })
  table["0"] = convertToOutputFormat(parsed)
  darker.forEach((color, index) => {
    table[`+${index + 1}`] = color
  })

  return table
}

export type SpectrumEntry = {
  id: string
  value: string | Color | undefined
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
