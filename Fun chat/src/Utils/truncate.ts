export function truncateWithEllipses(text: string, max = 10) {
  return text.length > max ? text.slice(0, Math.max(0, max - 1)) + '...' : text
}
