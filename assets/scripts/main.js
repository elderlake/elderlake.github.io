function loadJSON(filename, callback) {   
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', filename, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

function loadHomepage () {
  getGames('games')
  getNews()
}

function getGames (folder) {
  let gamesElement = document.querySelector('#games')

  loadJSON('games.json', (response) => {
    let games = JSON.parse(response).games

    games.forEach((game, gameIndex) => {
      let link = createElement({
        tag: 'a',
        href: (folder) ? './' + folder + '/' + game.title.toLowerCase().replace(' ', '-') : './' + game.title.toLowerCase().replace(' ', '-')
      })

      let thisGame = createElement({
        tag: 'div',
        classList: ['featured'],
        parent: link
      })

      let photoContainer = createElement({
        tag: 'div',
        classList: ['photo'],
        parent: thisGame
      })

      let photoBottom = createElement({
        tag: 'img',
        classList: ['bottom'],
        src: game.image,
        parent: photoContainer
      })

      let photoTop = createElement({
        tag: 'img',
        classList: ['top'],
        src: game.image,
        parent: photoContainer
      })

      let info = createElement({
        tag: 'div',
        classList: ['info'],
        children: [{
          tag: 'h3',
          textContent: game.title
        }],
        parent: thisGame
      })

      let release = createElement({
        tag: 'div',
        classList: ['release'],
        textContent: 'Game of the Week',
        parent: info
      })

      let screenshots = createElement({
        tag: 'div',
        classList: ['screenshots'],
        parent: info
      })

      game.screenshots.forEach((screenshot, screenshotIndex) => {
        let thisScreenshot = createElement({
          tag: 'img',
          src: screenshot
        })
        
        thisScreenshot.addEventListener('mouseenter', () => {
          photoTop.classList.add('hidden')
          photoBottom.src = thisScreenshot.src
        })

        thisScreenshot.addEventListener('mouseleave', () => {
          photoTop.classList.remove('hidden')
        })

        screenshots.appendChild(thisScreenshot)
      })

      let details = createElement({
        tag: 'div',
        classList: ['details'],
        children: [{
          tag: 'div',
          classList: ['price'],
          textContent: (game.details.price == 0) ? "FREE" : game.details.price.toString()
        }, {
          tag: 'div',
          classList: ['platforms'],
          children: [{
            tag: 'i',
            classList: ['fab', 'fa-html5']
          }]
        }],
        parent: info
      })

      gamesElement.appendChild(link)
    })
  })
}

function getNews () {
  var newsElement = document.querySelector('#news')

  loadJSON('news.json', (response) => {
    var articles = JSON.parse(response).articles

    articles.forEach((article, articleIndex) => {
      let thisArticle = createElement({
        tag: 'article',
        children: [{
          tag: 'div',
          classList: ['image'],
          children: [{
            tag: 'img',
            src: article.image
          }]
        }, {
          tag: 'div',
          classList: ['content'],
          children: [{
            tag: 'header',
            classList: ['title'],
            children: [{
              tag: 'h3',
              textContent: article.title
            }]
          }, {
            tag: 'section',
            classList: ['details'],
            children: [{
              tag: 'span',
              classList: ['category'],
              textContent: article.details.category
            }, {
              tag: 'span',
              classList: ['date'],
              textContent: article.details.date
            }]
          }, {
            tag: 'main',
            children: [{
              tag: 'p',
              innerHTML: article.content + ' <a href=\'#\'>Continue...</a>'
            }]
          }]
        }]
      })

      newsElement.appendChild(thisArticle)
    })
  })
}

function createElement (configuration) {
  let thisElement = document.createElement(configuration.tag)

  checkOptions(thisElement, configuration)

  return thisElement
}

function createChildren (parentElement, child) {
  let childElement = document.createElement(child.tag)

  parentElement.appendChild(childElement)

  checkOptions(childElement, child)
}

function checkOptions (thisElement, configuration) {
  if (configuration.id) {
    thisElement.id = configuration.id
  }

  if (configuration.classList) {
    configuration.classList.forEach((className, classNameIndex) => {
      thisElement.classList.add(className)
    })
  }

  if (configuration.type) {
    thisElement.type = configuration.type
  }

  if (configuration.placeholder) {
    thisElement.placeholder = configuration.placeholder
  }

  if (configuration.href) {
    thisElement.href = configuration.href
  }

  if (configuration.value) {
    thisElement.value = configuration.value
  }

  if (configuration.textContent) {
    thisElement.textContent = configuration.textContent
  }

  if (configuration.innerHTML) {
    thisElement.innerHTML = configuration.innerHTML
  }

  if (configuration.src) {
    thisElement.src = configuration.src
  }

  if (configuration.parent) {
    configuration.parent.appendChild(thisElement)
  }

  if (configuration.children) {
    configuration.children.forEach((child, childIndex) => {
      createChildren(thisElement, child)
    })
  }
}