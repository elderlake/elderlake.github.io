const gun = GUN({ peers: ['http://localhost:8765/gun', 'https://elderlake.herokuapp.com/gun'] });
const user = gun.user().recall({ sessionStorage: true });

let vm = Vue.createApp({
  data() {
    return {
      name: "",
      form: {
        email: "",
        password: "",
        remember: false,
      },
      profile: {
        tagline: "has joined Conveil!",
        mood: "good 🙂",
        photo: "",
      }
    }
  },
  methods: {
    login() {
      let email = this.form.email.toLowerCase();
      let password = this.form.password;

      user.auth(email, password, (ack) => {
        console.log("Auth ack:", ack);
      });
    },
    logout() { user.leave(); this.name = ""; },
  },
}).mount('#app')

gun.on("auth", () => {
  user.get("profile").map().once((u) => {
    SEA.decrypt(u.name, user._.sea).then((name) => {
      vm.name = name;
    });
  });
});