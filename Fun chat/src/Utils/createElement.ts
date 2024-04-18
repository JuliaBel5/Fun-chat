export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  className = '',
  content = '',
  id?: string,
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
  attributes: Record<string, string | boolean> = {},
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

export function createLinkedImage(
  tag: string,
  className: string,
  href: string,
  image: string,
): HTMLElement {
  const element = document.createElement(tag)
  element.className = className
  if (element && element instanceof HTMLImageElement) {
    element.src = image
  }
  const link = document.createElement('a')
  link.href = href
  link.append(element)
  return link
}

export function createLinkedElement(
  tag: string,
  className: string,
  href: string,
): HTMLElement {
  const element = document.createElement(tag)
  element.className = className
  const link = document.createElement('a')
  link.href = href
  link.append(element)
  return link
}
