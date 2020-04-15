export default {
  name: 'Auth',
  data: () => {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    signIn: function() {
      firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(function(error) {
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
    <div>
      <input type="text" placeholder="Email" v-model="email">
      <input type="password" placeholder="Password" v-model="password">
      <button v-on:click="signIn">Sign In</button>
      <button v-on:click="register">Register</button>
    </div>
  `,
}