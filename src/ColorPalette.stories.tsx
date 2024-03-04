import type { Meta, StoryObj } from "@storybook/react"
import { Oklab, differenceCie94, formatHex, interpolate } from "culori"
import { useMemo, type FC, type PropsWithChildren } from "react"
import "./global.css"

const meta: Meta<FC> = {
  component: () => null,
  parameters: {
    layout: "fullscreen"
  }
}

export default meta

type Story = StoryObj<FC>

function BadgeLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        marginBottom: "1px"
      }}
    >
      {children}
    </div>
  )
}

interface BadgeProps {
  background: string
  text: string
  label: string
}

function Badge({ background, text, label }: BadgeProps) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontFamily: "system-ui",
        lineHeight: "1.2",
        padding: "1rem",
        width: "3rem",
        height: "1.5rem",
        backgroundColor: background,
        color: text,
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0
      }}
    >
      {label}
    </div>
  )
}

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

interface ShadeConfig {
  steps: number
  difference: number
}

const defaultShadeConfig: ShadeConfig = {
  steps: 15,
  difference: 2
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
  let tries = 0
  for (let change = 0.001; change < 1; change += 0.001) {
    next = mixer(change)
    tries++

    const diff = differ(start, next)
    const reqDiff = config.difference + calculateCompensationFactor(next.l)

    if (diff > reqDiff) {
      return next
    }
  }
}

function calculateCompensationFactor(lightness: number): number {
  const base = 5
  return Math.pow(base, 1 - lightness) - 1
}

function buildShades(
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

interface ColorShapeProps {
  name: string
  to: string
  color: string
  config?: ShadeConfig
}

function ColorShades({ name, color, to, config }: ColorShapeProps) {
  const shades = useMemo(
    () => buildShades(to, color, config),
    [to, color, config]
  )

  return (
    <BadgeLayout>
      <Badge background={color} text={to} label={name} />
      {shades.map((shade, index) => {
        return <Badge key={index} background={formatHex(shade)} text={color} />
      })}
    </BadgeLayout>
  )
}

const tailwind = {
  slate: "#64748b",
  gray: "#6b7280",
  stone: "#78716c",
  red: "#dc2626",
  orange: "#f97316",
  amber: "#d97706",
  yellow: "#facc15",
  lime: "#a3e635",
  green: "#16a34a",
  emerald: "#059669",
  teal: "#0d9488",
  cyan: "#0891b2",
  sky: "#0ea5e9",
  blue: "#1e40af",
  indigo: "#4f46e5",
  violet: "#7c3aed",
  purple: "#7e22ce",
  fuchsia: "#c026d3",
  pink: "#ec4899",
  rose: "#9f1239"
}

const pantone = {
  "2024": "#ffbe98", // Peach Fuzz
  "2023": "#BB2649", // Viva Magenta
  "2022": "#6667ab", // "Very Peri"
  "2021a": "#F9E547", // "Iluminating"
  "2021b": "#97999B", // "Ultimate Gray"
  "2020": "#0f4c81", // "Classic Blue"
  "2019": "#FF6F61", // "Living Coral"
  "2018": "#5F4B8B", // "Ultra Violet"
  "2017": "#88B04B", // "Greenery"
  "2016a": "#F7CAC9", // "Rose Quartz"
  "2016b": "#92A8D1", // "Serenity"
  "2015": "#955251", // "Marsala"
  "2014": "#B565A7", // "Radiant Orchid"
  "2013": "#009B77", // "Emerald"
  "2012": "#dd4124", // "Tangerine Tango"
  "2011": "#d94f70", // "Honeysuckle"
  "2010": "#45b8ac" // "Turquoise"
}

export function LightShadesTailwind() {
  return Object.keys(tailwind)
    .sort()
    .map((key) => {
      const color = tailwind[key as keyof typeof tailwind]

      return <ColorShades key={key} name={key} color={color} to="#fff" />
    })
}

export function DarkShadesTailwind() {
  return Object.keys(tailwind)
    .sort()
    .map((key) => {
      const color = tailwind[key as keyof typeof tailwind]

      return <ColorShades key={key} name={key} color={color} to="#000" />
    })
}

export function LightShadesPantone() {
  return Object.keys(pantone)
    .sort()
    .map((key) => {
      const color = pantone[key as keyof typeof pantone]

      return <ColorShades key={key} name={key} color={color} to="#fff" />
    })
}

export function DarkShadesPantone() {
  return Object.keys(pantone)
    .sort()
    .map((key) => {
      const color = pantone[key as keyof typeof pantone]

      return <ColorShades key={key} name={key} color={color} to="#000" />
    })
}
