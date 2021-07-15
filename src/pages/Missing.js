
const Missing = (state, dispatch) => {
  return (
    <div class='missing'>
      <div>404 Not Found</div>
    </div>
  )
}

export default {
  view: Missing,
  onRoute: () => {
    console.log('Missing >> onRoute')
  },
  onBeforeLeave: () => {
    console.log('Missing >> onBeforeLeave')
  }
}
