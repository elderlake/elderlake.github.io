class Todo {
  constructor(name) {
    this.name = name;
    this.complete = false;
  }
}

class View {
  constructor(name, selected = false) {
    this.name = name;
    this.complete = false;
    this.todos = [new Todo('')];
    this.selected = selected;
  }

  addTodo(uid, views, event) {
    let child = event.srcElement.parentNode;
    let parent = child.parentNode;
    let index = Array.prototype.indexOf.call(parent.children, child);
    
    this.todos.splice(index + 1, 0, new Todo(''));

    save(uid, views);

    setTimeout(() => {
      child.nextElementSibling.children[1].focus();
    }, 0);
  }

  removeTodo(uid, views, event) {
    let child = event.srcElement.parentNode;
    let parent = child.parentNode;
    let index = Array.prototype.indexOf.call(parent.children, child);
    let text = event.srcElement.value;

    if (text.length < 1 && index > 0) {
      event.preventDefault();

      this.todos.splice(index, 1);

      child.previousElementSibling.children[1].focus();
    }
  }
}

export default {
  name: 'Views',
  data() {
    return {
      title: getTitle(),
      views: [],
    }
  },
  computed: {
    uid() {
      return this.$store.state.user.uid;
    },
  },
  created() {
    var docRef = firebase.firestore().collection('users').doc(this.$store.state.user.uid);
    docRef.get().then((doc) => {
      this.views = createViews(doc.data().views);
    });
  },
  methods: {
    add: function(event) {
      let child = event.srcElement.parentNode;
      let index = getIndex(event);

      this.views.splice(index + 1, 0, new View(''));

      save(this.$store.state.user.uid, this.views);

      setTimeout(() => {
        child.nextElementSibling.children[1].focus();
        this.views[index].selected = false;
        this.views[index + 1].selected = true;
      }, 0);
    },
    remove: function(event) {
      let child = event.srcElement.parentNode;
      let index = getIndex(event);
      let text = event.srcElement.value;

      if (text.length < 1 && index > 0) {
        event.preventDefault();

        this.views.splice(index, 1);

        save(this.$store.state.user.uid, this.views);

        child.previousElementSibling.children[1].focus();
        this.views[index - 1].selected = true;
      }
    },
    change: function() {
      save(this.$store.state.user.uid, this.views);
    },
    changeTitle: function() {
      localStorage.setItem('title', this.title);
    },
    setActive: function(event) {
      this.views.find(view => view.selected === true).selected = false;
      this.views[getIndex(event)].selected = true;
    },
    signOut: function() {
      firebase.auth().signOut();
    },
  },
  template: `
    <div class="checklists">
      <div class='views'>
        <h1>
          <input type="text"
            v-model="title"
            v-on:input="changeTitle">
        </h1>
        <ul>
          <li v-for="view in views" v-bind:class="{ active: view.selected }">
            <input type="checkbox"
              v-model="view.complete"
              v-on:change="change">
            <input type="text"
              v-model="view.name"
              v-on:keyup.enter="add"
              v-on:keydown.backspace="remove"
              v-on:change="change"
              v-on:click="setActive">
          </li>
        </ul>
        <button v-on:click="signOut">Sign Out</button>
      </div>

      <div class="todos">
        <div v-for="view in views">
          <ul v-if="view.selected">
            <li v-for="todo in view.todos">
              <input type="checkbox"
                v-model="todo.complete"
                v-on:change="change">
              <input type="text"
                v-model="todo.name"
                v-on:keyup.enter="view.addTodo(uid, views, $event)"
                v-on:keydown.backspace="view.removeTodo(uid, views, $event)"
                v-on:change="change">
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
}

function getTitle() {
  let title = localStorage.getItem('title');

  if (title === null) {
    return 'New Project';
  }

  return title;
}

function createViews(views) {
  let finalViews = [];

  views.forEach((view, viewIndex) => {
    let finalView = new View(view.name);
    finalView.complete = view.complete;

    if (viewIndex === 0) {
      finalView.selected = true;
    }

    view.todos.forEach((todo, todoIndex) => {
      if (todoIndex === 0) {
        finalView.todos[todoIndex].name = todo.name;
        finalView.todos[todoIndex].complete = todo.complete;
      } else {
        finalView.todos.push(new Todo(todo.name));
        finalView.todos[todoIndex].complete = todo.complete;
      }
    });

    finalViews.push(finalView);
  });

  return finalViews;
}

function getIndex(event) {
  let child = event.srcElement.parentNode;
  let parent = child.parentNode;
  let index = Array.prototype.indexOf.call(parent.children, child);

  return index;
}

function save(uid, views) {
  var db = firebase.firestore();
  db.collection('users').doc(uid).set({
    views: JSON.parse(JSON.stringify(views)),
  });
}