
import cc from 'classcat'

export default props => {
  const list = cc([
    'ui-toggle',
    props.active && '-active'
  ])

  return (
    <button class={list} onclick={props.onClick}>
      <div></div>
    </button>
  )
}
