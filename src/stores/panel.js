
const key = 'pocket-panel'
const json = sessionStorage.getItem(key)
const { position, store } = JSON.parse(json) ?? {}

const init = () => ({
  active: true,
  height: 'auto',
  offset: [0, 0],
  position: position ?? [100, 100],
  store: store ?? 'common'
})

export const state = init()

/**
 *
 * Helpers
 *
 */

const setItem = value => {
  const key = 'pocket-panel'
  sessionStorage.setItem(key, JSON.stringify(value))
}

const assignStorage = data => {
  const json = sessionStorage.getItem(key)

  if (json === null) {
    setItem(data)
    return // early exit
  }

  setItem(Object.assign(JSON.parse(json), data))
}

/**
 *
 * Actions
 *
 */

export const reset = () => {
  return init()
}

export const toggle = ({ panel }) => {
  panel.active = !panel.active
  return { panel }
}

export const setHeight = ({ panel }, value) => {
  panel.height = value
  return { panel }
}

export const setOffset = ({ panel }, value) => {
  panel.offset = value
  return { panel }
}

export const setPosition = ({ panel }, value) => {
  const [positionX, positionY] = value
  const [offsetX, offsetY] = panel.offset

  panel.position = [
    positionX - offsetX,
    positionY - offsetY
  ]

  assignStorage({
    position: panel.position
  })

  return { panel }
}

export const setStore = ({ panel }, value) => {
  panel.store = value

  assignStorage({
    store: panel.store
  })

  return { panel }
}
