
import { pocket } from 'pocket/index'
import { patch } from 'superfine'

import * as common from 'stores/common'
import * as inspector from 'stores/inspector'
import * as panel from 'stores/panel'

import Home from 'pages/Home'
import Missing from 'pages/Missing'

/**
 *
 * Initialize
 *
 */

const node = document.getElementById('app')
const app = init => pocket(init, view => patch(node, view))

export const { getState, dispatch } = app({
  state: {
    common: common.state,
    inspector: inspector.state,
    panel: panel.state
  },
  middleware: {
    common: () => {
      return {
        onRoute: () => {},
        onBeforeLeave: () => {}
      }
    }
  },
  pages: {
    '/': Home,
    '/missing': Missing
  },
  rewrites: []
})
