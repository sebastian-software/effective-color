import { expect, test } from "vitest"
import { buildShades, buildSpectrum } from "."

test("Shade: Black to White", () => {
  expect(buildShades("#000", "#fff")).toMatchInlineSnapshot(`
    [
      "oklch(0.175 0 none)",
      "oklch(0.219 0 none)",
      "oklch(0.256 0 none)",
      "oklch(0.292 0 none)",
      "oklch(0.327 0 none)",
    ]
  `)
})

test("Shade: White to Black", () => {
  expect(buildShades("#fff", "#000")).toMatchInlineSnapshot(`
    [
      "oklch(0.982 0 none)",
      "oklch(0.963 0 none)",
      "oklch(0.945 0 none)",
      "oklch(0.926 0 none)",
      "oklch(0.907 0 none)",
    ]
  `)
})

test("Shade: White to Black (3 Steps)", () => {
  expect(
    buildShades("#fff", "#000", {
      colorSteps: 3
    })
  ).toMatchInlineSnapshot(`
    [
      "oklch(0.982 0 none)",
      "oklch(0.963 0 none)",
      "oklch(0.945 0 none)",
    ]
  `)
})

test("Shade: Pink to White", () => {
  expect(buildShades("rgb(236, 72, 153)", "#fff")).toMatchInlineSnapshot(`
    [
      "oklch(0.676 0.199 354.308)",
      "oklch(0.696 0.187 354.308)",
      "oklch(0.715 0.175 354.308)",
      "oklch(0.734 0.164 354.308)",
      "oklch(0.752 0.153 354.308)",
    ]
  `)
})

test("Spectrum: #000099", () => {
  expect(buildSpectrum("#000099")).toMatchInlineSnapshot(`
    {
      "+1": "oklch(0.334 0.206 264.052)",
      "+2": "oklch(0.359 0.198 264.052)",
      "+3": "oklch(0.384 0.191 264.052)",
      "+4": "oklch(0.409 0.183 264.052)",
      "+5": "oklch(0.435 0.175 264.052)",
      "-1": "oklch(0.274 0.19 264.052)",
      "-2": "oklch(0.238 0.165 264.052)",
      "-3": "oklch(0.202 0.14 264.052)",
      "-4": "oklch(0.169 0.117 264.052)",
      "-5": "oklch(0.142 0.098 264.052)",
      "0": "oklch(0.309 0.214 264.052)",
    }
  `)
})
