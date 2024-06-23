export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  className = '',
  content = '',
  id?: string,
  attributes: Record<string, string | boolean> = {},
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (content && tag !== 'input' && tag !== 'textarea') {
    element.textContent = content;
  }

  if (id) {
    element.id = id;
  }

  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key].toString());
  });

  return element;
}

export function createLinkedElement(
  tag: string,
  className: string,
  href: string,
  imageSrc?: string,
): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;

  if (imageSrc && element instanceof HTMLImageElement) {
    element.src = imageSrc;
  }

  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.append(element);

  return link;
}
