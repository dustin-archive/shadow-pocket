
import Default from 'layouts/Default'

import pocket from 'pocket/core'
import { patch } from 'superfine'
import once from 'run-once'

const onMounted = once()

/**
 *
 * Future Pocket Functions
 *
 */

const shadowComponent = (ref, callback) => {
  onMounted(() => {
    const root = ref.vnode.node.attachShadow({ mode: 'open' })
    const div = document.createElement('div')
    root.appendChild(div)

    const context = init => pocket(init, view => patch(div, view))

    callback(context)
  })
}

/**
 *
 * Actions
 *
 */

const setState = (state, value) => {
  state.count = value
  return state
}

/**
 *
 * Components
 *
 */

const Counter = () => {
  const ref = { vnode: null }

  shadowComponent(ref, context => {
    context({
      state: {
        count: 0
      },
      view: (state, dispatch) => (
        <div>
          <h1 style='color: red;'>{state.count}</h1>
          <button onclick={() => dispatch(setState, state.count + 1)}>increment</button>
          <button onclick={() => dispatch(setState, state.count - 1)}>decrement</button>
        </div>
      )
    })
  })

  return (
    ref.vnode = <div class='page-home-shadow' key='shadow'></div>
  )
}

/**
 *
 * Main Export
 *
 */

const Home = (state, dispatch) => {
  return (
    <div class='page-home'>
      <div class='page-home-content'>
        <Counter/>
      </div>
    </div>
  )
}

export default {
  view: Default({ title: 'Home' }, Home),
  onRoute: () => {
    console.log('Home >> onRoute')
  },
  onBeforeLeave: () => {
    console.log('Home >> onBeforeLeave')
  }
}
