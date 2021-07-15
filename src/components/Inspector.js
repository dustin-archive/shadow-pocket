
import { getState, dispatch } from 'app'
import { toggle } from 'stores/inspector'

function Tree (path, key, value) {
  const { inspector } = getState()
  const classList = inspector[path] ? '-tree -close' : '-tree'

  function click (event) {
    event.stopPropagation()
    dispatch(toggle, path)
  }

  return (
    <div class={classList} onclick={click}>
      {key}
      {value}
    </div>
  )
}

function Fn (value) {
  const lines = value.split('\n')

  let least = Infinity
  let result = lines[0].trim()

  for (let i = 1; i < lines.length; i++) {
    const space = lines[i].match(/^\s+/)
    const length = space ? space[0].length : Infinity

    length < least && (least = length)
  }

  for (let i = 1; i < lines.length; i++) {
    result += '\n' + lines[i].slice(least)
  }

  return (
    <span class='-function'>
      <span>{result}</span>
    </span>
  )
}

function Row (classList, key, value) {
  return (
    <div>
      {key}
      <span class={classList}>{value}</span>
    </div>
  )
}

function Type (path, value, key) {
  switch (typeof value) {
    case 'boolean':
      return Row('-boolean', key, value + '')
    case 'function':
      return Tree(path, key, Fn(value))
    case 'number':
      return Row('-number', key, value)
    case 'object':
      return value
        ? Tree(path, key, Both(path, value))
        : Row('-null', key)
    case 'string':
      return Row('-string', key, value)
    case 'undefined':
      return Row('-undefined', key, value)
  }
}

function Both (path, value) {
  const result = []

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      result[i] = Type(path + '.' + i, value[i])
    }

    return <span class='-array'>{result}</span>
  }

  const keys = Object.keys(value)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    result[i] = Type(
      path + '.' + key,
      value[key],
      <span class='-key'>{key}</span>
    )
  }

  return <span class='-object'>{result}</span>
}

export default function ({ path, value }) {
  return (
    <div class='component-inspector'>
      <span class='-key'>{path}</span>
      {Both(path, value)}
    </div>
  )
}
