import type { Meta, StoryObj } from "@storybook/react"
import bezierEasing from "bezier-easing"
import {
  converter,
  differenceCiede2000,
  formatCss,
  interpolate,
  modeOklab
} from "culori"
import type { FC, PropsWithChildren } from "react"

const meta: Meta<FC> = {
  component: () => null
}

export default meta

type Story = StoryObj<FC>

function BadgeLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        font: "system-ui",
        display: "flex",
        flexDirection: "row",

        flexWrap: "wrap",
        padding: "0.5rem 1rem"
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
        fontSize: "12px",
        lineHeight: "1.2",
        // @ts-expect-error textWrap is not in the CSS typings
        textWrap: "balance",
        padding: "1rem",
        width: "5rem",
        height: "5rem",
        backgroundColor: background,
        color: text,
        textShadow: "rgba(0, 0, 0, 0.1) 0px 1px 1px",
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

const result1 = findNextShade("#000099", "#FFF")
console.log("NEXT RES:", result1)

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

const blueShades = buildShades("#FFF", "#000099", 8)
const orangeShades = buildShades("#FFF", "#FE8F11", 8)
const bordeauxShades = buildShades("#FFF", "oklch(47.35% 0.148 355.76)", 8)
const greenShades = buildShades("#FFF", "oklch(47.35% 0.111 156.71)", 8)

export function Blue() {
  return (
    <>
      <BadgeLayout>
        <Badge background="#000099" text="#fff" label="original" />
        {blueShades.map((shade, index) => {
          return (
            <Badge
              key={index}
              background={formatCss(shade)}
              text="#000099"
              label={"shade" + index}
            />
          )
        })}
      </BadgeLayout>
      <BadgeLayout>
        <Badge background="#FE8F11" text="#fff" label="original" />
        {orangeShades.map((shade, index) => {
          return (
            <Badge
              key={index}
              background={formatCss(shade)}
              text="#FE8F11"
              label={"shade" + index}
            />
          )
        })}
      </BadgeLayout>
      <BadgeLayout>
        <Badge
          background="oklch(47.35% 0.148 355.76)"
          text="#fff"
          label="original"
        />
        {bordeauxShades.map((shade, index) => {
          return (
            <Badge
              key={index}
              background={formatCss(shade)}
              text="oklch(47.35% 0.148 355.76)"
              label={"shade" + index}
            />
          )
        })}
      </BadgeLayout>
      <BadgeLayout>
        <Badge
          background="oklch(47.35% 0.111 156.71)"
          text="#fff"
          label="original"
        />
        {greenShades.map((shade, index) => {
          return (
            <Badge
              key={index}
              background={formatCss(shade)}
              text="oklch(47.35% 0.111 156.71)"
              label={"shade" + index}
            />
          )
        })}
      </BadgeLayout>
    </>
  )
}
