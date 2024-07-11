import type { Meta } from "@storybook/react"
import { type FC } from "react"
import {
  ColorPalette,
  apple,
  material14,
  pantone,
  shiny,
  sebastian,
  tailwind
} from "../palettes"
import {
  ShadeConfig,
  SpectrumEntry,
  buildShades,
  buildSpectrum,
  spectrumToList
} from "../engine"
import { Badge } from "./Badge"
import { BadgeLayout } from "./BadgeLayout"

const meta: Meta<FC> = {
  component: () => null
}

export default meta

interface ColorShapeProps {
  name: string
  start: string
  end: string
  config?: ShadeConfig
}

function ColorShades({ name, end, start, config }: ColorShapeProps) {
  return (
    <BadgeLayout>
      <Badge backgroundColor={end ?? "white"} label={name} />
      {buildShades(start, end, config).map((shade, index) => (
        <Badge key={index} backgroundColor={shade as string} />
      ))}
    </BadgeLayout>
  )
}

interface ColorSpectrumProps {
  name: string
  start: string
  config?: ShadeConfig
}

function ColorSpectrum({ name, start, config }: ColorSpectrumProps) {
  const spectrum = spectrumToList(buildSpectrum(start, config))

  return (
    <BadgeLayout>
      <Badge backgroundColor={start} label={name} />
      {spectrum.map(({ id, value }: SpectrumEntry) => (
        <Badge key={id} backgroundColor={value as string} label={id} />
      ))}
    </BadgeLayout>
  )
}

export interface ColorShadesFromPaletteProps {
  palette: ColorPalette
  start?: string
}

function ColorShadesFromPalette({
  palette,
  start
}: ColorShadesFromPaletteProps) {
  // Dynamically set the background color of the storybook preview
  document.body.style.backgroundColor = start || "#fff"

  return Object.keys(palette)
    .sort()
    .map((key) => {
      const color = palette[key as keyof typeof palette]
      if (start == null) {
        return <ColorSpectrum key={key} name={key} start={color} />
      } else {
        return <ColorShades key={key} name={key} end={color} start={start} />
      }
    })
}

export function LightShadesTailwind() {
  return <ColorShadesFromPalette palette={tailwind} start="#fff" />
}

export function DarkShadesTailwind() {
  return <ColorShadesFromPalette palette={tailwind} start="#000" />
}

export function LightShadesPantone() {
  return <ColorShadesFromPalette palette={pantone} start="#fff" />
}

export function DarkShadesPantone() {
  return <ColorShadesFromPalette palette={pantone} start="#000" />
}

export function LightShadesApple() {
  return <ColorShadesFromPalette palette={apple} start="#fff" />
}

export function DarkShadesApple() {
  return <ColorShadesFromPalette palette={apple} start="#000" />
}

export function LightShadesShiny() {
  return <ColorShadesFromPalette palette={shiny} start="#fff" />
}

export function DarkShadesShiny() {
  return <ColorShadesFromPalette palette={shiny} start="#000" />
}

export function LightShadesMaterial() {
  return <ColorShadesFromPalette palette={material14} start="#fff" />
}

export function DarkShadesMaterial() {
  return <ColorShadesFromPalette palette={material14} start="#000" />
}

export function RelatedShadesTailwind() {
  return <ColorShadesFromPalette palette={tailwind} />
}

export function RelatedShadesPantone() {
  return <ColorShadesFromPalette palette={pantone} />
}

export function RelatedShadesApple() {
  return <ColorShadesFromPalette palette={apple} />
}

export function RelatedShadesMaterial() {
  return <ColorShadesFromPalette palette={material14} />
}

export function RelatedShadesShiny() {
  return <ColorShadesFromPalette palette={shiny} />
}

export function RelatedShadesSebastianSoftware() {
  return <ColorShadesFromPalette palette={sebastian} />
}

export function LightShadesSebastian() {
  return <ColorShadesFromPalette palette={sebastian} start="#fff" />
}

export function DarkShadesSebastian() {
  return <ColorShadesFromPalette palette={sebastian} start="#000" />
}
