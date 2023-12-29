import type { Meta, StoryObj } from "@storybook/react"
import bezierEasing from "bezier-easing"
import {
  converter,
  differenceCiede2000,
  formatCss,
  interpolate,
  modeOklab
} from "culori"
import { useMemo, type FC, type PropsWithChildren } from "react"

const meta: Meta<FC> = {
  component: () => null
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

function findNextShade(start: string, end: string, difference = 2) {
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

function buildShades(start: string, end: string, steps: number) {
  const result = []
  let current = start
  for (let i = 0; i < 100; i++) {
    const next = findNextShade(current, end)
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
  steps?: number
}

function ColorShades({ name, color, to, steps = 8 }: ColorShapeProps) {
  const shades = useMemo(() => buildShades(to, color, steps), [color, steps])

  return (
    <BadgeLayout>
      <Badge background={color} text={to} label={name} />
      {shades.map((shade, index) => {
        return (
          <Badge
            key={index}
            background={formatCss(shade)}
            text={color}
            label={"#" + index}
          />
        )
      })}
    </BadgeLayout>
  )
}

export function LightShades() {
  return (
    <>
      {/* Based on colors from https://tailwindcss.com/docs/customizing-colors */}
      <ColorShades name="tw-neutral-700" color="#404040" to="#fff" />
      <ColorShades name="tw-red-600" color="#dc2626" to="#fff" />
      <ColorShades name="tw-orange-600" color="#ea580c" to="#fff" />
      <ColorShades name="tw-amber-600" color="#d97706" to="#fff" />
      <ColorShades name="tw-yellow-600" color="#ca8a04" to="#fff" />
      <ColorShades name="tw-lime-600" color="#65a30d" to="#fff" />
      <ColorShades name="tw-green-600" color="#16a34a" to="#fff" />
      <ColorShades name="tw-emerald-600" color="#059669" to="#fff" />
      <ColorShades name="tw-teal-600" color="#0d9488" to="#fff" />
      <ColorShades name="tw-cyan-600" color="#0891b2" to="#fff" />
      <ColorShades name="tw-sky-600" color="#0284c7" to="#fff" />
      <ColorShades name="tw-blue-600" color="#2563eb" to="#fff" />
      <ColorShades name="tw-indigo-600" color="#4f46e5" to="#fff" />
      <ColorShades name="tw-violet-600" color="#7c3aed" to="#fff" />
      <ColorShades name="tw-purple-600" color="#9333ea" to="#fff" />
      <ColorShades name="tw-fuchsia-600" color="#c026d3" to="#fff" />
      <ColorShades name="tw-pink-600" color="#db2777" to="#fff" />
      <ColorShades name="tw-rose-600" color="#e11d48" to="#fff" />
    </>
  )
}

export function DarkShades() {
  return (
    <>
      {/* Based on colors from https://tailwindcss.com/docs/customizing-colors */}
      <ColorShades name="tw-neutral-700" color="#404040" to="#000" />
      <ColorShades name="tw-red-600" color="#dc2626" to="#000" />
      <ColorShades name="tw-orange-600" color="#ea580c" to="#000" />
      <ColorShades name="tw-amber-600" color="#d97706" to="#000" />
      <ColorShades name="tw-yellow-600" color="#ca8a04" to="#000" />
      <ColorShades name="tw-lime-600" color="#65a30d" to="#000" />
      <ColorShades name="tw-green-600" color="#16a34a" to="#000" />
      <ColorShades name="tw-emerald-600" color="#059669" to="#000" />
      <ColorShades name="tw-teal-600" color="#0d9488" to="#000" />
      <ColorShades name="tw-cyan-600" color="#0891b2" to="#000" />
      <ColorShades name="tw-sky-600" color="#0284c7" to="#000" />
      <ColorShades name="tw-blue-600" color="#2563eb" to="#000" />
      <ColorShades name="tw-indigo-600" color="#4f46e5" to="#000" />
      <ColorShades name="tw-violet-600" color="#7c3aed" to="#000" />
      <ColorShades name="tw-purple-600" color="#9333ea" to="#000" />
      <ColorShades name="tw-fuchsia-600" color="#c026d3" to="#000" />
      <ColorShades name="tw-pink-600" color="#db2777" to="#000" />
      <ColorShades name="tw-rose-600" color="#e11d48" to="#000" />
    </>
  )
}
