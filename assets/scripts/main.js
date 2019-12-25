const header = document.querySelector('#header')
const mastheadText = document.querySelector('#masthead-text')
const mastheadInfo = document.querySelector('#masthead-info')

window.addEventListener('scroll', (event) => {
  let offset = 24

  let actualOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  let textHeight = 160
  let infoHeight = 320
  let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

  if (width > 800) {
    mastheadText.style.opacity = 1 - (actualOffset / textHeight)
    mastheadInfo.style.opacity = 1 - (actualOffset / infoHeight)
  } else {
    mastheadText.style.opacity = 1
    mastheadInfo.style.opacity = 1
  }

  if (window.pageYOffset >= offset || document.documentElement.scrollTop >= offset || document.body.scrollTop >= offset) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})
