
export default () => {
  const storage = []
  let lock = false

  const handler = () => {
    lock = true

    for (let i = 0; i < storage.length; i++) {
      storage[i]()
    }
  }

  return fn => {
    storage.push(fn)

    if (!lock) {
      window.requestAnimationFrame(handler)
    }
  }
}
