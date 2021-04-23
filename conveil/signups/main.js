const gun = GUN({ peers: ['http://localhost:8765/gun'] });
const user = gun.user().recall({ sessionStorage: true });

let vm =Vue.createApp({
  data() {
    return {
      name: "",
      form: {
        email: "",
        password: "",
        name: "",
        m: "Month",
        d: "Day",
        y: "Year",
        gender: "Female",
      },
      resource: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: {"Month": 31, "January": 31, "February": 28, "March": 31, "April": 30, "May": 31, "June": 30, "July": 31, "August": 31, "September": 30, "October": 31, "November": 30, "December": 31},
        years: [2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970, 1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960, 1959, 1958, 1957, 1956, 1955, 1954, 1953, 1952, 1951, 1950, 1949, 1948, 1947, 1946, 1945, 1944, 1943, 1942, 1941, 1940, 1939, 1938, 1937, 1936, 1935, 1934, 1933, 1932, 1931, 1930, 1929, 1928, 1927, 1926, 1925, 1924, 1923, 1922, 1921],
      },
    }
  },
  methods: {
    register() {
      let email = this.form.email.toLowerCase();
      let password = this.form.password;
      let name = this.form.name;
      let birthday = `${this.form.m} ${this.form.d}, ${this.form.y} 12:00:00`;
      let gender = this.form.gender;

      console.log("Creating:", email, password, name, birthday, gender);

      user.create(email, password, (ack) => {
        console.log("Create ack:", ack);

        user.auth(email, password, (ack) => {
          console.log("Auth ack:", ack);

          SEA.encrypt(name, user._.sea).then((ename) => {
            SEA.encrypt(birthday, user._.sea).then((ebirthday) => {
              SEA.encrypt(gender, user._.sea).then((egender) => {
                user.get("profile").set({
                  name: ename,
                  birthday: ebirthday,
                  gender: egender,
                });
              });
            });
          });
        });
      });
    },
    logout() { user.leave(); },
  },
}).mount('#app')

gun.on("auth", () => {
  window.location.href = '../';
});