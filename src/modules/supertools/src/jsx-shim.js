
import { node, text } from './virtual-nodes'

/**
 *
 * JSX pragma derived from:
 * https://github.com/zaceno/hyperapp-jsx-pragma/blob/main/index.js
 *
 * Learn how to setup JSX with esbuild here:
 * https://esbuild.github.io/content-types/#jsx
 *
 */

export const jsx = (type, props, ...children) => {
  props ??= {}

  if (typeof type === 'function') {
    return type(props, children.flat(Infinity))
  }

  if (process.env.STATIC) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      children[i] = Array.isArray(child)
        ? child[0]
        : text(child)
    }

    return [
      node(type, props, children)
    ]
  }

  children = children.flat(Infinity)

  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    children[i] = typeof child === 'string' || typeof child === 'number'
      ? text(child)
      : child
  }

  return node(type, props, children)
}
