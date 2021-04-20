// ? HAL (Hypermedia Application Library)
// ? A lightweight JavaScript library.
// * Declarative rendering using {{ handlebar }} syntax.
// * Conditional rendering.
// * Two-way data binding.
// * Click event handlers.

class ViewModel {
  constructor(opt) {
    this.$data = opt.data || {};
    this.$methods = opt.methods || {};
    this.$refs = {};

    // Data hooks
    Object.keys(this.$data).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => { return this.$data[key]; },
        set: (value) => {
          this.$data[key] = value;
          this.render(key);
        },
      });
    });

    // Method hooks
    Object.keys(opt.methods).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => { return opt.methods[key].bind(this); },
      });
    });
  }

  mount(query) {
    // Data and method binding
    this.$query = query;

    let root = document.querySelector(this.$query);
    let elements = root.getElementsByTagName("*");

    for (let i = 0; i < elements.length; i++) {
      let el = elements[i];

      if (el.hasAttribute("data-ref")) {
        this.$refs[el.getAttribute("data-ref")] = el;
      }

      // Replace handlebar tags with elements bound to data.
      el.innerHTML = el.innerHTML.replace(/{{\W*[A-z]+\W*}}/g, (handle) => {
        return `<span data-halk="${handle.match(/[A-z]+/)[0]}"></span>`;
      });
      
      // Bind data to input element using an "input" event listener.
      let key = el.getAttribute("data-halk");
      if (key && el.tagName === "INPUT") {
        el.addEventListener("input", () => { this[key] = el.value; })
      }
    }

    // Render data to UI for the first time.
    Object.keys(this.$data).forEach((key) => { this.render(key) });

    // Return the root class instance to enable chained functions.
    return this;
  }

  render(key) {
    let root = document.querySelector(this.$query);
    let elements = root.getElementsByTagName("*");

    for (let i = 0; i < elements.length; i++) {
      let el = elements[i];

      // Update any elements that are bound to this data key.
      if (el.getAttribute("data-halk") === key) {
        if (el.tagName === "INPUT") { el.value = this[key]; }
        else { el.textContent = this[key]; }
      }

      // Update conditionally displayed elements bound to this data key.
      if (el.hasAttribute("data-if")) {
        let keys = el.getAttribute("data-if").split(".");
        let data = this;

        for (let i = 0; i < keys.length; i++) { data = data[keys[i]]; }

        if (data) { el.style.display = "initial"; }
        else { el.style.display = "none"; } 

        if (el.nextElementSibling.hasAttribute("data-else")) {
          if (data) { el.nextElementSibling.style.display = "none"; }
          else { el.nextElementSibling.style.display = "initial"; }
        }
      }
    }
  }

  // Helper function to remove all child nodes from an element.
  removeAllChildNodes(parent) {
    while (parent.firstChild) { parent.removeChild(parent.firstChild); }
  }

  // Helper function to check if two objects are identical.
  isEquivalent(a, b) {
    let ap = Object.getOwnPropertyNames(a);
    let bp = Object.getOwnPropertyNames(b);

    if (ap.length != bp.length) { return false; }

    for (let i = 0; i < ap.length; i++) {
      if (a[ap[i]] !== b[ap[i]]) { return false; }
    }

    return true;
  }

  // Helper function to check if an object exists inside of an array.
  existsInArray(key, item, sub) {
    for (let i = 0; i < this[key].length; i++) {
      if (sub && this.isEquivalent(this[key][i][sub], item)) { return true; }
      if (this.isEquivalent(this[key][i], item)) { return true; }
    }

    return false;
  }

  createElement(tagName, options, parentElement) {
    let element = document.createElement(tagName);
    if (options) {
      Object.keys(options).forEach((key) => { element[key] = options[key]; });
    }
    if (parentElement) { parentElement.appendChild(element); }
    return element;
  }

  refreshList(list, cb) {
    this.removeAllChildNodes(this.$refs[list]);
    this[list].forEach((item) => {
      let node = cb(item);
      this.$refs[list].appendChild(node);
    });
  }
}