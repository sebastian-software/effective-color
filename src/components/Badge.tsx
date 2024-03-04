import { converter } from "culori"

interface BadgeProps {
  backgroundColor: string
  label?: string
}

const lab = converter("lab")

export function Badge({ backgroundColor, label }: BadgeProps) {
  const parsedColor = lab(backgroundColor)
  const labelColor =
    label && parsedColor ? (parsedColor.l > 65 ? "black" : "white") : ""

  return (
    <div
      style={{
        fontSize: "11px",
        fontFamily: "system-ui",
        lineHeight: "1.2",
        padding: "1rem",
        width: "5rem",
        height: "1.5rem",
        backgroundColor,
        color: labelColor,
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
