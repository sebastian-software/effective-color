import type { Meta, StoryObj } from "@storybook/react"
import bezierEasing from "bezier-easing"
import {
  converter,
  differenceCiede2000,
  formatCss,
  formatHex,
  interpolate,
  modeOklab
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
        background: "black",
        display: "flex",
        flexDirection: "row",

        flexWrap: "wrap",
        padding: "0.25rem 0.5rem"
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
        width: "7.5rem",
        height: "2.5rem",
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

const differ = differenceCiede2000()

function findNextShade(start: string, end: string, difference: number) {
  if (differ(start, end) < 0.1) {
    return
  }

  const mixer = interpolate([start, end], "oklab")

  let next
  for (let change = 0.001; change < 1; change += 0.001) {
    next = mixer(change)
    if (differ(start, next) > difference) {
      return next
    }
  }
}

function buildShades(
  start: string,
  end: string,
  steps: number,
  difference: number
) {
  const result = []
  let current = start
  for (let i = 0; i < 100; i++) {
    const next = findNextShade(current, end, difference)
    if (next) {
      result.push(next)
      current = next
    } else {
      break
    }

    if (result.length >= steps) {
      break
    }
  }

  return result
}

interface ColorShapeProps {
  name: string
  to: string
  color: string
  steps: number
  difference: number
}

function ColorShades({ name, color, to, steps, difference }: ColorShapeProps) {
  const shades = useMemo(
    () => buildShades(to, color, steps, difference),
    [color, steps]
  )

  return (
    <BadgeLayout>
      <Badge background={color} text={to} label={name} />
      <Badge background={to} text="#fff" label="to" />
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

export function LightShades() {
  const config = {
    to: "#fff",
    difference: 2,
    steps: 7
  }

  return (
    <>
      {/* Based on colors from https://tailwindcss.com/docs/customizing-colors */}
      <ColorShades name="tw-neutral-600" color="#525252" {...config} />
      <ColorShades name="tw-red-600" color="#dc2626" {...config} />
      <ColorShades name="tw-orange-600" color="#ea580c" {...config} />
      <ColorShades name="tw-amber-600" color="#d97706" {...config} />
      <ColorShades name="tw-yellow-600" color="#ca8a04" {...config} />
      <ColorShades name="tw-lime-600" color="#65a30d" {...config} />
      <ColorShades name="tw-green-600" color="#16a34a" {...config} />
      <ColorShades name="tw-emerald-600" color="#059669" {...config} />
      <ColorShades name="tw-teal-600" color="#0d9488" {...config} />
      <ColorShades name="tw-cyan-600" color="#0891b2" {...config} />
      <ColorShades name="tw-sky-600" color="#0284c7" {...config} />
      <ColorShades name="tw-blue-600" color="#2563eb" {...config} />
      <ColorShades name="tw-indigo-600" color="#4f46e5" {...config} />
      <ColorShades name="tw-violet-600" color="#7c3aed" {...config} />
      <ColorShades name="tw-purple-600" color="#9333ea" {...config} />
      <ColorShades name="tw-fuchsia-600" color="#c026d3" {...config} />
      <ColorShades name="tw-pink-600" color="#db2777" {...config} />
      <ColorShades name="tw-rose-600" color="#e11d48" {...config} />
    </>
  )
}

export function DarkShades() {
  const config = {
    // "to" is not black but the first color cielab reports as visually
    // different to black (difference=1)
    to: "#060606",
    difference: 2,
    steps: 7
  }
  return (
    <>
      {/* Based on colors from https://tailwindcss.com/docs/customizing-colors */}
      <ColorShades name="tw-neutral-600" color="#525252" {...config} />
      <ColorShades name="tw-red-600" color="#dc2626" {...config} />
      <ColorShades name="tw-orange-600" color="#ea580c" {...config} />
      <ColorShades name="tw-amber-600" color="#d97706" {...config} />
      <ColorShades name="tw-yellow-600" color="#ca8a04" {...config} />
      <ColorShades name="tw-lime-600" color="#65a30d" {...config} />
      <ColorShades name="tw-green-600" color="#16a34a" {...config} />
      <ColorShades name="tw-emerald-600" color="#059669" {...config} />
      <ColorShades name="tw-teal-600" color="#0d9488" {...config} />
      <ColorShades name="tw-cyan-600" color="#0891b2" {...config} />
      <ColorShades name="tw-sky-600" color="#0284c7" {...config} />
      <ColorShades name="tw-blue-600" color="#2563eb" {...config} />
      <ColorShades name="tw-indigo-600" color="#4f46e5" {...config} />
      <ColorShades name="tw-violet-600" color="#7c3aed" {...config} />
      <ColorShades name="tw-purple-600" color="#9333ea" {...config} />
      <ColorShades name="tw-fuchsia-600" color="#c026d3" {...config} />
      <ColorShades name="tw-pink-600" color="#db2777" {...config} />
      <ColorShades name="tw-rose-600" color="#e11d48" {...config} />
    </>
  )
}
