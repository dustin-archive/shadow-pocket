
import core from './core'
import { decode } from './router/query'

/**
 * An action that syncs router state with `window.location`
 * @function sync
 */

const sync = ({ router }, rewrites) => {
  const search = location.search
  const pathname = location.pathname

  router.query = search.startsWith('?') ? decode(search) : {}

  if (FF_ROUTE_REWRITES) {
    for (let i = 0; i < rewrites.length; i++) {
      const rewrite = rewrites[i]

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
  }

  router.id = null
  router.to = pathname

  return { router }
}

/**
 * Apply route middleware to each page
 * @function compile
 */

const compile = (init, dispatch) => {
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

export default ({ state, pages, rewrites, middleware }, patch) => {
  let route

  state.router = {
    id: null,
    to: '/',
    query: {}
  }

  const view = (state, dispatch) => route.view(state, dispatch)
  const target = core({ state, view }, patch)

  const applyMiddleware = /* @__PURE__ */ compile(middleware, target.dispatch)
  const applyRouteEvents = /* @__PURE__ */ routeEvents(target.dispatch)

  const listener = () => {
    target.dispatch(sync, rewrites)

    route = pages[state.router.to] || pages['/missing']

    FF_ROUTE_MIDDLEWARE && applyMiddleware(route.middleware)
    FF_ROUTE_EVENTS && applyRouteEvents(route)
  }

  listener()

  window.addEventListener('pushstate', listener)
  window.addEventListener('popstate', listener)

  return target
}
