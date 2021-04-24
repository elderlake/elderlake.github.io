const gun = GUN({ peers: ['http://localhost:8765/gun'] });
const user = gun.user().recall({ sessionStorage: true });

Vue.createApp({
  data() {
    return {
      name: "",
    }
  },
  methods: {
    logout() { user.leave(); },
  },
}).mount('#app')

gun.on("auth", () => {
  window.location.href = '../';
});

class UIHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header>
    <div class="logo">
      <div class="logo__mark">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="115.43335353820248 178.9554409959646 69.93737417894039 137.88958721264854" height="24">
          <path fill="#ffffff" d="M170.94 279.73L169.82 276.05L167.84 272.44L165.02 268.88L161.34 265.37L156.81 261.93L151.43 258.53L145.19 255.19L138.1 251.91L182.37 179.96L171.21 283.45L170.94 279.73Z"></path>
          <path fill="#ffffff" d="M128.62 251.6L132.11 252.64L135.58 253.92L138.88 255.24L141.81 256.45L143.59 257.2L145.33 258.02L147.01 258.92L148.65 259.88L150.25 260.91L151.79 262.02L153.29 263.19L154.74 264.43L156.15 265.74L157.02 266.64L157.79 266.76L120.38 313.85L116.43 260.1L116.7 260.14L116.77 256.17L117.83 253.36L119.71 251.67L122.25 250.93L125.27 250.97L128.62 251.6Z"></path>
        </svg>
      </div>
      <div class="logo__text">conveil</div>
    </div>

    <div class="header__right">
      <div class="select">
        <input type="text">
        <select>
          <option>People</option>
          <option>Conveil</option>
          <option>Web</option>
          <option>Music</option>
          <option>Video</option>
          <option>Images</option>
          <option>Games</option>
        </select>
      </div>
      <button>Search</button>
    </div>
  </header>`;
  }
}

class UINav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <ul class="left">
          <a href="../"><li>Home</li></a>
          <li>Browse People</li>
          <li>Find Friends</li>
          <li>Local</li>
          <li>Music</li>
          <li>Video</li>
          <li>Games</li>
          <li>Events</li>
          <li>More</li>
        </ul>

        <ul class="right">
          <ul>
            <a href="../" v-if="name"><li>My Account</li></a>
            <a href="../" v-else><li>Log In</li></a>
            <a @click="logout" v-if="name"><li>Log Out</li></a>
            <a href="./"><li>Sign Up</li></a>
          </ul>
        </ul>
      </nav>
    `;
  }
}

class UIFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer>
    <ul>
      <li>Help</li>
      <li>Terms</li>
      <li>Privacy Policy</li>
      <li>Safety Tips</li>
      <li>Advertise</li>
      <li>Developers</li>
    </ul>

    <ul>
      <li>Careers</li>
      <li>Press Room</li>
      <li>Music</li>
      <li>Video</li>
      <li>Sitemap</li>
    </ul>

    <span>©2021 Conveil.com. Made in USA.</span>
  </footer>`;
  }
}

customElements.define("ui-header", UIHeader);
customElements.define("ui-nav", UINav);
customElements.define("ui-footer", UIFooter);