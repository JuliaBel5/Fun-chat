export function truncateWithEllipses(text: string, max: number = 10) {
  return text.length > max ? text.substr(0, max - 1) + '...' : text
}
