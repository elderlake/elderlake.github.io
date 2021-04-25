const gun = GUN({ peers: ['http://localhost:8765/gun'] });
const user = gun.user().recall({ sessionStorage: true });

let vm = Vue.createApp({
  data() {
    return {
      name: "",
      form: {
        firstName: "",
        lastName: "",
      },
    }
  },
  methods: {
    logout() { user.leave(); },
  },
}).mount('#app')

gun.on("auth", () => {
  user.get("profile").map().once((u) => {
    SEA.decrypt(u.name, user._.sea).then((name) => {
      vm.name = name;
      vm.form.firstName = name.split(" ")[0];
      vm.form.lastName = name.split(" ")[1];
    });
  });
});