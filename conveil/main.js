const gun = GUN({ peers: ['http://localhost:8765/gun', 'https://elderlake.herokuapp.com/gun'] });
const user = gun.user().recall({ sessionStorage: true });

let vm =Vue.createApp({
  data() {
    return {
      name: "",
      form: {
        email: "",
        password: "",
        remember: false,
      },
    }
  },
  methods: {
    login() { user.auth(this.alias.toLowerCase(), this.password); },
    logout() { user.leave(); },
  },
}).mount('#app')

gun.on("auth", () => {
  user.once((u) => {
    vm.name = u.alias[0].toUpperCase() + u.alias.slice(1, u.alias.length)
  });
});