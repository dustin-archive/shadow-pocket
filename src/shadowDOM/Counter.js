
import { shadow } from 'pocket'
import { patch } from 'superfine'

import css from './_counter.txt'

const shadowComponent = shadow(patch)

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
    ref.vnode = <div key='counter'></div>
  )
}
