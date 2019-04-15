const game = new ex.Engine({
  width: 800,
  height: 600,
  canvasElementId: 'canvas'
})

let paddle = new ex.Actor(150, game.drawHeight - 40, 200, 20)

paddle.color = ex.Color.Chartreuse
paddle.collisionType = ex.CollisionType.Fixed

game.add(paddle)

game.input.pointers.primary.on('move', function (event) {
  paddle.pos.x = event.worldPos.x
})

let ball = new ex.Actor(100, 300, 20, 20)

ball.color = ex.Color.Red
ball.vel.setTo(100, 100)
ball.collisionType = ex.CollisionType.Passive

ball.on('precollision', function (event) {
  if (bricks.indexOf(event.other) > -1) {
    event.other.kill()
  }

  let intersection = event.intersection.normalize()

  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    ball.vel.x *= -1
  } else {
    ball.vel.y *= -1
  }
})

ball.on('postupdate', function () {
  if (this.pos.x < this.getWidth() / 2) {
    this.vel.x *= -1
  }

  if (this.pos.x + this.getWidth() / 2 > game.drawWidth) {
    this.vel.x *= -1
  }

  if (this.pos.y < this.getHeight() / 2) {
    this.vel.y *= -1
  }
})

ball.on('exitviewport', function () {
  alert('You lose!')
})

ball.draw = function (context, delta) {
  context.fillStyle = ex.Color.Chartreuse
  context.beginPath()
  context.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2)
  context.closePath()
  context.fill()
}

game.add(ball)

// Build Bricks
let padding = 20
let offsetX = 65
let offsetY = 20
let columns = 5
let rows = 3

let brickColor = [ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow]

let brickWidth = game.drawWidth / columns - padding - padding / columns
let brickHeight = 30
let bricks = []

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    bricks.push(
      new ex.Actor(
        offsetX + column * (brickWidth + padding) + padding,
        offsetY + row * (brickHeight + padding) + padding,
        brickWidth,
        brickHeight,
        brickColor[row % brickColor.length]
      )
    )
  }
}

bricks.forEach(function (brick) {
  brick.collisionType = ex.CollisionType.Active

  game.add(brick)
})

game.start()