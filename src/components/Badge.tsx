interface BadgeProps {
  backgroundColor: string
  labelColor: string
  label?: string
}
export function Badge({ backgroundColor, labelColor, label }: BadgeProps) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontFamily: "system-ui",
        lineHeight: "1.2",
        padding: "1rem",
        width: "3rem",
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
