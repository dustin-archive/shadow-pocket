
import cc from 'classcat'
import { link } from 'pocket/index'

export default (props, content) => {
  const classList = cc([
    'ui-link',
    props.icon ?? '-no-icon',
    props.to === location.pathname && '-active',
    props.class
  ])

  const to = event => {
    event.preventDefault()

    link({
      to: props.to,
      query: props.query
    })
  }

  return (
    <a class={classList} href={props.to} onclick={to}>
      <span>{content}</span>
    </a>
  )
}
