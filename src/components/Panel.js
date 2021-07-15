
import cc from 'classcat'

import { getState, dispatch } from 'app'
import * as $common from 'stores/common'
import * as $panel from 'stores/panel'

import css from 'modules/css-concat'
import once from 'modules/run-once'

import Inspector from 'components/Inspector'

import Toggle from 'ui/Toggle'

const onMounted = once()

/**
 *
 * Event Handlers
 *
 */

const dragStart = event => {
  const rect = event.target.getBoundingClientRect()

  dispatch($panel.setOffset, [
    event.offsetX ?? event.touches[0].clientX - rect.left,
    event.offsetY ?? event.touches[0].clientY - rect.top
  ])
}

const dragEnd = event => {
  dispatch($panel.setPosition, [
    event.clientX ?? event.changedTouches[0].clientX,
    event.clientY ?? event.changedTouches[0].clientY
  ])
}

const togglePanel = () => {
  dispatch($panel.toggle)
}

const toggleBanner = () => {
  dispatch($common.toggle, 'banner')
}

const toggleSidebar = () => {
  dispatch($common.toggle, 'sidebar')
}

const setStore = event => {
  dispatch($panel.setStore, event.target.value)
}

/**
 *
 * Components
 *
 */

const Setting = props => {
  return (
    <div>
      <span>{props.label}</span>
      <Toggle active={props.active} onClick={props.onClick}/>
    </div>
  )
}

const Selector = props => {
  const state = props.state
  const store = state.panel.store

  const options = Object.keys(state).map(key => (
    <option selected={key === store}>{key}</option>
  ))

  return (
    <div class='component-panel-inspector'>
      <select onchange={setStore}>
        {options}
      </select>
      <div>
        <Inspector path={store} value={state[store]}/>
      </div>
    </div>
  )
}

/**
 *
 * Main Export
 *
 */

export default props => {
  const state = getState()
  const { common, panel } = state

  const ref = { vnode: null }
  const [x, y] = panel.position

  const style = css({
    '--height': panel.height,
    'top': y + 'px',
    'left': x + 'px'
  })

  const panelClass = cc([
    'component-panel',
    panel.active && '-active'
  ])

  const contentClass = cc([
    'component-panel-content',
    panel.active && '-active'
  ])

  onMounted(() => {
    const height = ref.vnode.node.offsetHeight
    dispatch($panel.setHeight, height + 'px')
  })

  const dragEvents = {
    ondragstart: dragStart,
    ondragend: dragEnd,
    ontouchstart: dragStart,
    ontouchend: dragEnd
  }

  return (
    ref.vnode = <div class={panelClass} style={style}>
      <div class='component-panel-titlebar' draggable='true' {...dragEvents}>
        <div></div>
        <h1>Developer Panel</h1>
        <button alt='Toggle Developer Panel' onclick={togglePanel}></button>
      </div>
      <div class={contentClass}>
        <div class='component-panel-settings'>
          <Setting
            label='Toggle Banner'
            active={common.banner}
            onClick={toggleBanner}
          />
          <hr/>
          <Setting
            label='Toggle Sidebar'
            active={common.sidebar}
            onClick={toggleSidebar}
          />
          <hr/>
        </div>
        <div class='component-panel-palette'>
          <div>
            <div class='-red'></div>
            <div class='-orange'></div>
            <div class='-yellow'></div>
            <div class='-green'></div>
            <div class='-blue'></div>
            <div class='-purple'></div>
          </div>
          <div>
            <div class='-dark-600'></div>
            <div class='-dark-500'></div>
            <div class='-dark-400'></div>
            <div class='-dark-300'></div>
            <div class='-dark-200'></div>
            <div class='-dark-100'></div>
          </div>
          <div>
            <div class='-light-600'></div>
            <div class='-light-500'></div>
            <div class='-light-400'></div>
            <div class='-light-300'></div>
            <div class='-light-200'></div>
            <div class='-light-100'></div>
          </div>
        </div>
        <Selector state={state}/>
      </div>
    </div>
  )
}
