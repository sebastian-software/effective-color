import type { Meta } from "@storybook/react"
import { formatHex } from "culori"
import { type FC } from "react"
import { ColorPalette, pantone, tailwind } from "../palettes"
import { ShadeConfig, buildShades } from "../engine"
import { Badge } from "./Badge"
import { BadgeLayout } from "./BadgeLayout"

import "./ColorPalette.css"

const meta: Meta<FC> = {
  component: () => null,
  parameters: {
    layout: "fullscreen"
  }
}

export default meta

interface ColorShapeProps {
  name: string
  start: string
  end: string
  config?: ShadeConfig
}

function ColorShades({
  name,
  end: end,
  start: start,
  config
}: ColorShapeProps) {
  return (
    <BadgeLayout>
      <Badge backgroundColor={end} labelColor={start} label={name} />
      {buildShades(start, end, config).map((shade, index) => (
        <Badge
          key={index}
          backgroundColor={formatHex(shade)}
          labelColor={end}
        />
      ))}
    </BadgeLayout>
  )
}

export interface ColorShadesFromPaletteProps {
  palette: ColorPalette
  start: string
}

function ColorShadesFromPalette({
  palette,
  start
}: ColorShadesFromPaletteProps) {
  return Object.keys(palette)
    .sort()
    .map((key) => {
      const color = palette[key as keyof typeof palette]

      return <ColorShades key={key} name={key} end={color} start={start} />
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
1
