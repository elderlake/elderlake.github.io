import Wrapper from './components/Wrapper.js';

const store = new Vuex.Store({
  state: {
    loading: true,
    authenticated: false,
    user: null,
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    authenticate(state, value) {
      state.authenticated = value;
    },
    setUser(state, value) {
      state.user = value;
    },
  },
});

new Vue({
  store,
  render: h => h(Wrapper),
}).$mount('#app');