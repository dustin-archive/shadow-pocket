
import { dispatch } from 'app'
import Panel from 'components/Panel'

export default (props, children) => state => {
  return (
    <div class='layout-default'>
      <div class='layout-default-content'>
        <div>
          {children(state, dispatch)}
        </div>
      </div>
      <Panel/>
    </div>
  )
}
