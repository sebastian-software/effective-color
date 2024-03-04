import { type PropsWithChildren } from "react"

export function BadgeLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        marginBottom: "0.5rem"
      }}
    >
      {children}
    </div>
  )
}
