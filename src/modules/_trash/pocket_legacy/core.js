
/**
 * Debounce helper for renders
 * @function enqueue
 */

const enqueue = render => {
  let lock = false

  const callback = () => {
    lock = false
    render()
  }

  return () => {
    if (!lock) {
      lock = true
      window.requestAnimationFrame(callback)
    }
  }
}

/**
 * Collect state changes for batched updates
 * @function collect
 */

const collect = (state, render) => {
  let batch = [state]

  const schedule = enqueue(() => {
    Object.assign.apply(Object, batch)
    batch = [state]
    render()
  })

  schedule()

  return result => {
    batch.push(result)
    schedule()
  }
}

/**
 * Minimalist state manager with actions and effects
 * @function manager
 */

const manager = (state, render) => {
  const push = collect(state, render)

  const dispatch = (action, data) => {
    const result = action(state, data)

    console.log(
      'Dispatch >>',
      action.name || '(anon)',
      typeof result === 'function' ? '(effect)' : JSON.stringify(result, null, 2)
    )

    if (typeof result === 'function') {
      const effect = result(dispatch)

      if (effect && effect.then) {
        return effect.then(push)
      }
    } else {
      push(result)
    }
  }

  return {
    getState: () => state,
    dispatch
  }
}

/**
 * Initialize app instance
 * @module core
 */

export default ({ state, view }, patch) => {
  const target = manager(state, () => {
    patch(view(state, target.dispatch))
  })

  return target
}
