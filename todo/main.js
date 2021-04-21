const gun = GUN({ peers: ['https://elderlake.herokuapp.com/gun'] });
const user = gun.user().recall({ sessionStorage: true });

const vm = new ViewModel({
  data: {
    displayName: "",
    alias: "",
    password: "",
    content: "",
    todos: [],
  },
  methods: {
    // ? Authentication
    register() {
      user.create(this.alias.toLowerCase(), this.password);
      this.clear();
    },
    login() {
      user.auth(this.alias.toLowerCase(), this.password);
      this.clear();
    },
    logout() {
      user.leave();
      this.clear();
    },

    // * CRUD App
    create() {
      if (this.content.trim() === "") { return; }

      // TODO: Ask for permission to write to the person's app access point.

      SEA.encrypt(this.content, user._.sea)
      .then((content) => {
        SEA.encrypt(false, user._.sea)
        .then((done) => {
          SEA.encrypt(Date.now(), user._.sea)
          .then((timestamp) => {
            user.get("todos").set({
              content: content,
              done: done,
              timestamp: timestamp,
            });
            this.content = "";
          })
        })
      });
    },
    read() {
      // TODO: Ask for permission to read from the person's app access point.

      user.get("todos").map().on((todo, key) => {
        if (!todo) {
          for (let i = 0; i < this.todos.length; i++) {
            if (this.todos[i].key === key) {
              this.todos.splice(i, 1);
            }
          }

          this.refresh();
          return;
        }
        
        // TODO: Fix duplicate todos showing when adding a new one
        SEA.decrypt(todo.content, user._.sea)
        .then((content) => {
          SEA.decrypt(todo.done, user._.sea)
          .then((done) => {
            SEA.decrypt(todo.timestamp, user._.sea)
            .then((timestamp) => {
              if (this.existsInArray("todos", todo, "match")) { return; }

              this.todos.push({
                match: todo,
                todo: {
                  content: content,
                  done: done,
                  timestamp: timestamp,
                },
                key: key,
              });

              user.get("todos").get(key).get("done").on((data) => {
                this.todos.forEach((item, i) => {
                  if (item.key === key) {
                    SEA.decrypt(data, user._.sea)
                    .then((done) => {
                      this.todos[i].todo.done = done;
                      this.refresh();
                    });
                  }
                });
              });
    
              user.get("todos").get(key).get("content").on((data) => {
                this.todos.forEach((item, i) => {
                  if (item.key === key) {
                    SEA.decrypt(data, user._.sea)
                    .then((content) => {
                      this.todos[i].todo.content = content;
                      this.refresh();
                    });
                  }
                });
              });

              this.refresh();
            })
          })
        });
      });
    },
    update(key, sub, value) {
      SEA.encrypt(value, user._.sea)
      .then((enc) => {
        user.get("todos").get(key).get(sub).put(enc);
      });
    },
    delete(key) {
      user.get("todos").get(key).put(null);
    },

    // ! UI Rendering Helpers
    refresh() {
      this.refreshList("todos", (item) => {
        let li = this.createElement("li");
        li.classList.add("todoitem");
  
        let div = this.createElement("div", {}, li);
  
        let input = this.createElement("input", {
          type: "checkbox",
          checked: item.todo.done,
        }, div);
  
        let span = this.createElement("span", {
          textContent: item.todo.content,
          contentEditable: true,
        }, div);
  
        let button = this.createElement("button", {
          textContent: "Delete",
        }, li);
  
        // Update the todo when the checkbox changes.
        input.onchange = (e) => {
          this.update(item.key, "done", e.target.checked);
        }
  
        // Update the todo when the content changes.
        span.onblur = (e) => {
          this.update(item.key, "content", e.target.textContent);
        }
  
        button.onclick = () => { this.delete(item.key); }
  
        return li;
      });
    },
    clear() {
      // Reset the data and UI.
      this.displayName = "";
      this.alias = "";
      this.password = "";
      this.content = "";
      this.todos.length = 0;
      this.removeAllChildNodes(this.$refs.todos);
    },
  },
}).mount("#app");

vm.$refs.password.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) { vm.login(vm.alias, vm.password); }
});

gun.on("auth", () => {
  user.once((u) => {
    vm.displayName = u.alias[0].toUpperCase() + u.alias.slice(1, u.alias.length)
  });

  vm.$refs.new.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) { vm.create(); }
  });

  vm.read();
});