class Main
  constructor: ->
    engine.loader.hideOverlay => @onLoaded()
    @lastFive = []
    @posX = 0
    @posY = 0
    @rotation = 0
    setTimeout (=> @startTest()), 2000

  getSearch: ->
    s = window.location.search.replace /^\?/, ''
    parts = s.split '&'
    search = {}
    for part in parts
      [name, value] = part.split '='
      search[name] = value
    search

  onLoaded: ->
    @addObjects @getSearch()['objects'] || 8000

  startTest: ->
    @startFrames = engine.frames
    setTimeout (=> @endTest()), 10000

  endTest: ->
    objects = (Object.keys(engine.objectIndex).length - 2)
    frames = engine.frames - @startFrames
    fps = (engine.frames - @startFrames) / 10

    @lastFive.push frames
    @lastFive.shift() if @lastFive.length > 5
    average = @lastFive.reduce (a, b)-> a + b
    average /= @lastFive.length * 10

    console.log "Objects: #{objects} - Frames: #{frames} - FPS: #{fps} - Average: #{average}"
    @startTest()

  addObjects: (count = 10)->
    cols = rows = Math.max Math.sqrt count
    col = 0
    row = 0
    direction = 0
    xInt = engine.canvasResX / cols
    yInt = engine.canvasResY / rows
    directionInt = Math.PI / 100

    for i in [0...count]
      x = col * xInt
      y = row * yInt
      speed = new Engine.Geometry.Vector().setFromDirection direction, 5
      sprite = new Engine.Views.GameObject 'rock', x, y, direction, {speed: speed}
      sprite.checkBounce = ->
        if @x < 0
          @x = 0;
          @speed.x = -@speed.x
        else if @x > 600
          @x = 600
          @speed.x = -@speed.x

        if @y < 0
          @y = 0
          @speed.y = -@speed.y
        else if @y > 400
          @y = 400;
          @speed.y = -@speed.y

      engine.currentRoom.loops.eachFrame.attachFunction sprite, sprite.checkBounce
      engine.currentRoom.addChildren sprite

      direction += directionInt
      ++row
      if row > rows
        row = 0
        ++col

new Engine
  # Set game-class path (Look at this file to start programming your game)
  gameClass: Main

  # Set themes to load
  themesPath: '../assets'
  themes: ['example']

  # Set arena background-color
  backgroundColor: "#000"

  # Disable webgl using "canvas" search param
  disableWebGL: /canvas/.test window.location.search

  # Disable pause on blur (so that JavaScript profiling can be done easier)
  pauseOnBlur: false

  # Set resolution of the game
  canvasResX: 600
  canvasResY: 400
