interface LogoProps {
  size?: number
  className?: string
  title?: string
}

/**
 * NagrikSetu emblem. Renders the official fixed brand mark (public/logo-mark.png,
 * cropped from the approved master logo). The component keeps the same square
 * footprint and props as before so no layout changes are required.
 */
export default function Logo({ size = 48, className, title = "NagrikSetu" }: LogoProps) {
  return (
    <img
      src="/logo-mark.png"
      width={size}
      height={size}
      alt={title + " emblem"}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      draggable={false}
    />
  )
}
