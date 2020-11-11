export default ({ $axios, store }, inject) => {
    $axios.interceptors.response.use(
      response => {
        if (response.status === 200 && response.request.responseURL.indexOf('/login') !== -1) {
          store.dispatch('setUser', response.data.user)
        }
  
        return response
      }
    )
    const api = apiFactory($axios)
    inject('api', api)
  }