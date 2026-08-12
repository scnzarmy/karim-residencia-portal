export default function BrandMark({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand-icon-white.png"
      alt="Karim Residencia"
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  )
}
