
import { decode } from './router/query'

/**
 * Debounce helper using `window.requestAnimationFrame`
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
    render(state)
  })

  return result => {
    batch.push(result)
    schedule()
  }
}

/**
 * Minimalist state manager using actions and effects
 * @function manager
 */

const manager = (state, render) => {
  const push = collect(state, render)

  const dispatch = (action, ...data) => {
    const result = action(state, ...data)

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
 * An action that syncs router state with `window.location`
 * @function sync
 */

const sync = ({ router }, init) => {
  const search = location.search
  const pathname = location.pathname

  router.query = search.startsWith('?') ? decode(search) : {}

  for (let i = 0; i < init.rewrites.length; i++) {
    const rewrite = init.rewrites[i]

    if (typeof rewrite.source === 'function') {
      const result = rewrite.source()

      if (result === false || result == null) {
        continue
      }

      router.id = result
      router.to = rewrite.destination

      return { router }
    }

    const result = pathname.match(rewrite.source)

    if (result !== null) {
      router.id = result[0]
      router.to = rewrite.destination

      return { router }
    }
  }

  router.id = null
  router.to = pathname

  return { router }
}

/**
 * Apply route middleware to each page
 * @function middleware
 */

const middleware = (init, dispatch) => {
  const target = []

  return array => {
    array ??= []

    for (let i = 0; i < target.length; i++) {
      target[i](dispatch)
    }

    for (let i = 0; i < array.length; i++) {
      const item = init[array[i]]()

      item.onRoute(dispatch)
      target.push(item.onBeforeLeave)
    }
  }
}

/**
 * Apply route events to each page
 * @function routeEvents
 */

const routeEvents = dispatch => {
  let target

  return route => {
    if (typeof target === 'function') {
      target(dispatch)
    }

    if (typeof route.onRoute === 'function') {
      route.onRoute(dispatch)
    }

    target = route.onBeforeLeave
  }
}

/**
 * Initialize app instance
 * @module pocket
 */

export default (init, patch) => {
  let route

  init.state.router = {
    id: null,
    to: '/',
    query: {}
  }

  const { getState, dispatch } = manager(init.state, state => {
    patch(route.view(state, dispatch))
  })

  const applyMiddleware = middleware(init.middleware, dispatch)
  const applyRouteEvents = routeEvents(dispatch)

  const listener = () => {
    dispatch(sync, init)

    route = init.pages[init.state.router.to] || init.pages['/missing']

    applyMiddleware(route.middleware)
    applyRouteEvents(route)
  }

  listener()

  window.addEventListener('pushstate', listener)
  window.addEventListener('popstate', listener)

  return { getState, dispatch }
}
