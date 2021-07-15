
const key = 'pocket-inspector-state'
const json = sessionStorage.getItem(key)

export const state = JSON.parse(json) ?? {}

export const toggle = ({ inspector }, key) => {
  inspector[key] = !inspector[key]

  const json = JSON.stringify(inspector)
  sessionStorage.setItem(key, json)

  return { inspector }
}
