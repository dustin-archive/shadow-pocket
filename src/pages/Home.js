
import Default from 'layouts/Default'
import Counter from 'shadowDOM/Counter'

const Home = (state, dispatch) => {
  setTimeout(() => {
    dispatch(state => {
      return {
        foo: (state.foo ?? 0) + 1
      }
    })
  }, 2000)

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
