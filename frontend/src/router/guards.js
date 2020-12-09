import store from '@/store'

export default {
  beforeEach (to, from, next) {
    const user = store.getters.user
    const loggedIn = (user !== null)

    if (to.matched.some(record => record.meta.requiresRole)) {
      if (!loggedIn) {
        next({ path: '/login' })
      } else if (Math.max(to.matched.map(r => r.meta.requiresRole)) > user.role) {
        next({ path: '/' })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.notLoggedIn)) {
      if (loggedIn) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
}
