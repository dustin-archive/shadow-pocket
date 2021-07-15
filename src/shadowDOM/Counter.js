
import pocket from 'pocket/core'
import { patch } from 'superfine'
import once from 'run-once'

import css from './_counter.txt'

const onMounted = once()

/**
 *
 * Future Pocket Functions
 *
 */

const shadowComponent = (ref, context) => {
  onMounted(() => {
    const root = ref.vnode.node.attachShadow({ mode: 'closed' })
    const div = document.createElement('div')

    root.appendChild(div)

    context(init => pocket(init, view => patch(div, view)))
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

export default props => {
  const ref = { vnode: null }

  shadowComponent(ref, context => {
    context({
      state: {
        count: 0
      },
      view: (state, dispatch) => (
        <div>
          <style key='style'>{css}</style>
          <h1>{state.count}</h1>
          <div>{JSON.stringify(props.panel)}</div>
          <button onclick={() => dispatch(setState, state.count + 1)}>increment</button>
          <button onclick={() => dispatch(setState, state.count - 1)}>decrement</button>
        </div>
      )
    })
  })

  return (
    ref.vnode = <div key='Counter'></div>
  )
}
