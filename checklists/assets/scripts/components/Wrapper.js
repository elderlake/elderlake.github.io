import Home from './Home.js';
import Auth from './Auth.js';

export default {
  name: 'Wrapper',
  components: {
    Home,
    Auth,
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    authenticated() {
      return this.$store.state.authenticated;
    },
  },
  created: function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('authenticate', true);
        this.$store.commit('setUser', {
          uid: user.uid,
        });
        this.$store.commit('setLoading', false);
      } else {
        this.$store.commit('authenticate', false);
        this.$store.commit('setLoading', false);
      }
    });
  },
  template: `
    <div v-if="loading" class="loader">
      <div class="lds-ripple"><div></div><div></div></div>
    </div>
    <home v-else-if="authenticated"></home>
    <auth v-else></auth>
  `,
};