
import Panel from 'components/Panel'

export default (props, children) => (state, dispatch) => {
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
