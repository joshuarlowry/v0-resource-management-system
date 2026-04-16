/**
 * Project-wide helpers. The old Tailwind `cn` utility has been retired
 * now that styling uses MUI's `sx` prop and Emotion. If conditional
 * class composition is ever needed in plain HTML elements, reintroduce
 * clsx locally.
 */

export type Nullable<T> = T | null | undefined

/**
 * Given an arbitrary hex/rgb color, returns a CSS color expression that
 * is the given color faded to the supplied alpha. Used for legacy tag
 * color-variant rendering where the palette is per-tag, not theme-driven.
 */
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
    const hex = color.length === 4
      ? color.slice(1).split('').map((c) => c + c).join('')
      : color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}
