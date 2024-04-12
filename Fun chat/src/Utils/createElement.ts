export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  className = '',
  content = '',
  id?: string
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag)

  if (className) {
    element.className = className
  }

  if (content) {
    element.textContent = content
  }

  if (id) {
    element.id = id
  }

  return element
}

export function createInputElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  className = '',
  content = '',
  id?: string,
  attributes: Record<string, string | boolean> = {}
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag)
  if (className) element.classList.add(className)
  if (content) element.textContent = content
  if (id) element.id = id
  for (const key in attributes) {
    element.setAttribute(key, attributes[key].toString())
  }
  return element
}
