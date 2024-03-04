import type { Meta, StoryObj } from "@storybook/react"
import {
  Oklab,
  differenceCiede2000,
  formatCss,
  formatHex,
  interpolate
} from "culori"
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
        flexWrap: "wrap",
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
        flexDirection: "column"
      }}
    >
      {label}
    </div>
  )
}

function calculateLightnessCompensation(
  lightness: number,
  initialCompensation: number,
  decayRate: number
): number {
  // Ensure lightness is within the range [0, 1]
  if (lightness < 0 || lightness > 1) {
    throw new Error("Lightness must be between 0 and 1")
  }

  // Calculate the compensation using the exponential function
  const compensation = initialCompensation * Math.exp(-decayRate * lightness)

  return compensation
}

// DeltaE 2000 is based on color differences in the L* C* H* color space.
// It is not an application-specific calculation and is commonly used in
// video calibration. Unlike DeltaE 1976 and 1994, it does take into account
// the human eye’s perceptual sensitivity at different colors.
const differ = differenceCiede2000()

interface ShadeConfig {
  steps: number
  difference: number
  minLightness: number
  maxLightness: number
}

const defaultShadeConfig: ShadeConfig = {
  steps: 20,
  difference: 2,
  minLightness: 0.1,
  maxLightness: 0.99
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
  for (let change = 0.0001; change < 1; change += 0.0001) {
    next = mixer(change)
    tries++

    if (
      differ(start, next) > config.difference &&
      next.l >= config.minLightness &&
      next.l <= config.maxLightness
    ) {
      return next
    }
  }
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
      <Badge background={to} text={color} label="to" />
      {shades.map((shade, index) => {
        return (
          <Badge
            key={index}
            background={formatHex(shade)}
            text={color}
            label={"#" + index}
          />
        )
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

export function LightShades() {
  return Object.keys(tailwind).map((key) => {
    const color = tailwind[key as keyof typeof tailwind]

    return (
      <ColorShades
        key={key}
        name={key}
        color={formatCss(color) ?? ""}
        to="#fff"
      />
    )
  })
}

export function DarkShades() {
  return Object.keys(tailwind).map((key) => {
    const color = tailwind[key as keyof typeof tailwind]

    return (
      <ColorShades
        key={key}
        name={key}
        color={formatCss(color) ?? ""}
        to="#000"
      />
    )
  })
}
