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

function getGames () {
  let gamesElement = document.querySelector('#games')

  loadJSON('games.json', (response) => {
    let games = JSON.parse(response).games

    games.forEach((game, gameIndex) => {
      let thisGame = createElement({
        tag: 'div',
        classList: ['card'],
        children: [{
          tag: 'div',
          classList: ['card__image'],
          children: [{
            tag: 'img',
            src: game.image
          }]
        }, {
          tag: 'div',
          classList: ['card__level'],
          textContent: game.category
        }, {
          tag: 'div',
          classList: ['card__unit-name'],
          textContent: game.title
        }, {
          tag: 'div',
          classList: ['card__unit-description'],
          innerHTML: game.description + ' <a href=\'./' + game.title.toLowerCase().replace(' ', '-') + '/\'><button>Play</button></a>'
        }, {
          tag: 'div',
          classList: ['card__unit-stats', 'clearfix'],
          children: [{
            tag: 'div',
            classList: ['one-third'],
            children: [{
              tag: 'div',
              classList: ['stat'],
              textContent: game.details.hours
            }, {
              tag: 'div',
              classList: ['stat-value'],
              textContent: 'Hours'
            }]
          }, {
            tag: 'div',
            classList: ['one-third'],
            children: [{
              tag: 'div',
              classList: ['stat'],
              textContent: (game.details.price == 0) ? "FREE" : game.details.price.toString()
            }, {
              tag: 'div',
              classList: ['stat-value'],
              textContent: 'Price'
            }]
          }, {
            tag: 'div',
            classList: ['one-third', 'no-border'],
            children: [{
              tag: 'div',
              classList: ['stat'],
              textContent: game.details.date.split(' ')[0]
            }, {
              tag: 'div',
              classList: ['stat-value'],
              textContent: game.details.date.split(' ')[1]
            }]
          }]
        }]
      })

      gamesElement.appendChild(thisGame)
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