export default {
  name: 'Auth',
  data: () => {
    return {
      loading: false,
      email: '',
      password: '',
    }
  },
  methods: {
    signIn: function() {
      this.loading = true;

      firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(function(error) {
          this.loading = false;
          var errorCode = error.code;
          var errorMessage = error.message;
      });
    },
    register: function() {
      firebase.auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    },
  },
  template: `
    <div class="login">
      <div>
        <div class="logo">
          <div>
            <div></div>
            <div></div>
          </div>
          <div></div>
          <div></div>
        </div>
        <h1 class="login-header">Login</h1>
        <input type="text" placeholder="Email" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <button v-on:click="signIn">
          <div class="lds-circle" v-if="loading"><div></div></div>
          <span v-else>Sign In</span>
        </button>
        <!--<button v-on:click="register">Register</button>-->
      </div>
    </div>
  `,
}