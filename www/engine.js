(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
The constructor for the Engine class.

@constructor
@name Engine
@class The main game engine class.
Responsible for the main loop, the main canvas, etc.

@property {boolean} running Whether or not the engine is currently running
@property {int} canvasResX The main canvas horizontal resolution
@property {int} canvasResY The main canvas vertical resolution
@property {string} enginePath The url to jsEngine's source folder
@property {boolean} focusOnLoad If the engine should focus itself when loaded
@property {string} themesPath The url to jsEngine's theme folder
@property {boolean} drawBoundingBoxes Whether or not the bounding boxes of all collidable objects are drawn
@property {boolean} drawMasks Whether or not the masks of all collidable objects are drawn
@property {boolean} pauseOnBlur Whether or the engine will pause itself when the window is blurred
@property {boolean} disableRightClick Whether or not right click context menu is disabled inside the main canvas
@property {boolean} preventDefaultKeyboard Whether or not preventDefault is called for keyboard events
@property {HTMLElement} arena The HTML element to use as parent to the main canvas
@property {boolean} autoResize Whether or not the arena will autoresize itself to fit the window
@property {boolean} autoResizeLimitToResolution Whether or not the arena should not autoresize itself to be bigger than the main canvas' resolution
@property {int} cachedSoundCopies The number of copies each sound object caches of it's source to enable multiple playbacks
@property {string} loadText The text shown while loading the engine
@property {string} backgroundColor A CSS color string which is used as the background color of the main canvas
@property {number} timeFactor The factor to multiply the time increase with. A factor of 2 will make everything happen with double speed
@property {boolean} resetCursorOnEachFrame Whether or not the mouse cursor will be reset on each frame
@property {boolean} disableTouchScroll Whether or not touch scroll has been disabled
@property {Camera[]} cameras An array containing the engine's cameras
@property {int} defaultCollisionResolution The collision resolution set for all created collidable objects
@property {boolean} soundsMuted Whether or not all sound effects are currently muted
@property {boolean} musicMuted Whether or not all music is currently muted

@param {object} options An object containing key-value pairs that will be used as launch options for the engine.
The default options are:
<code>{
"arena": document.getElementById('arena'), // The element to use as game arena
"avoidSubPixelRendering": true, // If subpixelrendering should be avoided
"autoResize": true, // If the arena should autoresize to fit the window (or iframe)
"autoResizeLimitToResolution": true, // If the autoresizing should be limited to the game's resolution
"backgroundColor": "#000", // The color of the arena's background
"cachedSoundCopies": 5, // How many times sounds should be duplicated to allow multiple playbacks
"canvasResX": 800, // The horizontal resolution to set for the game's main canvas
"canvasResY": 600, // The vertical resolution to set for the game's main canvas
"defaultCollisionResolution": 6, // Res. of collision checking, by default every 6th px is checked
"disableRightClick": true, // If right clicks inside the arena should be disabled
"disableWebGL": false, // If WebGL rendering should be disabled
"preventDefaultKeyboard": false, // Whether or not preventDefault should be called for keyboard events
"disableTouchScroll": true, // If touch scroll on tablets and phones should be disable
"drawBoundingBoxes": false, // If Collidable object's bounding boxes should be drawn
"drawMasks": false, // If Collidable object's masks should be drawn
"enginePath": "js/jsEngine", // The path for the engine classes' directory
"focusOnLoad": true, // Whether or not to focus the engine's window when the engine is ready
"loadText": 'jsEngine loading...'
"musicMuted": false, // If all music playback should be initially muted
"pauseOnBlur": true, // If the engine should pause when the browser window loses its focus
"resetCursorOnEachFrame": true // Whether or not the mouse cursor should be reset on each frame
"soundsMuted": false, // If all sound effects should be initially muted
"themesPath": "themes", // The path to the themes-directory
"enableRedrawRegions": false, // Whether the engine should use redraw regions for drawing or not
}</code>
 */
var Engine;

module.exports = window.Engine = Engine = (function() {
  function Engine(options) {

    /*
    Global engine var set upon engine initialization
    @global
     */
    window.engine = this;
    this.options = options || {};
    this.load();
    return;
  }


  /*
  Load all files and functions, that are needed before the engine can start.
  @private
   */

  Engine.prototype.load = function() {
    var audioFormats, copyOpt, i, opt;
    copyOpt = void 0;
    audioFormats = void 0;
    i = void 0;
    opt = void 0;
    this.host = {
      hasTouch: "ontouchstart" in document,
      hasMouse: false,
      browserEngine: "Unknown",
      device: "Unknown",
      supportedAudio: []
    };
    if (navigator.userAgent.match(/Firefox/)) {
      this.host.browserEngine = "Gecko";
    } else if (navigator.userAgent.match(/AppleWebKit/)) {
      this.host.browserEngine = "WebKit";
      if (navigator.userAgent.match(/iPad|iPhone/)) {
        this.host.device = "iDevice";
      } else {
        if (navigator.userAgent.match(/Android/)) {
          this.host.device = "Android";
        }
      }
    } else {
      if (navigator.userAgent.match(/Trident/)) {
        this.host.browserEngine = "Trident";
      }
    }
    audioFormats = ["mp3", "ogg", "wav"];
    i = 0;
    while (i < audioFormats.length) {
      if (document.createElement("audio").canPlayType("audio/" + audioFormats[i])) {
        this.host.supportedAudio.push(audioFormats[i]);
      }
      i++;
    }
    this.avoidSubPixelRendering = true;
    this.preloadSounds = true;
    switch (this.host.device) {
      case "iDevice":
        this.preloadSounds = false;
    }
    this.running = false;
    this.canvasResX = 800;
    this.canvasResY = 600;
    this.enginePath = "js/jsEngine";
    this.focusOnLoad = true;
    this.themesPath = "assets";
    this.drawBoundingBoxes = false;
    this.drawMasks = false;
    this.pauseOnBlur = true;
    this.disableRightClick = true;
    this.preventDefaultKeyboard = false;
    this.arena = document.getElementById("arena");
    this.autoResize = true;
    this.autoResizeLimitToResolution = true;
    this.cachedSoundCopies = 5;
    this.loadText = "jsEngine loading...";
    this.backgroundColor = "#000";
    this.timeFactor = 1;
    this.disableTouchScroll = true;
    this.resetCursorOnEachFrame = true;
    this.cameras = [];
    this.defaultCollisionResolution = 6;
    this.redrawObjects = [];
    this.enableRedrawRegions = false;
    this.disableWebGL = false;
    this.soundsMuted = false;
    this.musicMuted = false;
    copyOpt = ["arena", "autoResize", "autoResizeLimitToResolution", "avoidSubPixelRendering", "backgroundColor", "cachedSoundCopies", "canvasResX", "canvasResY", "defaultCollisionResolution", "disableWebGL", "disableRightClick", "disableTouchScroll", "drawBoundingBoxes", "drawMasks", "enableRedrawRegions", "enginePath", "focusOnLoad", "gameClass", "loadText", "musicMuted", "pauseOnBlur", "preventDefaultKeyboard", "resetCursorOnEachFrame", "soundsMuted", "themesPath"];
    i = 0;
    while (i < copyOpt.length) {
      opt = copyOpt[i];
      if (this.options[opt] !== void 0) {
        this[opt] = this.options[opt];
        delete this.options[opt];
      }
      i++;
    }
    if (!this.gameClass) {
      throw new Error('Game class missing');
    }
    this.arena.style.position = "absolute";
    this.arena.style.backgroundColor = "#000";
    this.arena.style.userSelect = "none";
    this.arena.style.webkitUserSelect = "none";
    this.arena.style.MozUserSelect = "none";
    this.createCanvas();
    this.initRenderer();
    if (this.autoResize) {
      this.autoResize = false;
      this.setAutoResize(true);
    } else {
      this.autoResize = true;
      this.setAutoResize(false);
    }
    if (this.disableTouchScroll) {
      document.addEventListener("touchmove", (function(event) {
        event.preventDefault();
      }), false);
      document.addEventListener("touchstart", (function(event) {
        event.preventDefault();
      }), false);
    }

    /*
    Global Engine.Loader instance which is created upon engine initialization
    @global
     */
    this.loader = new Engine.Loader();
    this.defaultTheme = this.options.themes[0];
    this.loader.onthemesloaded = function() {
      engine.initialize();
    };
    this.loader.loadThemes(this.options.themes);
  };


  /*
  Starts the engine
  
  @private
   */

  Engine.prototype.initialize = function() {
    var objectName;
    objectName = void 0;
    this.objectIndex = {};
    this.frames = 0;
    this.last = new Date().getTime();
    this.now = this.last;
    this.gameTime = 0;
    this.currentId = 0;
    this.fps = 0;
    this.fpsCounter = 0;
    this.drawTime = 0;
    this.drawTimeCounter = 0;
    this.drawCalls = 0;
    this.roomList = [];
    this.masterRoom = new this.constructor.Room("master");
    this.currentRoom = new this.constructor.Room("main");
    this.defaultAnimationLoop = this.currentRoom.loops.eachFrame;
    this.defaultActivityLoop = this.currentRoom.loops.eachFrame;
    this.cameras.push(new this.constructor.Camera(new Engine.Geometry.Rectangle(0, 0, this.canvasResX, this.canvasResY), new Engine.Geometry.Rectangle(0, 0, this.canvasResX, this.canvasResY)));
    if (this.disableRightClick) {
      this.arena.oncontextmenu = function() {
        return false;
      };
    }
    this.keyboard = new Engine.Input.Keyboard();
    this.pointer = new Engine.Input.Pointer();
    if (this.pauseOnBlur) {
      window.addEventListener("blur", function() {
        engine.stopMainLoop();
      });
      window.addEventListener("focus", function() {
        engine.startMainLoop();
      });
    }
    new this.gameClass();
    this.startMainLoop();
    if (this.focusOnLoad) {
      window.focus();
    }
    if (this.onload) {
      this.onload();
    }
    console.log("jsEngine started");
  };


  /*
  Creates and prepares the game canvas for being used
   */

  Engine.prototype.createCanvas = function() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.canvas.width = this.canvasResX;
    this.canvas.height = this.canvasResY;
    this.arena.appendChild(this.canvas);
  };

  Engine.prototype.initRenderer = function() {
    if (!this.disableWebGL && (this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl"))) {
      this.renderer = new Engine.Renderers.WebGLRenderer(this.canvas);
    } else {
      this.renderer = new Engine.Renderers.CanvasRenderer(this.canvas);
    }
  };


  /*
  Enables or disables canvas autoresize.
  
  @param {boolean} enable Decides whether autoresize should be enabled or disabled
   */

  Engine.prototype.setAutoResize = function(enable) {
    if (enable && !this.autoResize) {
      this.autoResize = true;
      this.autoResizeCanvas();
      window.addEventListener("resize", engine.autoResizeCanvas, false);
      window.addEventListener("load", engine.autoResizeCanvas, false);
    } else if (!enable && this.autoResize) {
      this.autoResize = false;
      window.removeEventListener("resize", engine.autoResizeCanvas, false);
      window.removeEventListener("load", engine.autoResizeCanvas, false);
      this.arena.style.top = "50%";
      this.arena.style.left = "50%";
      this.arena.style.marginLeft = -this.canvasResX / 2 + "px";
      this.arena.style.marginTop = -this.canvasResY / 2 + "px";
      this.canvas.style.width = this.canvasResX + "px";
      this.canvas.style.height = this.canvasResY + "px";
    }
  };


  /*
  Function for resizing the canvas. Not used if engine option "autoResizeCanvas" is false.
  
  @private
   */

  Engine.prototype.autoResizeCanvas = function() {
    var gameWH, h, w, windowWH;
    if (this !== engine) {
      engine.autoResizeCanvas();
      return;
    }
    h = void 0;
    w = void 0;
    windowWH = void 0;
    gameWH = void 0;
    windowWH = window.innerWidth / window.innerHeight;
    gameWH = this.canvasResX / this.canvasResY;
    if (windowWH > gameWH) {
      h = window.innerHeight;
      w = this.canvasResX / this.canvasResY * h;
    } else {
      w = window.innerWidth;
      h = this.canvasResY / this.canvasResX * w;
    }
    if (this.autoResizeLimitToResolution) {
      w = Math.min(w, this.canvasResX);
      h = Math.min(h, this.canvasResY);
    }
    this.arena.style.top = "50%";
    this.arena.style.left = "50%";
    this.arena.style.marginTop = -h / 2 + "px";
    this.arena.style.marginLeft = -w / 2 + "px";
    this.canvas.style.height = h + "px";
    this.canvas.style.width = w + "px";
  };


  /*
  Function for converting between speed units
  
  @param {number} speed The value to convert
  @param {number} from The unit to convert from. Can be SPEED_PIXELS_PER_SECOND or SPEED_PIXELS_PER_FRAME
  @param {number} to The unit to convert to. Can be SPEED_PIXELS_PER_SECOND or SPEED_PIXELS_PER_FRAME
  @return {number} The resulting value of the conversion
   */

  Engine.prototype.convertSpeed = function(speed, from, to) {
    if (speed === void 0) {
      throw new Error("Missing argument: speed");
    }
    if (speed instanceof this.constructor.Geometry.Vector) {
      return new this.constructor.Vector(this.convertSpeed(speed.x, from, to), this.convertSpeed(speed.y, from, to));
    }
    from = (from !== void 0 ? from : Engine.Globals.SPEED_PIXELS_PER_SECOND);
    to = (to !== void 0 ? to : Engine.Globals.SPEED_PIXELS_PER_FRAME);
    switch (from) {
      case Engine.Globals.SPEED_PIXELS_PER_SECOND:
        speed = speed * this.gameTimeIncrease / 1000;
        break;
      case Engine.Globals.SPEED_PIXELS_PER_FRAME:
        speed;
    }
    switch (to) {
      case Engine.Globals.SPEED_PIXELS_PER_SECOND:
        return speed = speed / this.gameTimeIncrease * 1000;
      case Engine.Globals.SPEED_PIXELS_PER_FRAME:
        return speed;
    }
  };


  /*
  Leaves the current room and opens another room
  
  @param {Room|string} room A pointer to the desired room, or a string representing the name of the room
  @param {number} transition A room transition constant or function
   */

  Engine.prototype.goToRoom = function(room, transition, transitionOptions) {
    var oldRoom;
    if (this.changingRoom) {
      return false;
    }
    if (room === void 0) {
      throw new Error("Missing argument: room");
    }
    if (typeof room === "string") {
      room = this.roomList.filter(function(r) {
        return r.name === room;
      })[0];
      if (!room) {
        throw new Error("Could not find a room with the specified name");
      }
    } else {
      if (this.roomList.indexOf(room) === -1) {
        throw new Error("Room is not on room list, has it been removed?");
      }
    }
    transition = (transition ? transition : ROOM_TRANSITION_NONE);
    oldRoom = this.currentRoom;
    engine.changingRoom = true;
    transition(oldRoom, room, transitionOptions, function() {
      engine.changingRoom = false;
      engine.currentRoom = room;
    });
    return oldRoom;
  };


  /*
  Adds a room to the room list. This function is automatically called by the Room class' constructor.
  
  @private
  @param {Room} room The room which should be added
   */

  Engine.prototype.addRoom = function(room) {
    if (room === void 0) {
      throw new Error("Missing argument: room");
    }
    if (this.roomList.indexOf(room) !== -1) {
      throw new Error("Room is already on room list, rooms are automatically added upon instantiation");
    }
    this.roomList.push(room);
  };


  /*
  Removes a room from the room list.
  
  @param {Room|string} room A pointer to the room, or a string representing the name of the room, which should be removed
   */

  Engine.prototype.removeRoom = function(room) {
    var index;
    if (room === void 0) {
      throw new Error("Missing argument: room");
    }
    index = void 0;
    if (typeof room === "string") {
      room = this.roomList.getElementByPropertyValue("name", room);
      if (!room) {
        throw new Error("Could not find a room with the specified name");
      }
    }
    index = this.roomList.indexOf(room);
    if (index === -1) {
      throw new Error("Room is not on room list, has it been removed?");
    }
    if (room === this.masterRoom) {
      throw new Error("Cannot remove master room");
    } else {
      if (room === this.currentRoom) {
        throw new Error("Cannot remove current room, remember to leave the room first, by entering another room (use engine.goToRoom)");
      }
    }
    this.roomList.splice(i, 1);
  };


  /*
  Toggles if all sound effects should be muted.
  
  @param {boolean} muted Whether or not the sound effects should be muted
   */

  Engine.prototype.setSoundsMuted = function(muted) {
    muted = (muted !== void 0 ? muted : true);
    if (muted) {
      loader.getAllSounds().forEach(function(s) {
        s.stopAll();
      });
    }
    this.soundsMuted = muted;
  };


  /*
  Toggles if all music should be muted.
  
  @param {boolean} muted Whether of not the music should be muted
   */

  Engine.prototype.setMusicMuted = function(muted) {
    muted = (muted !== void 0 ? muted : true);
    if (muted) {
      loader.getAllMusic().forEach(function(m) {
        m.stop();
      });
    }
    this.musicMuted = muted;
  };


  /*
  Sets the default theme for the engine objects
  
  @param {string} themeName A string representing the name of the theme
  @param {boolean} enforce Whether or not the enforce the theme on objects for which another theme has already been set
   */

  Engine.prototype.setDefaultTheme = function(themeName, enforce) {
    if (themeName === void 0) {
      throw new Error("Missing argument: themeName");
    }
    if (loader.themes[themeName] === void 0) {
      throw new Error("Trying to set nonexistent theme: " + themeName);
    }
    enforce = (enforce !== void 0 ? enforce : false);
    this.defaultTheme = themeName;
    this.currentRoom.setTheme(void 0, enforce);
  };


  /*
  Starts the engine's main loop
   */

  Engine.prototype.startMainLoop = function() {
    if (this.running) {
      return;
    }
    this.now = new Date().getTime();
    this.running = true;
    engine.mainLoop();
  };


  /*
  Stops the engine's main loop
   */

  Engine.prototype.stopMainLoop = function() {
    if (!this.running) {
      return;
    }
    this.running = false;
  };


  /*
  The engine's main loop function (should not be called manually)
  
  @private
   */

  Engine.prototype.mainLoop = function() {
    var drawTime;
    if (!this.running) {
      return;
    }
    drawTime = void 0;
    this.last = this.now;
    this.now = new Date().getTime();
    this.timeIncrease = this.now - this.last;
    this.gameTimeIncrease = this.timeIncrease * this.timeFactor;
    this.gameTime += this.gameTimeIncrease;
    this.frames++;
    if (this.resetCursorOnEachFrame) {
      this.pointer.resetCursor();
    }
    this.masterRoom.update();
    this.currentRoom.update();
    this.drawCalls = 0;
    drawTime = new Date().getTime();
    this.renderer.render(this.cameras);
    drawTime = new Date().getTime() - drawTime;
    if (this.fpsMsCounter < 1000) {
      this.fpsCounter++;
      this.drawTimeCounter += drawTime;
      this.fpsMsCounter += this.timeIncrease;
    } else {
      this.fps = this.fpsCounter;
      this.drawTime = this.drawTimeCounter / this.fpsCounter;
      this.fpsCounter = 0;
      this.drawTimeCounter = 0;
      this.fpsMsCounter = 0;
    }
    requestAnimationFrame(function(time) {
      engine.mainLoop(time);
    });
  };


  /*
  Sets the horizontal resolution of the main canvas
  
  @param {number} res The new horizontal resolution
   */

  Engine.prototype.setCanvasResX = function(res) {
    this.canvas.width = res;
    this.canvasResX = res;
    if (this.autoResize) {
      this.autoResizeCanvas();
    }
  };


  /*
  Sets the vertical resolution of the main canvas
  
  @param {number} res The new vertical resolution
   */

  Engine.prototype.setCanvasResY = function(res) {
    this.canvas.height = res;
    this.canvasResY = res;
    if (this.autoResize) {
      this.autoResizeCanvas();
    }
  };


  /*
  Registers an object to the engine. This will give the object an id which can be used for accessing it at a later time.
  Sprites, TextBlock and objects inheriting those objects, are automatically registered when created.
  
  @param {Object} obj The object to register in the engine
  @param {string} id A string with the desired id
  @return {string} The registered id
   */

  Engine.prototype.registerObject = function(obj, id) {
    if (obj === void 0) {
      throw new Error("Missing argument: obj");
    }
    if (id === void 0) {
      this.currentId++;
      id = "obj" + (this.currentId - 1);
    } else {
      if (this.objectIndex[id] !== void 0) {
        throw new Error("Object id already taken: " + id);
      }
    }
    this.objectIndex[id] = obj;
    obj.id = id;
    return id;
  };

  Engine.prototype.loadFileContent = function(filePath) {
    var req;
    req = new XMLHttpRequest();
    req.open("GET", filePath, false);
    req.send();
    return req.responseText;
  };


  /*
  Loads and executes one or multiple JavaScript file synchronously
  
  @param {string|string[]} filePaths A file path (string), or an array of file paths to load and execute as JavaScript
   */

  Engine.prototype.loadFiles = function(filePaths) {
    var i, req, script;
    i = void 0;
    req = void 0;
    script = void 0;
    if (typeof filePaths === "string") {
      filePaths = [filePaths];
    }
    i = 0;
    while (i < filePaths.length) {
      req = new XMLHttpRequest();
      req.open("GET", filePaths[i], false);
      req.send();
      script = document.createElement("script");
      script.type = "text/javascript";
      script.text = req.responseText + "\n//# sourceURL=/" + filePaths[i];
      document.body.appendChild(script);
      i++;
    }
    if (window.loadedFiles === void 0) {
      window.loadedFiles = [];
    }
    window.loadedFiles = window.loadedFiles.concat(filePaths);
  };


  /*
  Uses an http request to fetch the data from a file and runs a callback function with the file data as first parameter
  
  @param {string} url A URL path for the file to load
  @param {string|Object} params A parameter string or an object to JSON-stringify and use as URL parameter (will be send as "data=[JSON String]")
  @param {boolean} async Whether or not the request should be synchronous.
  @param {function} callback A callback function to run when the request has finished
  @param {object} caller An object to call the callback function as.
   */

  Engine.prototype.ajaxRequest = function(url, params, async, callback, caller) {
    var req;
    if (url === void 0) {
      throw new Error("Missing argument: url");
    }
    if (callback === void 0) {
      throw new Error("Missing argument: callback");
    }
    params = (params !== void 0 ? params : "");
    async = (async !== void 0 ? async : true);
    caller = (caller !== void 0 ? caller : window);
    if (typeof params !== "string") {
      params = "data=" + JSON.stringify(params);
    }
    req = void 0;
    req = new XMLHttpRequest();
    if (async) {
      req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
          callback.call(caller, req.responseText);
        }
      };
    }
    req.open("POST", url, async);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(params);
    if (!async) {
      if (req.readyState === 4 && req.status === 200) {
        callback.call(caller, req.responseText);
      } else {
        throw new Error("XMLHttpRequest failed: " + url);
      }
    }
  };


  /*
  Removes an object from all engine loops, views, and from the object index
  
  param {Object} obj The object to remove
   */

  Engine.prototype.purge = function(obj) {
    var len, loop_, name, room, roomId;
    len = void 0;
    name = void 0;
    loop_ = void 0;
    roomId = void 0;
    room = void 0;
    if (obj === void 0) {
      throw new Error("Cannot purge object: " + obj);
    }
    if (typeof obj === "string") {
      obj = this.objectIndex[obj];
    }
    if (obj.children) {
      len = obj.children.length;
      while (len--) {
        engine.purge(obj.children[len]);
      }
    }
    roomId = 0;
    while (roomId < this.roomList.length) {
      room = this.roomList[roomId];
      for (name in room.loops) {
        if (room.loops.hasOwnProperty(name)) {
          loop_ = room.loops[name];
          loop_.detachFunctionsByCaller(obj);
          loop_.unscheduleByCaller(obj);
          loop_.removeAnimationsOfObject(obj);
        }
      }
      roomId++;
    }
    if (obj.parent) {
      obj.parent.removeChildren(obj);
    }
    delete this.objectIndex[obj.id];
  };


  /*
  Downloads a screen dump of the main canvas. Very usable for creating game screenshots directly from browser consoles.
   */

  Engine.prototype.dumpScreen = function() {
    var a, dataString;
    dataString = void 0;
    a = void 0;
    dataString = this.canvas.toDataURL().replace(/image\/png/, "image/octet-stream");
    a = document.createElement("a");
    a.href = dataString;
    a.setAttribute("download", "screendump.png");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a, document.body);
  };

  return Engine;

})();

Engine.Helpers = {};

Engine.Helpers.MatrixCalculation = require('./helpers/matrix-calculation');

Engine.Helpers.Mixin = require('./helpers/mixin');

Engine.Helpers.RoomTransition = require('./helpers/room-transition');

Engine.Helpers.WebGL = require('./helpers/webgl');

Engine.Mixins = {};

Engine.Mixins.Animatable = require('./mixins/animatable');

Engine.Input = {};

Engine.Input.Keyboard = require('./input/keyboard');

Engine.Input.Pointer = require('./input/pointer');

Engine.Geometry = {};

Engine.Geometry.Vector = require('./geometry/vector');

Engine.Geometry.Circle = require('./geometry/circle');

Engine.Geometry.Line = require('./geometry/line');

Engine.Geometry.Polygon = require('./geometry/polygon');

Engine.Geometry.Rectangle = require('./geometry/rectangle');

Engine.Renderers = {};

Engine.Renderers.WebGLRenderer = require('./renderer/webgl');

Engine.Renderers.CanvasRenderer = require('./renderer/canvas');

Engine.Sounds = {};

Engine.Sounds.Effect = require('./sounds/effect');

Engine.Sounds.Music = require('./sounds/music');

Engine.Views = {};

Engine.Views.Child = require('./views/child');

Engine.Views.Container = require('./views/container');

Engine.Views.Circle = require('./views/circle');

Engine.Views.Line = require('./views/line');

Engine.Views.Rectangle = require('./views/rectangle');

Engine.Views.Polygon = require('./views/polygon');

Engine.Views.Sprite = require('./views/sprite');

Engine.Views.TextBlock = require('./views/text-block');

Engine.Views.Collidable = require('./views/collidable');

Engine.Views.GameObject = require('./views/game-object');

Engine.Room = require('./engine/room');

Engine.Globals = require('./engine/globals');

Engine.ObjectCreator = require('./engine/object-creator');

Engine.CustomLoop = require('./engine/custom-loop');

Engine.Camera = require('./engine/camera');

Engine.Loader = require('./engine/loader');



},{"./engine/camera":2,"./engine/custom-loop":3,"./engine/globals":4,"./engine/loader":5,"./engine/object-creator":6,"./engine/room":7,"./geometry/circle":8,"./geometry/line":9,"./geometry/polygon":10,"./geometry/rectangle":11,"./geometry/vector":12,"./helpers/matrix-calculation":13,"./helpers/mixin":14,"./helpers/room-transition":15,"./helpers/webgl":16,"./input/keyboard":17,"./input/pointer":18,"./mixins/animatable":19,"./renderer/canvas":20,"./renderer/webgl":21,"./sounds/effect":24,"./sounds/music":25,"./views/child":26,"./views/circle":27,"./views/collidable":28,"./views/container":29,"./views/game-object":30,"./views/line":31,"./views/polygon":32,"./views/rectangle":33,"./views/sprite":34,"./views/text-block":35}],2:[function(require,module,exports){
var Camera, Engine;

Engine = require('../engine');


/*
Constructor for Camera class

@name Engine.Camera
@class A camera represents a part of the arena which is "projected" on to the engines main canvas.
the camera contains both a capture region and a projection region, the capture region decides which part of the arena to "capture".
The projection region decides where the captured region will be drawn on the main canvas.

@property {Math.Rectangle} captureRegion A rectangle which defines the region of the current room to capture
@property {Math.Rectangle} projectionRegion A rectangle which defines the region on the main canvas where the captured region should be drawn
@property {Engine.Room} room The room to capture from

@param {Math.Rectangle} captureRegion A rectangle which defines the region of the current room to capture
@param {Math.Rectangle} projectionRegion A rectangle which defines the region on the main canvas where the captured region should be drawn
@param {Engine.Room} room The room to capture from
 */

module.exports = Camera = (function() {
  function Camera(captureRegion, projectionRegion, room) {
    if (!captureRegion instanceof Engine.Geometry.Rectangle) {
      throw new Error("Argument captureRegion should be of type: Rectangle");
    }
    if (!projectionRegion instanceof Engine.Geometry.Rectangle) {
      throw new Error("Argument projectionRegion should be of type: Rectangle");
    }
    this.captureRegion = captureRegion;
    this.projectionRegion = projectionRegion;
    this.room = room || engine.currentRoom;
    return;
  }

  return Camera;

})();



},{"../engine":1}],3:[function(require,module,exports){
var CustomLoop, Engine;

Engine = require('../engine');


/*
@name Engine.CustomLoop
@class A loop class.
Contains a list of functions to run each time the loop executes.
For the loop to be executed, it will have to be added to the current room via the Engine.currentRoom.addLoop.
A loop also has it's own time that is stopped whenever the loop is not executed. This makes it possible to schedule a function execution that will be "postponed" if the loop gets paused.

@property {number} framesPerExecution The number of frames between each execution of the custom loop
@property {function} maskFunction A function that will be run before each execution, if the function returns true the execution proceeds as planned, if not, the execution will not be run
@property {number} time The "local" time of the loop. The loop's time is stopped when the loop is not executed.
@property {number} execTime The time it took to perform the last execution

@param {number} [framesPerExecution=1] The number of frames between each execution of the custom loop
@param {function} [maskFunction=function(){}] A function that will be run before each execution, if the function returns true the execution proceeds as planned, if not, the execution will not be run
 */

module.exports = CustomLoop = (function() {
  function CustomLoop(framesPerExecution, maskFunction) {
    this.framesPerExecution = (framesPerExecution === void 0 ? 1 : framesPerExecution);
    this.maskFunction = (maskFunction === void 0 ? function() {
      return true;
    } : maskFunction);
    this.functionsQueue = [];
    this.functions = [];
    this.executionsQueue = [];
    this.executions = [];
    this.animations = [];
    this.lastFrame = window.engine.frames;
    this.last = (window.engine.now ? window.engine.now : new Date().getTime());
    this.time = 0;
    this.execTime = 0;
  }


  /*
  Attaches a function to the loop.
  
  @param {Object} caller The object to run the function as
  @param {function} func The function to run on each execution of the custom loop
   */

  CustomLoop.prototype.attachFunction = function(caller, func) {
    if (caller === void 0) {
      throw new Error("Missing argument: caller");
    }
    if (func === void 0) {
      throw new Error("Missing argument: func");
    }
    if (typeof func !== "function") {
      throw new Error("Argument func must be of type function");
    }
    this.functionsQueue.push({
      object: caller,
      activity: func
    });
  };


  /*
  Queues a function for being added to the executed functions. The queue works as a buffer which prevent functions, that have just been added, from being executed before the next frame.
  
  @private
   */

  CustomLoop.prototype.addFunctionsQueue = function() {
    this.functions = this.functions.concat(this.functionsQueue);
    this.functionsQueue = [];
  };


  /*
  Detaches a function from the loop. If the same function is attached multiple times (which is never a good idea), only the first occurrence is detached.
  
  @param {Object} caller The object the function was run as
  @param {function} func The function to detach from the loop
  @return {boolean} Whether or not the function was found and detached
   */

  CustomLoop.prototype.detachFunction = function(caller, func) {
    var a, i;
    if (caller === void 0) {
      throw new Error("Missing argument: caller");
    }
    if (func === void 0) {
      throw new Error("Missing argument: func");
    }
    i = void 0;
    a = void 0;
    i = 0;
    while (i < this.functions.length) {
      a = this.functions[i];
      if (a.object === caller && a.activity === func) {
        this.functions.splice(i, 1);
        return true;
      }
      i++;
    }
    i = 0;
    while (i < this.functionsQueue.length) {
      a = this.functionsQueue[i];
      if (a.object === caller && a.activity === func) {
        this.functionsQueue.splice(i, 1);
        return true;
      }
      i++;
    }
    return false;
  };


  /*
  Detaches all occurrences of a specific function, no matter the caller.
  
  @param {function} func The function to detach from the loop
  @return {function[]} An array of detached functions
   */

  CustomLoop.prototype.detachFunctionsByFunction = function(func) {
    var i, removeArray;
    if (func === void 0) {
      throw new Error("Missing argument: func");
    }
    removeArray = void 0;
    i = void 0;
    removeArray = [];
    i = this.functions.length;
    if ((function() {
      var results;
      results = [];
      while (i--) {
        results.push(func === this.functions[i].func);
      }
      return results;
    }).call(this)) {
      removeArray.push(this.functions.splice(i, 1));
    }
    i = this.functionsQueue.length;
    if ((function() {
      var results;
      results = [];
      while (i--) {
        results.push(func === this.functions[i].func);
      }
      return results;
    }).call(this)) {
      removeArray.push(this.functionsQueue.splice(i, 1));
    }
    if (removeArray.length) {
      return removeArray;
    } else {
      return false;
    }
  };


  /*
  Detaches all attached functions with a specific caller
  
  @param {Object} caller The object the function was run as
  @return {function[]} An array of detached functions
   */

  CustomLoop.prototype.detachFunctionsByCaller = function(caller) {
    var i, removeArray;
    if (caller === void 0) {
      throw new Error("Missing argument: caller");
    }
    removeArray = void 0;
    i = void 0;
    removeArray = [];
    i = this.functions.length;
    if ((function() {
      var results;
      results = [];
      while (i--) {
        results.push(caller === this.functions[i].object);
      }
      return results;
    }).call(this)) {
      removeArray.push(this.functions.splice(i, 1));
    }
    i = this.functionsQueue.length;
    if ((function() {
      var results;
      results = [];
      while (i--) {
        results.push(caller === this.functionsQueue[i].object);
      }
      return results;
    }).call(this)) {
      removeArray.push(this.functionsQueue.splice(i, 1));
    }
    if (removeArray.length) {
      return removeArray;
    } else {
      return false;
    }
  };


  /*
  Schedules a function to be run after a given amount of time in the loop.
  If the loop is paused before the execution has happened, the loop's time will stand still, and therefore the scheduled execution will not happen until the loop is started again.
  
  @param {Object} caller The object with which to run the function (by default the custom loop itself)
  @param {function} func The function to execute
  @param {number} delay The delay in ms
   */

  CustomLoop.prototype.schedule = function(caller, func, delay) {
    if (caller === void 0) {
      throw new Error("Missing argument: caller");
    }
    if (func === void 0) {
      throw new Error("Missing argument: function");
    }
    if (delay === void 0) {
      throw new Error("Missing argument: delay");
    }
    this.executionsQueue.push({
      func: func,
      execTime: this.time + delay,
      caller: caller
    });
  };


  /*
  Adds the current executions queue to the list of planned executions. Automatically called at the end of each frame
  
  @private
   */

  CustomLoop.prototype.addExecutionsQueue = function() {
    this.executions = this.executions.concat(this.executionsQueue);
    this.executionsQueue = [];
  };


  /*
  Unschedules a single scheduled execution. If multiple similar executions exists, only the first will be unscheduled.
  
  @param {function} func The function to unschedule an execution of
  @param {Object} caller The object with which the function was to be executed (by default the custom loop itself)
  @return {boolean} Whether or not the function was found and unscheduled
   */

  CustomLoop.prototype.unschedule = function(caller, func) {
    var exec, i;
    if (caller === void 0) {
      throw new Error("Missing argument: caller");
    }
    if (func === void 0) {
      throw new Error("Missing argument: function");
    }
    i = void 0;
    exec = void 0;
    i = 0;
    while (i < this.executions.length) {
      exec = this.executions[i];
      if (caller === exec.caller && (exec.func === func || exec.func.toString() === func)) {
        this.executions.splice(i, 1);
        return true;
      }
      i++;
    }
    i = 0;
    while (i < this.executionsQueue.length) {
      exec = this.executionsQueue[i];
      if (caller === exec.caller && (exec.func === func || exec.func.toString() === func)) {
        this.executionsQueue.splice(i, 1);
        return true;
      }
      i++;
    }
    return false;
  };


  /*
  Unschedule all scheduled executions of a specific function, no matter the caller.
  
  @param {function} func The function to unschedule all executions of
  @return {boolean|function[]} False if no functions has been unscheduled, otherwise an array containing the unscheduled functions
   */

  CustomLoop.prototype.unscheduleByFunction = function(func) {
    var exec, i, unscheduledArray;
    if (func === void 0) {
      throw new Error("Missing argument: func");
    }
    unscheduledArray = void 0;
    i = void 0;
    exec = void 0;
    unscheduledArray = [];
    i = this.executions.length;
    while (i--) {
      exec = this.executions[i];
      if (func === exec.func) {
        unscheduledArray.push(this.executions.splice(i, 1));
      }
    }
    i = this.executionsQueue.length;
    while (i--) {
      exec = this.executionsQueue[i];
      if (func === exec.func) {
        unscheduledArray.push(this.executionsQueue.splice(i, 1));
      }
    }
    if (unscheduledArray.length) {
      return unscheduledArray;
    } else {
      return false;
    }
  };


  /*
  Unschedule all executions scheduled with a specific caller
  
  @param {object} caller The caller
  @return {boolean|function[]} False if no functions has been unscheduled, otherwise an array containing the unscheduled functions
   */

  CustomLoop.prototype.unscheduleByCaller = function(caller) {
    var exec, i, unscheduledArray;
    if (caller === void 0) {
      throw new Error("Missing argument: caller");
    }
    unscheduledArray = void 0;
    i = void 0;
    exec = void 0;
    unscheduledArray = [];
    i = this.executions.length;
    while (i--) {
      exec = this.executions[i];
      if (caller === exec.caller) {
        unscheduledArray.push(this.executions.splice(i, 1));
      }
    }
    i = this.executionsQueue.length;
    while (i--) {
      exec = this.executionsQueue[i];
      if (caller === exec.caller) {
        unscheduledArray.push(this.executionsQueue.splice(i, 1));
      }
    }
    if (unscheduledArray.length) {
      return unscheduledArray;
    } else {
      return false;
    }
  };


  /*
  Unschedules all scheduled executions
  
  @return {function[]} An array of all the unscheduled functions
   */

  CustomLoop.prototype.unscheduleAll = function() {
    var removeArray;
    removeArray = void 0;
    removeArray = [].concat(this.executions, this.executionsQueue);
    this.executions = [];
    this.executionsQueue = [];
    return removeArray;
  };


  /*
  Adds a new animation to the animator class (done automatically when running the animate-function).
  
  @private
  @param {object} animation An animation object
   */

  CustomLoop.prototype.addAnimation = function(animation) {
    var anim, cur, currentAnimations, i, propList, propName;
    if (animation === void 0) {
      throw new Error("Missing argument: animation");
    }
    anim = void 0;
    propList = void 0;
    currentAnimations = void 0;
    i = void 0;
    cur = void 0;
    propName = void 0;
    anim = animation;
    anim.start = this.time;
    propList = Object.keys(anim.prop);
    currentAnimations = anim.obj.getAnimations();
    i = 0;
    while (i < currentAnimations.length) {
      cur = currentAnimations[i];
      for (propName in cur.prop) {
        if (cur.prop.hasOwnProperty(propName)) {
          if (propList.indexOf(propName) !== -1) {
            delete cur.prop[propName];
          }
        }
      }
      i++;
    }
    this.animations.push(anim);
  };


  /*
  Stop all animations of a specific object from the loop
  
  @param {Mixin.Animatable} object The object to stop all animations of
   */

  CustomLoop.prototype.removeAnimationsOfObject = function(object) {
    var i;
    i = void 0;
    i = this.animations.length;
    if ((function() {
      var results;
      results = [];
      while (i--) {
        results.push(object === this.animations[i].obj);
      }
      return results;
    }).call(this)) {
      this.animations.splice(i, 1);
    }
  };


  /*
  Update the loop's animations in a single loop (called by updateAllLoops)
  
  @private
   */

  CustomLoop.prototype.updateAnimations = function() {
    var a, animId, propId, t;
    animId = void 0;
    a = void 0;
    propId = void 0;
    t = void 0;
    animId = this.animations.length - 1;
    while (animId > -1) {
      a = this.animations[animId];
      if (a === void 0) {
        continue;
      }
      t = this.time - a.start;
      if (t > a.duration) {
        this.animations.splice(animId, 1);
        for (propId in a.prop) {
          if (a.prop.hasOwnProperty(propId)) {
            a.obj[propId] = a.prop[propId].end;
          }
        }
        if (typeof a.callback === "string") {
          eval(a.callback);
        } else {
          a.callback.call(a.obj);
        }
      } else {
        for (propId in a.prop) {
          if (a.prop.hasOwnProperty(propId)) {
            a.obj[propId] = a.easing(t, a.prop[propId].begin, a.prop[propId].end - a.prop[propId].begin, a.duration);
          }
        }
      }
      a.onStep && a.onStep();
      animId--;
    }
  };


  /*
  Executes the custom loop. This will execute all the functions that have been added to the loop, and checks all scheduled executions to see if they should fire.
  This function will automatically be executed, if the loop has been added to the current room, or the engine's masterRoom
   */

  CustomLoop.prototype.execute = function() {
    var exec, i, timer;
    timer = void 0;
    i = void 0;
    exec = void 0;
    timer = new Date().getTime();
    if (!this.maskFunction() || engine.frames % this.framesPerExecution) {
      return;
    }
    if (engine.frames - this.lastFrame === this.framesPerExecution) {
      this.time += engine.gameTimeIncrease;
    }
    this.lastFrame = engine.frames;
    this.last = engine.now;
    this.updateAnimations();
    i = this.executions.length;
    while (i--) {
      if (i >= this.executions.length) {
        continue;
      }
      exec = this.executions[i];
      if (this.time >= exec.execTime) {
        exec.func.call(exec.caller);
        this.executions.splice(i, 1);
      }
    }
    i = 0;
    while (i < this.functions.length) {
      exec = this.functions[i];
      if (!exec.activity) {
        throw new Error("Trying to exec non-existent attached function");
      }
      exec.activity.call(exec.object);
      i++;
    }
    this.addFunctionsQueue();
    this.addExecutionsQueue();
    this.execTime = (new Date().getTime()) - timer;
  };

  return CustomLoop;

})();



},{"../engine":1}],4:[function(require,module,exports){
var Engine;

Engine = require('../engine');


/*
jseGlobals.js:
This file contains global JsEngine variables.
The purpose of the global variables is to be used as readable alternatives to magic numbers or strings.
 */

module.exports = {
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_SPACE: 32,
  KEY_BACKSPACE: 8,
  KEY_TAB: 9,
  KEY_ENTER: 13,
  KEY_SHIFT: 16,
  KEY_CONTROL: 17,
  KEY_ALT_LEFT: 18,
  KEY_CAPSLOCK: 20,
  KEY_ESCAPE: 27,
  KEY_ALT_RIGHT: 0,
  KEY_F1: 112,
  KEY_F2: 113,
  KEY_F3: 114,
  KEY_F4: 115,
  KEY_F5: 116,
  KEY_F6: 117,
  KEY_F7: 118,
  KEY_F8: 119,
  KEY_F9: 120,
  KEY_F10: 121,
  KEY_F11: 122,
  KEY_F12: 123,
  MOUSE_ANY: 0,
  MOUSE_1: 1,
  MOUSE_2: 2,
  MOUSE_3: 3,
  MOUSE_4: 4,
  MOUSE_5: 5,
  MOUSE_6: 6,
  MOUSE_7: 7,
  MOUSE_8: 8,
  MOUSE_9: 9,
  MOUSE_10: 10,
  TOUCH_ANY: 20,
  TOUCH_1: 21,
  TOUCH_2: 22,
  TOUCH_3: 23,
  TOUCH_4: 24,
  TOUCH_5: 25,
  TOUCH_6: 26,
  TOUCH_7: 27,
  TOUCH_8: 28,
  TOUCH_9: 29,
  TOUCH_10: 30,
  MOUSE_TOUCH_ANY: 100,
  SPEED_PIXELS_PER_SECOND: 1,
  SPEED_PIXELS_PER_FRAME: 2,
  OFFSET_TOP_LEFT: "tl",
  OFFSET_TOP_CENTER: "tc",
  OFFSET_TOP_RIGHT: "tr",
  OFFSET_MIDDLE_LEFT: "ml",
  OFFSET_MIDDLE_CENTER: "mc",
  OFFSET_MIDDLE_RIGHT: "mr",
  OFFSET_BOTTOM_LEFT: "bl",
  OFFSET_BOTTOM_CENTER: "bc",
  OFFSET_BOTTOM_RIGHT: "br",
  ALIGNMENT_LEFT: "left",
  ALIGNMENT_CENTER: "center",
  ALIGNMENT_RIGHT: "right",

  /*
  Room transition global for entering a new room with no transition (this is default)
  
  @global
  @param {Engine.Room} oldRoom The room that is left
  @param {Engine.Room} newRoom The room that is entered
   */
  ROOM_TRANSITION_NONE: function(oldRoom, newRoom, options, callback) {
    var camera, i;
    i = void 0;
    camera = void 0;
    i = 0;
    while (i < engine.cameras.length) {
      camera = engine.cameras[i];
      if (camera.room === oldRoom) {
        camera.room = newRoom;
      }
      i++;
    }
    callback();
  },

  /*
  Room transition global for entering a new room by sliding the current room to the left
  
  @global
  @param {Engine.Room} oldRoom The room that is left
  @param {Engine.Room} newRoom The room that is entered
   */
  ROOM_TRANSITION_SLIDE_SLIDE: function(oldRoom, newRoom, options, callback) {
    var animOptions, camera, i, newCam, newCams;
    i = void 0;
    camera = void 0;
    newCams = void 0;
    newCam = void 0;
    animOptions = void 0;
    newCams = [];
    oldRoom.pause();
    options = options || {};
    options.from = options.from || "right";
    animOptions = {
      easing: options.easing || "quadInOut",
      duration: options.duration || 2000,
      loop: engine.masterRoom.loops.eachFrame
    };
    i = 0;
    while (i < engine.cameras.length) {
      camera = engine.cameras[i];
      if (camera.room === oldRoom) {
        Engine.Helpers.RoomTransition.slideOut(camera, options.from, animOptions);
        newCam = new Engine.Camera(camera.captureRegion.copy(), camera.projectionRegion.copy(), newRoom);
        newCams.push(newCam);
      }
      i++;
    }
    engine.cameras.push.apply(engine.cameras, newCams);
    newCams.forEach(function(c) {
      Engine.Helpers.RoomTransition.slideIn(c, options.from, animOptions);
    });
    engine.masterRoom.loops.eachFrame.schedule(oldRoom, (function() {
      this.play();
      engine.cameras = engine.cameras.filter(function(camera) {
        return newCams.indexOf(camera) !== -1;
      });
      callback();
    }), animOptions.duration);
  },

  /*
  Room transition global for entering a new room by squeezing the old room out and sliding the new room in
  
  @global
  @param {Engine.Room} oldRoom The room that is left
  @param {Engine.Room} newRoom The room that is entered
   */
  ROOM_TRANSITION_SQUEEZE_SLIDE: function(oldRoom, newRoom, options, callback) {
    var animOptions, camera, i, newCam, newCams;
    i = void 0;
    camera = void 0;
    newCams = void 0;
    newCam = void 0;
    animOptions = void 0;
    newCams = [];
    oldRoom.pause();
    options = options || {};
    options.from = options.from || "right";
    animOptions = {
      easing: options.easing || "quadInOut",
      duration: options.duration || 2000,
      loop: engine.masterRoom.loops.eachFrame
    };
    i = 0;
    while (i < engine.cameras.length) {
      camera = engine.cameras[i];
      if (camera.room === oldRoom) {
        Engine.Helpers.RoomTransition.squeezeOut(camera, options.from, animOptions);
        newCam = new Engine.Camera(camera.captureRegion.copy(), camera.projectionRegion.copy(), newRoom);
        newCams.push(newCam);
      }
      i++;
    }
    engine.cameras.push.apply(engine.cameras, newCams);
    newCams.forEach(function(c) {
      Engine.Helpers.RoomTransition.slideIn(c, options.from, animOptions);
    });
    engine.masterRoom.loops.eachFrame.schedule(oldRoom, (function() {
      this.play();
      engine.cameras = engine.cameras.filter(function(camera) {
        return newCams.indexOf(camera) !== -1;
      });
      callback();
    }), animOptions.duration);
  },

  /*
  Room transition global for squeezing the old room out and squeezing the new room in
  
  @global
  @param {Engine.Room} oldRoom The room that is left
  @param {Engine.Room} newRoom The room that is entered
   */
  ROOM_TRANSITION_SQUEEZE_SQUEEZE: function(oldRoom, newRoom, options, callback) {
    var animOptions, camera, i, newCam, newCams;
    i = void 0;
    camera = void 0;
    newCams = void 0;
    newCam = void 0;
    animOptions = void 0;
    newCams = [];
    oldRoom.pause();
    options = options || {};
    options.from = options.from || "right";
    animOptions = {
      easing: options.easing || "quadInOut",
      duration: options.duration || 2000,
      loop: engine.masterRoom.loops.eachFrame
    };
    console.log(options.from);
    i = 0;
    while (i < engine.cameras.length) {
      camera = engine.cameras[i];
      if (camera.room === oldRoom) {
        Engine.Helpers.RoomTransition.squeezeOut(camera, options.from, animOptions);
        newCam = new Engine.Camera(camera.captureRegion.copy(), camera.projectionRegion.copy(), newRoom);
        newCams.push(newCam);
      }
      i++;
    }
    engine.cameras.push.apply(engine.cameras, newCams);
    newCams.forEach(function(c) {
      Engine.Helpers.RoomTransition.squeezeIn(c, options.from, animOptions);
    });
    engine.masterRoom.loops.eachFrame.schedule(oldRoom, (function() {
      this.play();
      engine.cameras = engine.cameras.filter(function(camera) {
        return newCams.indexOf(camera) !== -1;
      });
      callback();
    }), animOptions.duration);
  },

  /*
  Room transition global for sliding the old room out and squeezing the new room in
  
  @global
  @param {Engine.Room} oldRoom The room that is left
  @param {Engine.Room} newRoom The room that is entered
   */
  ROOM_TRANSITION_SLIDE_SQUEEZE: function(oldRoom, newRoom, options, callback) {
    var animOptions, camera, i, newCam, newCams;
    i = void 0;
    camera = void 0;
    newCams = void 0;
    newCam = void 0;
    animOptions = void 0;
    newCams = [];
    oldRoom.pause();
    options = options || {};
    options.from = options.from || "right";
    animOptions = {
      easing: options.easing || "quadInOut",
      duration: options.duration || 2000,
      loop: engine.masterRoom.loops.eachFrame
    };
    i = 0;
    while (i < engine.cameras.length) {
      camera = engine.cameras[i];
      if (camera.room === oldRoom) {
        Engine.Helpers.RoomTransition.slideOut(camera, options.from, animOptions);
        newCam = new Engine.Camera(camera.captureRegion.copy(), camera.projectionRegion.copy(), newRoom);
        newCams.push(newCam);
      }
      i++;
    }
    engine.cameras.push.apply(engine.cameras, newCams);
    newCams.forEach(function(c) {
      Engine.Helpers.RoomTransition.squeezeIn(c, options.from, animOptions);
    });
    engine.masterRoom.loops.eachFrame.schedule(oldRoom, (function() {
      this.play();
      engine.cameras = engine.cameras.filter(function(camera) {
        return newCams.indexOf(camera) !== -1;
      });
      callback();
    }), animOptions.duration);
  },

  /*
    @param {number} t The current time (of the animation)
    @param {number} b The start value
    @param {number} c The end value
    @param {number} d The animation time
    @{number} The current value (at the given time in the animation)
   */
  EASING_LINEAR: function(t, b, c, d) {
    t /= d;
    return b + c * t;
  },
  EASING_QUAD_IN: function(t, b, c, d) {
    t /= d;
    return b + c * t * t;
  },
  EASING_QUAD_OUT: function(t, b, c, d) {
    t /= d;
    return b - c * t * (t - 2);
  },
  EASING_QUAD_IN_OUT: function(t, b, c, d) {
    t = t / d * 2;
    if (t < 1) {
      return b + c * t * t / 2;
    } else {
      t--;
      return b + c * (1 - t * (t - 2)) / 2;
    }
  },
  EASING_POWER_IN: function(t, b, c, d) {
    var a;
    t /= d;
    a = c / Math.abs(c);
    return b + a * Math.pow(Math.abs(c), t);
  },
  EASING_POWER_OUT: function(t, b, c, d) {
    var a;
    t /= d;
    a = c / Math.abs(c);
    return b + c - a * Math.pow(Math.abs(c), 1 - t);
  },
  EASING_POWER_IN_OUT: function(t, b, c, d) {
    var a;
    t = t / d * 2;
    a = c / Math.abs(c);
    if (t < 1) {
      return b + a * Math.pow(Math.abs(c), t) / 2;
    } else {
      t--;
      return b + c - a * Math.pow(Math.abs(c), 1 - t) / 2;
    }
  },
  EASING_SINUS_IN_OUT: function(t, b, c, d) {
    t /= d;
    return b + c * (1 + Math.cos(Math.PI * (1 + t))) / 2;
  }
};



},{"../engine":1}],5:[function(require,module,exports){
var Engine, Loader;

Engine = require('../engine');


/*
Constructor for the Loader class.
This function will also create a load overlay which will not disappear until the hideOverlay is called.
Therefore, remember to call hideOverlay, when your game is ready to be shown.

@name Engine.Loader
@class Class for loading and storing resources.
On engine startup a Loader object is instantiated to the global variable "loader".
This loader object will also create a load overlay (the overlay saying "jsEngine loading"), this overlay will not be removed until the loader.hideOverlay() is called.
 */

module.exports = Loader = (function() {
  function Loader() {
    this.images = {};
    this.loaded = {
      classes: []
    };
    this.themes = {
      External: {
        name: "External",
        inherit: [],
        music: {},
        sfx: {},
        images: {},
        masks: {},
        textures: {},
        resourcesCount: 0,
        resourcesLoaded: 0
      }
    };
    this.loadOverlay = document.createElement("div");
    this.loadOverlay.setAttribute("style", "border: 0;position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 100;opacity: 1;");
    this.loadOverlay.id = "loadOverlay";
    this.loadOverlay.innerHTML = "<div id=\"loadOverlayText\">" + engine.loadText + "</div>";
    engine.arena.appendChild(this.loadOverlay);
    return;
  }


  /*
  Fades out the load overlay (which is automatically created by Loader's constructor).
  Remember to call this function, when your game is ready to be shown. Otherwise, the load overlay will never disappear.
  
  @param {function} callback A callback function to run when the overlay has finished fading out
   */

  Loader.prototype.hideOverlay = function(callback) {
    this.fadeCallback = callback;
    this.fadeOpacity = 1;
    this.fade = (function(_this) {
      return function() {
        var obj;
        obj = _this.loadOverlay;
        _this.fadeOpacity = Math.max(0, _this.fadeOpacity - 0.1);
        _this.fadeOpacity = Math.floor(_this.fadeOpacity * 100) / 100;
        obj.style.opacity = _this.fadeOpacity;
        if (_this.fadeOpacity !== 0) {
          setTimeout(function() {
            _this.fade();
          }, 30);
        } else {
          engine.arena.removeChild(_this.loadOverlay);
          delete _this.fade;
          if (_this.fadeCallback) {
            _this.fadeCallback();
          }
          delete _this.fadeCallback;
        }
      };
    })(this);
    this.fade();
  };


  /*
  Fetches an image from the Loader. This function will automatically be called by objects that implements the Sprite object.
  
  @param {string} resource The resource string of the image that should be fetched
  @param {string} themeName The name of the theme from which the image should be fetched. If unset, the engine's default theme will be used
  @return {HTMLImageElement} The image element corresponding to the resource string and theme
   */

  Loader.prototype.getImage = function(resource, themeName) {
    if (resource === void 0) {
      throw new Error("Missing argument: resource");
    }
    themeName = (themeName !== void 0 ? themeName : engine.defaultTheme);
    return this.getResource(resource, "images", themeName);
  };


  /*
  Fetches a sound from the Loader.
  
  @param {string} resource The resource string of the sound that should be fetched
  @param {string} themeName The name of the theme from which the sound should be fetched. If unset, the engine's default theme will be used
  @return {Engine.Sounds.Effect} A Sound object corresponding to the resource string and theme
   */

  Loader.prototype.getSound = function(resource, themeName) {
    if (resource === void 0) {
      throw new Error("Missing argument: resource");
    }
    themeName = (themeName !== void 0 ? themeName : engine.defaultTheme);
    return this.getResource(resource, "sfx", themeName);
  };


  /*
  Fetches a music track from the Loader.
  
  @param {string} resource The resource string of the track that should be fetched
  @param {string} themeName The name of the theme from which the track should be fetched. If unset, the engine's default theme will be used
  @return {Engine.Sounds.Music} A Music object corresponding to the resource string and theme
   */

  Loader.prototype.getMusic = function(resource, themeName) {
    if (resource === void 0) {
      throw new Error("Missing argument: resource");
    }
    themeName = (themeName !== void 0 ? themeName : engine.defaultTheme);
    return this.getResource(resource, "music", themeName);
  };


  /*
  Creates (or loads from cache) a mask for an image which is loaded by the Loader.
  This function is automatically used by the Collidable object for fetching masks for collision checking.
  
  @param {string} resource The resource string of the image that should be fetched
  @param {string} themeName The name of the theme from which the image should be fetched. If unset, the engine's default theme will be used
  @return {HTMLCanvasElement} A generated mask (canvas element) for the image element corresponding to the resource string and theme
   */

  Loader.prototype.getMask = function(resource, themeName) {
    var mask;
    if (resource === void 0) {
      throw new Error("Missing argument: resource");
    }
    themeName = (themeName !== void 0 ? themeName : engine.defaultTheme);
    mask = void 0;
    mask = this.getResource(resource, "masks", themeName);
    if (mask) {
      return mask;
    } else {
      mask = this.generateMask(resource);
      this.themes[themeName].masks[resource] = mask;
      return mask;
    }
  };


  /*
  Fetches a resource from the Loader's cache. Used by the getImage-, getSound- and getMusic functions.
  
  @private
  @param {string} resource The resource string of the resource that should be fetched
  @param {string} typeString A string representing the resource type, possible values are: "image", "sfx" and "music"
  @param {string} themeName The name of the theme from which the image should be fetched. If unset, the engine's default theme will be used
  @return {HTMLImageElement|Engine.Sounds.Effect|Engine.Sounds.Music} The resource corresponding to the provided resource string, resource type and theme name
   */

  Loader.prototype.getResource = function(resource, typeString, themeName) {
    var i, inh, res;
    if (resource === void 0) {
      throw new Error("Missing argument: resource");
    }
    if (typeString === void 0) {
      throw new Error("Missing argument: typeString");
    }
    if (themeName === void 0) {
      throw new Error("Missing argument: themeName");
    }
    res = void 0;
    inh = void 0;
    i = void 0;
    if (resource.indexOf("/") !== -1) {
      resource = resource.replace(/\//g, ".");
    }
    res = this.themes[themeName][typeString][resource];
    if (res === void 0) {
      i = 0;
      while (i < this.themes[themeName].inherit.length) {
        inh = this.themes[themeName].inherit[i];
        if (this.themes[inh]) {
          res = this.themes[inh][typeString][resource];
          if (res) {
            break;
          }
        }
        i++;
      }
    }
    if (res === void 0) {
      return false;
    } else {
      return res;
    }
  };


  /*
  Fetches all loaded images' resource strings (from all themes).
  
  @return {string[]} An array containing all loaded images' resource strings
   */

  Loader.prototype.getImageSources = function() {
    var currentDir, i, inheritTheme, loopThrough, object, sourceStrings;
    object = void 0;
    sourceStrings = void 0;
    currentDir = void 0;
    loopThrough = void 0;
    inheritTheme = void 0;
    i = void 0;
    object = this.themes[engine.defaultTheme].images;
    sourceStrings = [];
    currentDir = [];
    loopThrough = function(object) {
      var name, pushStr;
      pushStr = void 0;
      name = void 0;
      if (object.src !== void 0) {
        pushStr = currentDir.join(".");
        if (sourceStrings.indexOf(pushStr) === -1) {
          sourceStrings.push(pushStr);
        }
      } else {
        for (name in object) {
          if (object.hasOwnProperty(name)) {
            currentDir.push(name);
            loopThrough(object[name]);
            currentDir.pop();
          }
        }
      }
    };
    loopThrough(object);
    i = 0;
    while (i < this.themes[engine.defaultTheme].inherit.length) {
      inheritTheme = this.themes[this.themes[engine.defaultTheme].inherit[i]];
      if (inheritTheme !== void 0 && inheritTheme.images !== void 0) {
        loopThrough(inheritTheme.images);
      }
      i++;
    }
    return sourceStrings;
  };


  /*
  Fetches all loaded sounds' resource strings (from all themes).
  
  @return {string[]} An array containing all loaded sounds' resource strings
   */

  Loader.prototype.getAllSounds = function() {
    var res, resourceString, theme, themeName;
    res = void 0;
    themeName = void 0;
    theme = void 0;
    resourceString = void 0;
    res = [];
    for (themeName in this.themes) {
      if (this.themes.hasOwnProperty(themeName)) {
        theme = this.themes[themeName];
        for (resourceString in theme.sfx) {
          if (theme.sfx.hasOwnProperty(resourceString)) {
            res.push(theme.sfx[resourceString]);
          }
        }
      }
    }
    return res;
  };


  /*
  Fetches all loaded music tracks' resource strings (from all themes).
  
  @return {string[]} An array containing all loaded music tracks' resource strings
   */

  Loader.prototype.getAllMusic = function() {
    var res, resourceString, theme, themeName;
    res = void 0;
    themeName = void 0;
    theme = void 0;
    resourceString = void 0;
    res = [];
    for (themeName in this.themes) {
      if (this.themes.hasOwnProperty(themeName)) {
        theme = this.themes[themeName];
        for (resourceString in theme.music) {
          if (theme.music.hasOwnProperty(resourceString)) {
            res.push(theme.music[resourceString]);
          }
        }
      }
    }
    return res;
  };


  /*
  Loads JavaScript classes from files. The loaded classes' names must follow the following format: [ClassName].js
  
  @param {string[]} paths An array of paths to JavaScripts - containing classes - which should be loaded
  @return {boolean} True, when the classes has been loaded without any errors
   */

  Loader.prototype.loadClasses = function(paths) {
    var i, objectName;
    if (paths === void 0) {
      throw new Error("Missing argument: paths");
    }
    objectName = void 0;
    i = void 0;
    for (i in paths) {
      if (paths.hasOwnProperty(i)) {
        objectName = paths[i].match(/(\w*)\.\w+$/)[1];
        if (window[objectName]) {
          continue;
        }
        engine.loadFiles(paths[i]);
        this.loaded.classes[objectName] = paths[i];
      }
    }
    return true;
  };


  /*
  Reloads all classes. This function is very useful for applying code changes without having to refresh the browser, usually it has to be run multiple times though, to force the browser not to just load the files from its cache.
   */

  Loader.prototype.reloadAllClasses = function() {
    var i;
    i = void 0;
    for (i in this.loaded.classes) {
      if (this.loaded.classes.hasOwnProperty(i)) {
        engine.loadFiles(this.loaded.classes[i]);
      }
    }
  };


  /*
  Loads a list of themes. This function is automatically called by the Engine during its startup, for loading the themes specified by the launch options.
  
  @private
  @param {string[]} themeNames An array of theme names (as strings) to load
  @param {function} callback A callback function to run when all the themes has been loaded
   */

  Loader.prototype.loadThemes = function(themeNames, callback) {
    var codeString, i, name, req, theme, total;
    if (themeNames === void 0) {
      throw new Error("Missing argument: themeNames");
    }
    if (callback !== void 0) {
      this.onthemesloaded = callback;
    }
    name = void 0;
    req = void 0;
    i = void 0;
    total = void 0;
    theme = void 0;
    codeString = void 0;
    i = 0;
    while (i < themeNames.length) {
      name = themeNames[i];
      if (this.themes[name]) {
        continue;
      }
      req = new XMLHttpRequest();
      req.open("GET", engine.themesPath + "/" + name + "/theme.js", false);
      req.send();
      if (req.status === 404) {
        console.log("Theme not found: " + name);
        continue;
      }
      codeString = req.responseText + "\n//# sourceURL=/" + engine.themesPath + "/" + name + "/theme.js";
      eval("theme = " + codeString);
      if (theme.inherit.length) {
        this.loadThemes(theme.inherit);
      }
      theme.inherit.push("External");
      this.themes[name] = theme;
      theme.resourcesCount = 0;
      theme.resourcesLoaded = 0;
      theme.masks = {};
      theme.textures = {};
      this.loadResources(theme, theme.images, "images");
      this.loadResources(theme, theme.sfx, "sfx");
      this.loadResources(theme, theme.music, "music");
      i++;
    }
    total = 0;
    for (i in this.themes) {
      if (this.themes.hasOwnProperty(i)) {
        total += this.themes[i].resourcesCount;
      }
    }
    if (total === 0) {
      if (this.onthemesloaded) {
        this.onthemesloaded();
      }
    }
  };


  /*
  Loads resources to a theme. This function is used by loadThemes for caching the theme resources.
  
  @private
  @param {Object} theme A theme object to load the resources to
  @param {Object} object An object containing references to theme resources (like the subcategories of theme files)
  @param {string} typeString A string defining the resource type. Supported types are: "images", "sfx" and "music"
   */

  Loader.prototype.loadResources = function(theme, object, typeString) {
    var format, i, images, onload, path, res;
    if (theme === void 0) {
      throw new Error("Missing argument: theme");
    }
    if (object === void 0) {
      throw new Error("Missing argument: object");
    }
    if (typeString === void 0) {
      throw new Error("Missing argument: typeString");
    }
    onload = (function(_this) {
      return function(event) {
        if (event.target.hasAttribute("data-loaded")) {
          return;
        }
        event.target.setAttribute("data-loaded", "true");
        theme = _this.themes[event.target.getAttribute("data-theme")];
        theme.resourcesLoaded++;
        _this.checkAllLoaded();
      };
    })(this);
    for (path in object) {
      if (object.hasOwnProperty(path)) {
        switch (typeString) {
          case "images":
            res = new Image();
            format = object[path].match(/(png|jpg|jpeg|svg)/);
            if (format) {
              format = format[0];
            }
            res.src = engine.themesPath + "/" + theme.name + "/images/" + path.replace(/\./g, "/") + "." + format;
            images = object[path].match(/; *(\d+) *images?/);
            if (images) {
              res.imageLength = parseInt(images[1], 10);
            } else {
              res.imageLength = 1;
            }
            if (object[path].match(/; *bordered/)) {
              res.spacing = 1;
            } else {
              res.spacing = 0;
            }
            theme.images[path] = res;
            res.onload = onload;
            theme.resourcesCount++;
            break;
          case "sfx":
            format = false;
            i = 0;
            while (i < engine.host.supportedAudio.length) {
              if (object[path].search(engine.host.supportedAudio[i]) !== -1) {
                format = engine.host.supportedAudio[i];
              }
              i++;
            }
            if (!format) {
              console.log("Sound was not available in a supported format: " + theme.name + "/sfx/" + path.replace(/\./g, "/"));
              continue;
            }
            res = new Audio(engine.themesPath + "/" + theme.name + "/sfx/" + path.replace(/\./g, "/") + "." + format);
            theme.sfx[path] = new Engine.Sounds.Effect(res);
            if (engine.preloadSounds) {
              res.setAttribute("preload", "auto");
              res.addEventListener("canplaythrough", onload, false);
              theme.resourcesCount++;
            }
            break;
          case "music":
            format = false;
            i = 0;
            while (i < engine.host.supportedAudio.length) {
              if (object[path].search(engine.host.supportedAudio[i]) !== -1) {
                format = engine.host.supportedAudio[i];
              }
              i++;
            }
            if (!format) {
              throw new Error("Sound was not available in a supported format: " + theme.name + "/sfx/" + path.replace(/\./g, "/"));
            }
            res = new Audio(engine.themesPath + "/" + theme.name + "/music/" + path.replace(/\./g, "/") + "." + format);
            theme.music[path] = new Engine.Sounds.Music(res);
            if (engine.preloadSounds) {
              res.setAttribute("preload", "auto");
              res.addEventListener("canplaythrough", onload, false);
              theme.resourcesCount++;
            }
        }
        res.setAttribute("data-theme", theme.name);
        res.setAttribute("data-resourceString", path.replace(/\./g, "/"));
      }
    }
  };


  /*
  Loads an external resource to the built in External-theme
  
  @param {string} resourceString The proposed resource string of the resource when loaded
  @param {string} path The path to the resource's file
  @param {string} [typeString = "images"] A string defining the type of resource, can be: "images" (image file), sfx (sound effects) or "music" (background music)
  @param {function} [onLoaded = function () {}] A function to call when the resource has been loaded
  @param {string} [options = ""] A string defining the resource options (same as the string used for defining animations in a theme file)
   */

  Loader.prototype.loadExternalResource = function(resourceString, path, onLoaded, typeString, options) {
    var format, images, res, theme;
    if (resourceString === void 0) {
      throw new Error("Missing argument: resourceString");
    }
    if (path === void 0) {
      throw new Error("Missing argument: path");
    }
    typeString = typeString || "images";
    onLoaded = onLoaded || function() {};
    options = options || "";
    theme = this.themes.External;
    switch (typeString) {
      case "images":
        res = new Image();
        res.src = path;
        images = options.match(RegExp(" *(\\d+) *images?"));
        if (images) {
          res.imageLength = parseInt(images[1], 10);
        } else {
          res.imageLength = 1;
        }
        if (options.match(/; *bordered/)) {
          res.spacing = 1;
        } else {
          res.spacing = 0;
        }
        theme.images[resourceString] = res;
        res.onload = onLoaded;
        theme.resourcesCount++;
        break;
      case "sfx":
        format = path.match(/[^\.]*$/)[0];
        if (engine.host.supportedAudio.indexOf(format) === -1) {
          throw new Error("Sound format is not supported:", format);
        }
        res = new Audio(path);
        theme.sfx[resourceString] = new Engine.Sounds.Effect(res);
        if (engine.preloadSounds) {
          res.setAttribute("preload", "auto");
          res.addEventListener("canplaythrough", onLoaded, false);
          theme.resourcesCount++;
        }
        break;
      case "music":
        format = path.match(/[^\.]*$/)[0];
        if (engine.host.supportedAudio.indexOf(format) === -1) {
          throw new Error("Sound format is not supported:", format);
        }
        res = new Audio(path);
        theme.music[resourceString] = new Engine.Sounds.Music(res);
        if (engine.preloadSounds) {
          res.setAttribute("preload", "auto");
          res.addEventListener("canplaythrough", onLoaded, false);
          theme.resourcesCount++;
        }
    }
    res.setAttribute("data-theme", theme.name);
    res.setAttribute("data-resourceString", resourceString);
  };


  /*
  Generates a mask for an image specified by its resource string.
  This function is used by getMask to fetch and cache masks for each of the loaded images.
  
  @param {string} resourceString A resource string specifying the image to generate a mask for
  @param {number} alphaLimit An alpha value (0-255). Pixel having this alpha value or larger will become black on the mask, pixels with a value below the limit will become completely transparent
  @return {HTMLCanvasElement} A canvas element with the generated mask
   */

  Loader.prototype.generateMask = function(resourceString, alphaLimit) {
    var bitmap, bottom, canvas, ctx, data, image, left, length, pixel, right, top, x, y;
    if (resourceString === void 0) {
      throw new Error("Missing argument: resourceString");
    }
    alphaLimit = (alphaLimit !== void 0 ? alphaLimit : 255);
    image = engine.loader.getImage(resourceString);
    canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.imageLength = image.imageLength;
    ctx = canvas.getContext("2d");
    if (image === false) {
      throw new Error("Trying to create mask for non-existing resource: " + resourceString);
    }
    ctx.drawImage(image, 0, 0, image.width, image.height);
    bitmap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = bitmap.data;
    length = data.length / 4;
    top = bitmap.height;
    bottom = 0;
    left = bitmap.width;
    right = 0;
    pixel = 0;
    while (pixel < length) {
      if (data[pixel * 4 + 3] < alphaLimit) {
        data[pixel * 4] = 0;
        data[pixel * 4 + 1] = 0;
        data[pixel * 4 + 2] = 0;
        data[pixel * 4 + 3] = 0;
      } else {
        data[pixel * 4] = 0;
        data[pixel * 4 + 1] = 0;
        data[pixel * 4 + 2] = 0;
        data[pixel * 4 + 3] = 255;
        y = Math.floor(pixel / bitmap.width);
        x = pixel - y * bitmap.width;
        while (x >= Math.floor(image.width / image.imageLength)) {
          x -= Math.floor(image.width / image.imageLength) + image.spacing;
        }
        if (x < 0) {
          continue;
        }
        top = Math.min(y, top);
        bottom = Math.max(y + 1, bottom);
        left = Math.min(x, left);
        right = Math.max(x + 1, right);
      }
      pixel++;
    }
    ctx.putImageData(bitmap, 0, 0);
    canvas.bBox = new Engine.Geometry.Rectangle(left, top, right - left, bottom - top).getPolygon();
    return canvas;
  };


  /*
  Checks if all resources - of all themes - has been loaded. This check is automatically called any time a single resource has finished loading.
  
  @private
  @return {boolean} Whether or not all themes' resources has been successfully loaded
   */

  Loader.prototype.checkAllLoaded = function() {
    var i, loaded, theme, total;
    i = void 0;
    total = void 0;
    loaded = void 0;
    theme = void 0;
    total = 0;
    loaded = 0;
    for (i in this.themes) {
      if (this.themes.hasOwnProperty(i)) {
        theme = this.themes[i];
        total += theme.resourcesCount;
        loaded += theme.resourcesLoaded;
      }
    }
    if (loaded === total) {
      if (this.onthemesloaded) {
        this.onthemesloaded();
      }
      return true;
    }
    return false;
  };

  return Loader;

})();



},{"../engine":1}],6:[function(require,module,exports){
var Engine, ObjectCreator,
  slice = [].slice;

Engine = require('../engine');

module.exports = ObjectCreator = (function() {
  function ObjectCreator(container) {
    this.container = container;
  }

  ObjectCreator.prototype.Container = function() {
    var a, children, o;
    children = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    a = arguments;
    o = new Engine.Views.Container;
    o.addChildren.apply(o, children);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.Circle = function(x, y, radius, fillStyle, strokeStyle, lineWidth) {
    var o;
    o = new Engine.Views.Circle(x, y, radius, fillStyle, strokeStyle, lineWidth);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.Line = function(startVector, endVector, strokeStyle, lineWidth, lineCap) {
    var o;
    o = new Engine.Views.Line(startVector, endVector, strokeStyle, lineWidth, lineCap);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.Polygon = function(points, fillStyle, strokeStyle, lineWidth) {
    var o;
    o = new Engine.Views.Polygon(points, fillStyle, strokeStyle, lineWidth);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.Rectangle = function(x, y, width, height, fillStyle, strokeStyle, lineWidth) {
    var o;
    o = new Engine.Views.Rectangle(x, y, width, height, fillStyle, strokeStyle, lineWidth);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.TextBlock = function(string, x, y, width, additionalProperties) {
    var o;
    o = new Engine.Views.TextBlock(string, x, y, width, additionalProperties);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.Sprite = function(source, x, y, direction, additionalProperties) {
    var o;
    o = new Engine.Views.Sprite(source, x, y, direction, additionalProperties);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.Collidable = function(source, x, y, direction, additionalProperties) {
    var o;
    o = new Engine.Views.Collidable(source, x, y, direction, additionalProperties);
    this.container.addChildren(o);
    return o;
  };

  ObjectCreator.prototype.GameObject = function(source, x, y, direction, additionalProperties) {
    var o;
    o = new Engine.Views.GameObject(source, x, y, direction, additionalProperties);
    this.container.addChildren(o);
    return o;
  };

  return ObjectCreator;

})();



},{"../engine":1}],7:[function(require,module,exports){
var Engine, Room,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
Constructor for the Room class

@name Engine.Room
@class A room is the space wherein game objects reside.
A room holds a list of objects to draw, and a list of custom loops.
If a room is set as the engine's current room (engine.currentRoom); its objects will be drawn, and its custom loops will be executed each time the engine's main loop executes.
The engine also has a master room (engine.masterRoom), which is persistent throughout a game (this is the room where you would add persistent objects and custom loops)
@augments View.Container

@property {string} name The name of the room
@property {function} onEntered A function which will be executed when the room is entered
@property {function} onLeft A function which will be executed when the room is left
@property {Object} loops An object containing the custom loops which has been added to the room

@param {string} name The name of the room. You can use this name later, to enter the room or to remove it
@param {function} [onEntered=function () {}] A function to run when the room is entered (set as the engine's current room)
@param {function} [onLeft=function () {}] A function to run when the room is left
 */

module.exports = Room = (function(superClass) {
  extend(Room, superClass);

  function Room(name, onEntered, onLeft) {
    Room.__super__.constructor.call(this);
    this.name = (name ? name : engine.roomList.length);
    this.onEntered = (onEntered !== void 0 ? onEntered : function() {});
    this.onLeft = (onLeft !== void 0 ? onLeft : function() {});
    this.loops = {};
    this.paused = false;
    this.addLoop("eachFrame", new Engine.CustomLoop());
    engine.addRoom(this);
    return;
  }


  /*
  Prevents all the room's loops from being executed, this function is used by the engine before making room transitions
   */

  Room.prototype.pause = function() {
    this.paused = true;
  };


  /*
  Enables the room's loops after again after the room has been paused.
   */

  Room.prototype.play = function() {
    this.paused = false;
  };


  /*
  Updates all the room's loops.
  
  @private
   */

  Room.prototype.update = function() {
    var i;
    if (this.paused) {
      return;
    }
    i = void 0;
    for (i in this.loops) {
      if (this.loops.hasOwnProperty(i)) {
        this.loops[i].execute();
      }
    }
  };


  /*
  Adds a custom loop to the room.
  After being added, the loop will be executed in each frame.
  
  @param {string} name The name the use for the custom loop in the room. When added the loop can be accessed with: [The room].loops[name]
  @param {Engine.CustomLoop} loop The loop to add
   */

  Room.prototype.addLoop = function(name, loop_) {
    if (loop_ === void 0) {
      throw new Error("Missing argument: loop");
    }
    if (name === void 0) {
      throw new Error("Missing argument: name");
    }
    if (this.loops[name] !== void 0) {
      throw new Error("Name is taken: " + name);
    }
    this.loops[name] = loop_;
  };


  /*
  Removes a custom loop from the room.
  
  @param {string} name The name that the custom loop has been added as
   */

  Room.prototype.removeLoop = function(name) {
    if (name === void 0) {
      throw new Error("Missing argument: name");
    }
    if (name === "eachFrame") {
      throw new Error("The \"eachFrame\" loop cannot be removed");
    }
    delete this.loops[name];
  };


  /*
  Delete the remove-method which was inherited from View
   */

  Room.prototype.remove = void 0;

  return Room;

})(Engine.Views.Container);



},{"../engine":1}],8:[function(require,module,exports){

/*
Constructor for Circle class, uses the set function, to set the properties of the circle.

@name Engine.Geometry.Circle
@class A math class which is used for handling circles
@augments Mixin.Animatable

@property {number} x The circle's horizontal position
@property {number} y The circle's vertical position
@property {number} radius The circle's radius

@param {number} x The x-coordinate for the center of the circle
@param {number} y The y-coordinate for the center of the circle
@param {number} radius The radius for the circle
 */
var Circle;

module.exports = Circle = (function() {
  Engine.Helpers.Mixin.mixin(Circle, Engine.Mixins.Animatable);

  function Circle(x, y, radius) {
    this.set(x, y, radius);
    return;
  }


  /*
  Sets the properties of the circle.
  
  @param {number} x The x-coordinate for the center of the circle
  @param {number} y The y-coordinate for the center of the circle
  @param {number} radius The radius for the circle
  @return {Engine.Geometry.Circle} The resulting Circle object (itself)
   */

  Circle.prototype.set = function(x, y, radius) {
    x = (x !== void 0 ? x : 0);
    y = (y !== void 0 ? y : 0);
    radius = (radius !== void 0 ? radius : 0);
    this.x = x;
    this.y = y;
    this.radius = radius;
    return this;
  };


  /*
  Copies the Circle object.
  
  @return {Engine.Geometry.Circle} A copy of the Circle object (which can be modified without changing the original object)
   */

  Circle.prototype.copy = function() {
    return new this.constructor(this.x, this.y, this.radius);
  };


  /*
  Moves the Circle by adding a value to its x-coordinate and another value to its y-coordinate.
  
  @param {number} x The value to add to the x-coordinate (can be negative)
  @param {number} y The value to add to the y-coordinate (can be negative)
  @return {Engine.Geometry.Circle} The resulting Circle object (itself)
   */

  Circle.prototype.move = function(x, y) {
    if (typeof x !== "number") {
      throw new Error("Argument x should be of type: Number");
    }
    if (typeof y !== "number") {
      throw new Error("Argument y should be of type: Number");
    }
    this.x += x;
    this.y += y;
    return this;
  };


  /*
  Moves the Circle to a fixed position by setting its x- and y-coordinates.
  
  @param {number} x The x-coordinate of the position to move the Circle to
  @param {number} y The y-coordinate of the position to move the Circle to
  @return {Engine.Geometry.Circle} The resulting Circle object (itself)
   */

  Circle.prototype.moveTo = function(x, y) {
    if (typeof x !== "number") {
      throw new Error("Argument x should be of type: Number");
    }
    if (typeof y !== "number") {
      throw new Error("Argument y should be of type: Number");
    }
    this.x = x;
    this.y = y;
    return this;
  };


  /*
  Scales the Circle object by multiplying it radius with a factor.
  Please notice that, opposite to the Polygon and Line objects, the position of the Circle will not be changed by scaling it, since the center of the circle will not be scaled.
  Also: since ellipses are not supported yet, circles cannot be scaled with various factors horizontally and vertically, like the other geometric objects.
  
  @param {number} factor A factor with which to scale the Circle
  @return {Engine.Geometry.Circle} The resulting Circle object (itself)
   */

  Circle.prototype.scale = function(factor) {
    if (typeof factor !== "number") {
      throw new Error("Argument factor should be of type Number");
    }
    this.radius *= factor;
    return this;
  };


  /*
  Calculates the perimeter of the circle
  
  @return {number} The perimeter of the Circle
   */

  Circle.prototype.getPerimeter = function() {
    return this.radius * 2 * PI;
  };


  /*
  Calculates the area of the Circle.
  
  @return {number} The area of the Circle
   */

  Circle.prototype.getArea = function() {
    return pow(this.radius) * PI;
  };


  /*
  Calculates the shortest distance from the Circle object to another geometric object
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object The object to calculate the distance to
  @return {number} The distance
   */

  Circle.prototype.getDistance = function(object) {
    if (object instanceof Engine.Geometry.Vector) {
      max(0, object.getDistance(new Vector(this.x, this.y)) - this.radius);
    } else if (object instanceof Engine.Geometry.Line) {
      max(0, object.getDistance(new Vector(this.x, this.y)) - this.radius);
    } else if (object instanceof this.constructor) {
      max(0, new Vector(this.x, this.y).getDistance(new Vector(object.x, object.y)) - (this.radius + object.radius));
    } else if (object instanceof Engine.Geometry.Rectangle) {
      object.getDistance(this);
    } else if (object instanceof Engine.Geometry.Polygon) {
      object.getDistance(this);
    } else {
      throw new Error("Argument object should be of type: Vector, Line, Circle, Rectangle or Polygon");
    }
  };


  /*
  Checks whether or not the Circle contains another geometric object.
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object A geometric object to check
  @return {boolean} True if the Rectangle contains the checked object, false if not
   */

  Circle.prototype.contains = function(object) {
    var cDist, i;
    i = void 0;
    cDist = void 0;
    if (object instanceof Engine.Geometry.Vector) {
      object.copy().move(-this.x, -this.y).getLength() < this.radius;
    } else if (object instanceof Engine.Geometry.Line) {
      this.contains(object.a) && this.contains(object.b);
    } else if (object instanceof this.constructor) {
      cDist = new Engine.Geometry.Vector(object.x, object.y).move(-this.x, -this.y).getLength();
      cDist + object.radius < this.radius;
    } else if (object instanceof Engine.Geometry.Rectangle) {
      this.contains(object.getPolygon());
    } else if (object instanceof Engine.Geometry.Polygon) {
      i = 0;
      while (i < object.points.length) {
        if (!this.contains(object.points[i])) {
          return false;
        }
        i++;
      }
      true;
    } else {
      throw new Error("Argument object has to be of type: Vector, Line, Circle, Rectangle or Polygon");
    }
  };


  /*
  Checks whether or not the Circle intersects with another geometric object.
  
  @param {Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object A geometric object to check. Supported objects are
  @return {boolean} True if the Circle intersects with the checked object, false if not
   */

  Circle.prototype.intersects = function(object) {
    if (object instanceof Engine.Geometry.Line) {
      this.contains(object) === false && object.getDistance(this) <= 0;
    } else if (object instanceof this.constructor) {
      !this.contains(object) && !object.contains(this) && new Engine.Geometry.Vector(this.x, this.y).getDistance(new Engine.Geometry.Vector(object.x, object.y)) <= this.radius + object.radius;
    } else if (object instanceof Engine.Geometry.Rectangle) {
      object.getPolygon().intersects(this);
    } else if (object instanceof Engine.Geometry.Polygon) {
      object.intersects(this);
    } else {
      throw new Error("Argument object has to be of type: Line, Circle, Rectangle or Polygon");
    }
  };

  return Circle;

})();



},{}],9:[function(require,module,exports){
var Engine, Line;

Engine = require('../engine');


/*
Constructor for the Line class. Uses setFromVectors to create the line's start and end points

@name Engine.Geometry.Line
@class A math class which is used for handling lines
@augments Mixin.Animatable

@property {Engine.Geometry.Vector} a The line's starting point
@property {Engine.Geometry.Vector} b The line's ending point

@param {Engine.Geometry.Vector} startVector A Vector representing the start point of the line
@param {Engine.Geometry.Vector} endVector A Vector representing the end point of the line
 */

module.exports = Line = (function() {
  function Line(startVector, endVector) {
    startVector = (startVector !== void 0 ? startVector : new Engine.Geometry.Vector());
    endVector = (endVector !== void 0 ? endVector : new Engine.Geometry.Vector());
    this.setFromVectors(startVector, endVector);
    return;
  }


  /*
  Sets the start- and end points from two Vector's.
  
  @param {Engine.Geometry.Vector} startVector A Vector representing the start point of the line
  @param {Engine.Geometry.Vector} endVector A Vector representing the end point of the line
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.setFromVectors = function(startVector, endVector) {
    if (!startVector instanceof Engine.Geometry.Vector) {
      throw new Error("Argument startVector should be of type: Vector");
    }
    if (!endVector instanceof Engine.Geometry.Vector) {
      throw new Error("Argument endVector should be of type: Vector");
    }
    this.a = startVector;
    this.b = endVector;
    return this;
  };


  /*
  Sets the start- and end points directly from x- and y-coordinates.
  
  @param {number} x1 The start points' x-coordinate
  @param {number} y1 The start points' y-coordinate
  @param {number} x2 The end points' x-coordinate
  @param {number} y2 The end points' y-coordinate
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.setFromCoordinates = function(x1, y1, x2, y2) {
    x1 = (x1 !== void 0 ? x1 : 0);
    y1 = (y1 !== void 0 ? y1 : 0);
    x2 = (x2 !== void 0 ? x2 : 0);
    y2 = (y2 !== void 0 ? y2 : 0);
    this.a = new Engine.Geometry.Vector(x1, y1);
    this.b = new Engine.Geometry.Vector(x2, y2);
    return this;
  };


  /*
  Copies the Line object
  
  @return {Engine.Geometry.Line} A copy of the Line object (which can be modified without changing the original object)
   */

  Line.prototype.copy = function() {
    return new this.constructor(this.a, this.b);
  };


  /*
  Moves the line by moving the start- and the end point
  
  @param {number} x The value to add to both points' x-coordinates
  @param {number} y The value to add to both points' y-coordinates
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.move = function(x, y) {
    this.a.move(x, y);
    this.b.move(x, y);
    return this;
  };


  /*
  Rotates the line around the zero-vector.
  
  @param {number} direction The number of radians to rotate the line
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.rotate = function(direction) {
    if (typeof direction !== "number") {
      throw new Error("Argument direction should be of type: Number");
    }
    this.a.rotate(direction);
    this.b.rotate(direction);
    return this;
  };


  /*
  Scales the line by multiplying the start- and end points
  
  @param {number} scaleH A factor with which to scale the Line horizontally.
  @param {number} [scaleV=scaleH] A factor with which to scale the Line vertically
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.scale = function(scaleH, scaleV) {
    this.a.scale(scaleH, scaleV);
    this.b.scale(scaleH, scaleV);
    return this;
  };


  /*
  Adds a vector to the start- and end points of the line.
  Can by used for the same purpose as move, but takes a vector as argument.
  
  @param {Engine.Geometry.Vector} vector A vector to add to the line's start- and end points
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.add = function(vector) {
    this.a.add(vector);
    this.b.add(vector);
    return this;
  };


  /*
  Subtracts a vector from the start- and end points of the line.
  
  @param {Engine.Geometry.Vector} vector A vector to subtract from the line's start- and end points
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.subtract = function(vector) {
    this.a.substract(vector);
    this.b.substract(vector);
    return this;
  };


  /*
  Divides the start- and end points of the line with a vector.
  
  @param {Engine.Geometry.Vector} vector A vector to divide the line's start- and end points with
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.divide = function(vector) {
    this.a.divide(vector);
    this.b.divide(vector);
    return this;
  };


  /*
  Multiplies the start- and end points of the line with a vector.
  
  @param {Engine.Geometry.Vector} vector A vector to multiply the line's start- and end points with
  @return {Engine.Geometry.Line} The resulting Line object (itself)
   */

  Line.prototype.multiply = function(vector) {
    this.a.multiply(vector);
    this.b.multiply(vector);
    return this;
  };


  /*
  Checks whether the line intersects with another line or polygon.
  
  @param {Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object Geometric object to check for an intersection with
  @return {boolean} True if the checked object intersects with the line, false if not
   */

  Line.prototype.intersects = function(object) {
    var c1, c2;
    if (object instanceof this.constructor) {
      c1 = void 0;
      c2 = void 0;
      c1 = (this.b.x - this.a.x) * (object.a.y - this.b.y) - (object.a.x - this.b.x) * (this.b.y - this.a.y);
      c2 = (this.b.x - this.a.x) * (object.b.y - this.b.y) - (object.b.x - this.b.x) * (this.b.y - this.a.y);
      if (c1 * c2 > 0) {
        return false;
      }
      c1 = (object.b.x - object.a.x) * (this.a.y - object.b.y) - (this.a.x - object.b.x) * (object.b.y - object.a.y);
      c2 = (object.b.x - object.a.x) * (this.b.y - object.b.y) - (this.b.x - object.b.x) * (object.b.y - object.a.y);
      c1 * c2 < 0;
    } else if (object instanceof Engine.Geometry.Circle) {
      object.intersects(this);
    } else if (object instanceof Engine.Geometry.Rectangle) {
      object.getPolygon().intersects(this);
    } else if (object instanceof Engine.Geometry.Polygon) {
      object.intersects(this);
    } else {
      throw new Error("Argument object should be of type: Line, Rectangle, Circle or Polygon");
    }
  };


  /*
  Calculates the length of the line.
  
  @return {number} The length of the line
   */

  Line.prototype.getLength = function() {
    return this.b.copy().subtract(this.a).getLength();
  };


  /*
  Calculates the shortest distance from the Line object to another geometric object
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object The object to calculate the distance to
  @return {number} The distance
   */

  Line.prototype.getDistance = function(object) {
    var ab, ac, ba, bc;
    ba = void 0;
    ab = void 0;
    bc = void 0;
    ac = void 0;
    if (object instanceof Engine.Geometry.Vector) {
      ba = this.a.copy().subtract(this.b);
      ab = this.b.copy().subtract(this.a);
      bc = object.copy().subtract(this.b);
      ac = object.copy().subtract(this.a);
      if (ab.getDot(bc) > 0) {
        bc.getLength();
      } else if (ba.getDot(ac) > 0) {
        ac.getLength();
      } else {
        Math.abs(ab.getCross(ac) / ab.getLength());
      }
    } else if (object instanceof this.constructor) {
      if (this.intersects(object)) {
        0;
      } else {
        Math.min(this.getDistance(object.a), this.getDistance(object.b), object.getDistance(this.a), object.getDistance(this.b));
      }
    } else if (object instanceof Engine.Geometry.Rectangle) {
      object.getDistance(this);
    } else if (object instanceof Engine.Geometry.Circle) {
      object.getDistance(this);
    } else {
      throw new Error("Argument object should be of type: Vector, Line, Circle, Rectangle or Polygon");
    }
  };


  /*
  Creates a rectangular polygon based on the line segment and a width
  
  @param {Number} width The wished width of the created polygon
  @param {String} lineCap The type of line capsulation, supported types are: "butt", "square", "round"
   */

  Line.prototype.createPolygonFromWidth = function(width, lineCap) {
    var a, angle, b, c, d, i, ort, points, r, segmentRad, startAngle, v;
    v = void 0;
    r = void 0;
    ort = void 0;
    a = void 0;
    b = void 0;
    c = void 0;
    d = void 0;
    points = void 0;
    i = void 0;
    startAngle = void 0;
    segmentRad = void 0;
    angle = void 0;
    lineCap = lineCap || "butt";
    v = this.a.copy().subtract(this.b);
    v.set(v.y, -v.x);
    r = (width / 2) / v.getLength();
    ort = v.scale(r);
    if (lineCap !== "round") {
      a = this.a.copy().add(ort);
      b = this.a.copy().subtract(ort);
      c = this.b.copy().subtract(ort);
      d = this.b.copy().add(ort);
      if (lineCap === "square") {
        a.move(-ort.y, ort.x);
        b.move(-ort.y, ort.x);
        c.move(ort.y, -ort.x);
        d.move(ort.y, -ort.x);
      }
      return new Engine.Geometry.Polygon([a, b, c, d]);
    } else {
      points = new Array(32);
      startAngle = ort.getDirection();
      width /= 2;
      segmentRad = Math.PI / 15;
      i = 0;
      while (i < 16) {
        angle = startAngle + segmentRad * i;
        points[i] = new Engine.Geometry.Vector(this.a.x + width * Math.cos(angle), this.a.y + width * Math.sin(angle));
        i++;
      }
      i = 0;
      while (i < 16) {
        angle = startAngle + segmentRad * (i + 15);
        points[i + 16] = new Engine.Geometry.Vector(this.b.x + width * Math.cos(angle), this.b.y + width * Math.sin(angle));
        i++;
      }
      return new Engine.Geometry.Polygon(points);
    }
  };


  /*
  Creates a polygon with the same points as the line.
  
  @return {Engine.Geometry.Polygon} The created Polygon object
   */

  Line.prototype.getPolygon = function() {
    return new Engine.Geometry.Polygon([this.a.copy(), this.b.copy()]);
  };

  return Line;

})();



},{"../engine":1}],10:[function(require,module,exports){
var Engine, Polygon;

Engine = require('../engine');

module.exports = Polygon = (function() {

  /*
  The constructor for the Polygon class. Uses the setFromPoints-function to set the points of the polygon.
  
  @name Engine.Geometry.Polygon
  @class A math class which is used for handling polygons
  @property {Engine.Geometry.Vector[]} points An array of the polygon's points. Each point is connect to the previous- and next points, and the first and last points are connected
  @param {Engine.Geometry.Vector[]} points An array of Vector's which are to be used as points for the polygon. Keep in mind that the polygon will NOT copy the points, so changing another reference to one of the added points will change the point inside the polygon.
   */
  function Polygon(points) {
    this.setFromPoints(points);
    return;
  }


  /*
  Sets the points of the polygon from Vector's.
  
  @param {Engine.Geometry.Vector[]} points An array of Vector's which are to be used as points for the polygon. Keep in mind that the polygon will NOT copy the points, so changing another reference to one of the added points will change the point inside the polygon.
  @return {Object} The resulting Polygon object (itself)
   */

  Polygon.prototype.setFromPoints = function(points) {
    this.points = points;
    return this;
  };


  /*
  Sets the points of the polygon from a list on point coordinates. Please notice that this function can take as an infinite number of x- and y coordinates as arguments.
  
  @param {number} x1 The x-coordinate for the first point in the polygon
  @param {number} y1 The y-coordinate for the first point in the polygon
  @param {number} x2 The x-coordinate for the second point ...
  @param {number} y2 The y-coordinate for the second point ...
  @param {number} x3 The x-coordinate for the third point ...
  @param {number} y3 The y-coordinate for the third point ...
  @return {Polygon} The resulting Polygon object (itself)
   */

  Polygon.prototype.setFromCoordinates = function(x1, y1, x2, y2, x3, y3) {
    var i, numPoints, x, y;
    numPoints = floor(arguments.length / 2);
    this.points = [];
    i = 0;
    while (i < numPoints) {
      x = arguments[i * 2];
      y = arguments[i * 2 + 1];
      if (typeof x !== "number" || typeof y !== "number") {
        throw new Error("All arguments should be of type: Number");
      }
      this.points.push(new Engine.Geometry.Vector(x, y));
      i++;
    }
    return this;
  };


  /*
  Gets the polygons points as a list of coordinates
  
  @return {Array} An array of x- and y values
   */

  Polygon.prototype.getCoordinates = function() {
    var coords, i, len;
    coords = [];
    len = this.points.length;
    i = 0;
    while (i < len) {
      coords.push(this.points[i].x, this.points[i].y);
      i++;
    }
    return coords;
  };


  /*
  Moves the Polygon object by moving all of its points.
  
  @param {number} x The value to add to all points' x-coordinates
  @param {number} y The value to add to all points' y-coordinates
  @return {Engine.Geometry.Polygon} The resulting Polygon object (itself)
   */

  Polygon.prototype.move = function(x, y) {
    if (typeof x !== "number") {
      throw new Error("Argument x should be of type Number");
    }
    if (typeof y !== "number") {
      throw new Error("Argument y should be of type Number");
    }
    return this.add(new Engine.Geometry.Vector(x, y));
  };


  /*
  Adds a vector to all points.
  
  @param {Engine.Geometry.Vector} vector A Vector to add to all points
  @return {Engine.Geometry.Polygon} The resulting Polygon object (itself)
   */

  Polygon.prototype.add = function(vector) {
    var i;
    if (!vector instanceof Engine.Geometry.Vector) {
      throw new Error("Argument vector should be of type Vector");
    }
    i = 0;
    while (i < this.points.length) {
      this.points[i].add(vector);
      i++;
    }
    return this;
  };


  /*
  Rotates the Polygon object by rotating all of its points around the zero vector.
  
  @param {number} direction The number of radians to rotate the polygon
  @return {Engine.Geometry.Polygon} The resulting Polygon object (itself)
   */

  Polygon.prototype.rotate = function(direction) {
    var i;
    if (typeof direction !== "number") {
      throw new Error("Argument direction should be of type Number");
    }
    i = 0;
    while (i < this.points.length) {
      this.points[i].rotate(direction);
      i++;
    }
    return this;
  };


  /*
  Scales the polygon by multiplying all of its points
  
  @param {number} scaleH A factor with which to scale the Polygon horizontally. If scaleH is undefined, both width and height will be scaled after this factor
  @param {number} scaleV A factor with which to scale the Polygon vertically
  @return {Engine.Geometry.Polygon} The resulting Polygon object (itself)
   */

  Polygon.prototype.scale = function(scaleH, scaleV) {
    var i;
    i = 0;
    while (i < this.points.length) {
      this.points[i].scale(scaleH, scaleV);
      i++;
    }
    return this;
  };


  /*
  Copies the Polygon object
  
  @return {Engine.Geometry.Polygon} A copy of the Polygon object (which can be modified without changing the original object)
   */

  Polygon.prototype.copy = function() {
    return new this.constructor(this.getPoints());
  };


  /*
  Fetches all of the polygon's points as Vector objects
  
  @return {Engine.Geometry.Vector} An array containing all the points of the polygon, as Vector objects
   */

  Polygon.prototype.getPoints = function() {
    var i, points;
    points = [];
    i = 0;
    while (i < this.points.length) {
      points.push(this.points[i].copy());
      i++;
    }
    return points;
  };


  /*
  Fetches all of the polygon's sides as Line objects.
  
  @return {Engine.Geometry.Vector} An array containing all of the polygon's sides as Line objects
   */

  Polygon.prototype.getLines = function() {
    var i, lines, points, to;
    lines = [];
    points = this.points;
    i = 0;
    while (i < points.length) {
      to = (i === points.length - 1 ? 0 : i + 1);
      lines.push(new Engine.Geometry.Line(points[i], points[to]));
      i++;
    }
    return lines;
  };


  /*
  Calculates the bounding rectangle of the polygon
  
  @return {Engine.Geometry.Rectangle} The bounding rectangle
   */

  Polygon.prototype.getBoundingRectangle = function() {
    var endVector, i, startVector;
    if (this.points.length === 0) {
      throw new Error("Cannot create bounding rectangle for pointless polygon");
    }
    startVector = new Engine.Geometry.Vector(this.points[0].x, this.points[0].y);
    endVector = startVector.copy();
    i = 0;
    while (i < this.points.length) {
      startVector.x = min(this.points[i].x, startVector.x);
      startVector.y = min(this.points[i].y, startVector.y);
      endVector.x = max(this.points[i].x, endVector.x);
      endVector.y = max(this.points[i].y, endVector.y);
      i++;
    }
    return new Engine.Geometry.Rectangle().setFromVectors(startVector, endVector.subtract(startVector));
  };


  /*
  Calculates the shortest distance from the Polygon object to another geometric object
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object The object to calculate the distance to
  @return {number} The distance
   */

  Polygon.prototype.getDistance = function(object) {
    var dist, i, ii, lines, objLines, pVector;
    dist = MAX_INTEGER;
    lines = this.getLines();
    if (object instanceof Engine.Geometry.Vector) {
      i = 0;
      while (i < lines.length) {
        dist = min(dist, lines[i].getDistance(object));
        if (dist < 0) {
          break;
        }
        i++;
      }
      dist;
    } else if (object instanceof Engine.Geometry.Line) {
      i = 0;
      while (i < lines.length) {
        dist = min(dist, lines[i].getDistance(object));
        if (dist < 0) {
          break;
        }
        i++;
      }
      dist;
    } else if (object instanceof Engine.Geometry.Circle) {
      pVector = new Engine.Geometry.Vector(object.x, object.y);
      i = 0;
      while (i < lines.length) {
        dist = min(dist, lines[i].getDistance(pVector));
        if (dist < 0) {
          break;
        }
        i++;
      }
      max(0, dist - object.radius);
    } else if (object instanceof Engine.Geometry.Rectangle) {
      object.getDistance(this);
    } else if (object instanceof this.constructor) {
      objLines = object.getLines();
      i = 0;
      while (i < lines.length) {
        ii = 0;
        while (ii < objLines.length) {
          dist = min(dist, lines[i].getDistance(objLines[ii]));
          if (dist < 0) {
            break;
          }
          ii++;
        }
        if (dist < 0) {
          break;
        }
        i++;
      }
      dist;
    } else {
      throw new Error("Argument object should be of type: Vector, Line, Circle, Rectangle or Polygon");
    }
  };


  /*
  Checks whether or not the Polygon contains another geometric object.
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle} object A geometric object to check
  @return {boolean} True if the Polygon contains the checked object, false if not
   */

  Polygon.prototype.contains = function(object) {
    if (object instanceof Engine.Geometry.Vector) {
      this.intersects(new Engine.Geometry.Line().setFromCoordinates(-123456, -98765, object.x, object.y), true) % 2;
    } else if (object instanceof Engine.Geometry.Line) {
      !this.intersects(object) && this.contains(object.a);
    } else if (object instanceof Engine.Geometry.Circle) {
      if (this.contains(new Engine.Geometry.Vector(object.x, object.y))) {
        !this.intersects(object);
      } else {
        false;
      }
    } else if (object instanceof Engine.Geometry.Rectangle) {
      this.contains(object.getPolygon());
    } else if (object instanceof this.constructor) {
      object.points.length > 0 && !this.intersects(object) && this.contains(object.points[0]);
    } else {
      throw new Error("Argument object has to be of type: Vector, Line, Rectangle or Polygon");
    }
  };


  /*
  Checks whether or not the Polygon intersects with another geometric object.
  
  @param {Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object A geometric object to check for intersections with
  @param {boolean} [countIntersections=true] A geometric object to check for intersections with
  @return {boolean} True if the Polygon intersects with the checked object, false if not
   */

  Polygon.prototype.intersects = function(object, countIntersections) {
    var i, ii, intersectionCount, line, lines, oLine, oLines;
    countIntersections = (countIntersections !== void 0 ? countIntersections : false);
    if (countIntersections) {
      intersectionCount = 0;
    }
    if (object instanceof Engine.Geometry.Line) {
      lines = this.getLines();
      i = 0;
      while (i < lines.length) {
        line = lines[i];
        if (line.intersects(object)) {
          if (countIntersections) {
            intersectionCount++;
          } else {
            return true;
          }
        }
        i++;
      }
    } else if (object instanceof Engine.Geometry.Circle) {
      lines = this.getLines();
      i = 0;
      while (i < lines.length) {
        if (object.intersects(lines[i])) {
          if (countIntersections) {
            intersectionCount++;
          } else {
            return true;
          }
        }
        i++;
      }
    } else if (object instanceof Engine.Geometry.Rectangle) {
      return this.intersects(object.getPolygon());
    } else if (object instanceof this.constructor) {
      lines = this.getLines();
      oLines = object.getLines();
      i = 0;
      while (i < lines.length) {
        line = lines[i];
        ii = 0;
        while (ii < oLines.length) {
          oLine = oLines[ii];
          if (line.intersects(oLine)) {
            if (countIntersections) {
              intersectionCount++;
            } else {
              return true;
            }
          }
          ii++;
        }
        i++;
      }
    } else {
      throw new Error("Argument object has to be of type: Line, Circle, Rectangle or Polygon");
    }
    if (countIntersections) {
      return intersectionCount;
    } else {
      return false;
    }
  };

  return Polygon;

})();



},{"../engine":1}],11:[function(require,module,exports){
var Engine, Rectangle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
The constructor for the Rectangle class. Uses the set-function to set the properties of the rectangle.

@name Engine.Geometry.Rectangle
@class A rectangle class which is used for handling non-rotated rectangles
@augments Vector

@property {number} x The top left corner's x-coordinate
@property {number} y The top left corner's y-coordinate
@property {number} width The width of the rectangle
@property {number} height The height of the rectangle

@param {number} x The x-coordinate for the rectangle's top left corner
@param {number} y The y-coordinate for the rectangle's top left corner
@param {number} width The width of the rectangle
@param {number} height The height of the rectangle
 */

module.exports = Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  Engine.Helpers.Mixin.mixin(Rectangle, Engine.Mixins.Animatable);

  function Rectangle(x, y, width, height, fillStyle, strokeStyle, lineWidth) {
    this.set(x, y, width, height);
  }


  /*
  Sets the properties of the rectangle.
  
  @param {number} x The x-coordinate for the rectangle's top left corner
  @param {number} y The y-coordinate for the rectangle's top left corner
  @param {number} width The width of the rectangle
  @param {number} height The height of the rectangle
  @return {Engine.Geometry.Rectangle} The resulting Rectangle object (itself)
   */

  Rectangle.prototype.set = function(x, y, width, height) {
    this.x = (x !== void 0 ? x : 0);
    this.y = (y !== void 0 ? y : 0);
    this.width = (width !== void 0 ? width : 0);
    this.height = (height !== void 0 ? height : 0);
    return this;
  };


  /*
  Sets the properties of the rectangle from two vectors: one representing the position of the top left corner, another representing the width and height of the rectangle.
  
  @param {Engine.Geometry.Vector} position A Vector representing the position of the top left corner to set for the Rectangle
  @param {Engine.Geometry.Vector} size A Vector representing the size (width and height) to set for the Rectangle
  @return {Engine.Geometry.Rectangle} The resulting Rectangle object (itself)
   */

  Rectangle.prototype.setFromVectors = function(position, size) {
    position = (position !== void 0 ? position : new Engine.Geometry.Vector());
    size = (size !== void 0 ? size : new Engine.Geometry.Vector());
    this.x = position.x;
    this.y = position.y;
    this.width = size.x;
    this.height = size.y;
    return this;
  };


  /*
  Copies the Rectangle object
  
  @return {Engine.Geometry.Rectangle} A copy of the Rectangle object (which can be modified without changing the original object)
   */

  Rectangle.prototype.copy = function() {
    return new this.constructor(this.x, this.y, this.width, this.height);
  };


  /*
  Moves the Rectangle by adding a value to its x-coordinate and another value to its y-coordinate.
  
  @param {number} x The value to add to the x-coordinate (can be negative)
  @param {number} y The value to add to the y-coordinate (can be negative)
  @return {Engine.Geometry.Rectangle} The resulting Rectangle object (itself)
   */

  Rectangle.prototype.move = function(x, y) {
    if (typeof x !== "number") {
      throw new Error("Argument x should be of type: Number");
    }
    if (typeof y !== "number") {
      throw new Error("Argument y should be of type: Number");
    }
    this.x += x;
    this.y += y;
    return this;
  };


  /*
  Moves the Rectangle to a fixed position by setting its x- and y-coordinates.
  
  @param {number} x The x-coordinate of the position to move the Rectangle to
  @param {number} y The y-coordinate of the position to move the Rectangle to
  @return {Engine.Geometry.Rectangle} The resulting Rectangle object (itself)
   */

  Rectangle.prototype.moveTo = function(x, y) {
    if (typeof x !== "number") {
      throw new Error("Argument x should be of type: Number");
    }
    if (typeof y !== "number") {
      throw new Error("Argument y should be of type: Number");
    }
    this.x = x;
    this.y = y;
    return this;
  };


  /*
  Calculates the overlapping area of the rectangle and another rectangle
  @param  {Engine.Geometry.Rectangle} rectangle The rectangle to use for the operation
  @return {Engine.Geometry.Rectangle|boolean} The overlapping rectangle, or false if there is no overlap
   */

  Rectangle.prototype.getOverlap = function(rectangle) {
    var crop, rx2, ry2, x2, y2;
    x2 = void 0;
    y2 = void 0;
    rx2 = void 0;
    ry2 = void 0;
    crop = void 0;
    x2 = this.x + this.width;
    y2 = this.y + this.height;
    rx2 = rectangle.x + rectangle.width;
    ry2 = rectangle.y + rectangle.height;
    crop = new Engine.Geometry.Rectangle();
    crop.x = (rectangle.x > this.x ? rectangle.x : this.x);
    crop.y = (rectangle.y > this.y ? rectangle.y : this.y);
    x2 = (rx2 > x2 ? x2 : rx2);
    y2 = (ry2 > y2 ? y2 : ry2);
    crop.width = x2 - crop.x;
    crop.height = y2 - crop.y;
    if (crop.width <= 0 || crop.height <= 0) {
      return false;
    } else {
      return crop;
    }
  };


  /*
  Scales the Rectangle by multiplying the width and height values.
  Please notice that, opposed to the Polygon and Line objects, the position of the Rectangle will not be changed by scaling it, since the position of the top left corner will not be scaled.
  
  @param {number} scaleH A factor with which to scale the Rectangle horizontally. If scaleH is undefined, both width and height will be scaled after this factor
  @param {number} scaleV A factor with which to scale the Rectangle vertically
  @return {Engine.Geometry.Rectangle} The resulting Rectangle object (itself)
   */

  Rectangle.prototype.scale = function(scaleH, scaleV) {
    if (typeof scaleH !== "number") {
      throw new Error("Argument scaleH should be of type Number");
    }
    scaleV = (scaleV !== void 0 ? scaleV : scaleH);
    this.width *= scaleH;
    this.height *= scaleV;
    return this;
  };


  /*
  Calculates the bounding rectangle of the of the two rectangles
  
  @param {Engine.Geometry.Rectangle} rectangle The rectangle to use for the calculation
  @return {Engine.Geometry.Rectangle} The bounding rectangle for the two rectangles
   */

  Rectangle.prototype.getBoundingRectangle = function(rectangle) {
    var crop, rx2, ry2, x2, y2;
    x2 = void 0;
    y2 = void 0;
    rx2 = void 0;
    ry2 = void 0;
    crop = void 0;
    x2 = this.x + this.width;
    y2 = this.y + this.height;
    rx2 = rectangle.x + rectangle.width;
    ry2 = rectangle.y + rectangle.height;
    crop = new Engine.Geometry.Rectangle();
    crop.x = (rectangle.x < this.x ? rectangle.x : this.x);
    crop.y = (rectangle.y < this.y ? rectangle.y : this.y);
    x2 = (rx2 < x2 ? x2 : rx2);
    y2 = (ry2 < y2 ? y2 : ry2);
    crop.width = x2 - crop.x;
    crop.height = y2 - crop.y;
    return crop;
  };


  /*
  Creates a polygon with the same points as the rectangle.
  
  @return {Engine.Geometry.Polygon} The created Polygon object
   */

  Rectangle.prototype.getPolygon = function() {
    return new Engine.Geometry.Polygon(this.getPoints());
  };


  /*
  Fetches the Rectangles points.
  
  @return {Engine.Geometry.Vector[]} Array of points, in the following order: top left corner, top right corner, bottom right corner, bottom left corner
   */

  Rectangle.prototype.getPoints = function() {
    return [new Engine.Geometry.Vector(this.x, this.y), new Engine.Geometry.Vector(this.x + this.width, this.y), new Engine.Geometry.Vector(this.x + this.width, this.y + this.height), new Engine.Geometry.Vector(this.x, this.y + this.height)];
  };


  /*
  Calculates the area of the Rectangle.
  
  @return {number} The area of the Rectangle
   */

  Rectangle.prototype.getArea = function() {
    return this.width * this.height;
  };


  /*
  Calculates the diagonal length of the Rectangle
  
  @return {number} The diagonal length of the Rectangle
   */

  Rectangle.prototype.getDiagonal = function() {
    return Rectangle.sqrt(Rectangle.pow(this.width, 2) + Rectangle.pow(this.height, 2));
  };


  /*
  Calculates the shortest distance from the Rectangle object to another geometric object
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object The object to calculate the distance to
  @return {number} The distance
   */

  Rectangle.prototype.getDistance = function(object) {
    return this.getPolygon().getDistance(object);
  };


  /*
  Checks whether or not the Rectangle contains another geometric object.
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object A geometric object to check
  @return {boolean} True if the Rectangle contains the checked object, false if not
   */

  Rectangle.prototype.contains = function(object) {
    if (object instanceof this.constructor) {
      return this.contains(new Engine.Geometry.Vector(object.x, object.y)) && this.contains(new Engine.Geometry.Vector(object.x + object.width, object.y + object.height));
    }
    if (object instanceof Engine.Geometry.Line) {
      return this.contains(object.a) && this.contains(object.b);
    }
    if (object instanceof Engine.Geometry.Vector) {
      return object.x > this.x && object.x < this.x + this.width && object.y > this.y && object.y < this.y + this.height;
    }
    return this.getPolygon().contains(object);
  };


  /*
  Checks whether or not the Rectangle intersects with another geometric object.
  
  @param {Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object A geometric object to check
  @return {boolean} True if the Polygon intersects with the checked object, false if not
   */

  Rectangle.prototype.intersects = function(object) {
    return this.getPolygon().intersects(object);
  };

  return Rectangle;

})(Engine.Geometry.Vector);



},{"../engine":1}],12:[function(require,module,exports){
var Engine, Vector;

Engine = require('../engine');


/*
Constructor for the Vector class. Uses set-function to set the vector from x- and y values.

@name Engine.Geometry.Vector
@class A math class which is used for handling two-dimensional vectors
@augments Mixin.Animatable

@property {number} x The x-value of the vector
@property {number} y The y-value of the vector
@param {number} [x=0] The x-value to set for the vector
@param {number} [y=0] The y-value to set for the vector
 */

module.exports = Vector = (function() {
  function Vector(x, y) {
    this.set(x, y);
    return;
  }


  /*
  Sets the vector from x- and y values.
  
  @param {number} [x=0] The x-value to set for the vector
  @param {number} [y=0] The y-value to set for the vector
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.set = function(x, y) {
    this.x = (x !== void 0 ? x : 0);
    this.y = (y !== void 0 ? y : 0);
    return this;
  };


  /*
  Calculates and sets the vector from a direction and a length.
  
  @param {number} direction The direction (in radians)
  @param {number} length The length
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.setFromDirection = function(direction, length) {
    if (typeof direction !== "number") {
      throw new Error("Argument direction should be of type: Number");
    }
    if (typeof length !== "number") {
      throw new Error("Argument length should be of type: Number");
    }
    this.x = Math.cos(direction) * length;
    this.y = Math.sin(direction) * length;
    return this;
  };


  /*
  Copies the Vector object
  
  @return {Engine.Geometry.Vector} A copy of the Vector object (which can be modified without changing the original object)
   */

  Vector.prototype.copy = function() {
    return new this.constructor(this.x, this.y);
  };


  /*
  Moves the vector by adding a value to its x-property and another value to its y-property.
  
  @param {number} x The value to add to the x-property (can be negative)
  @param {number} y The value to add to the y-property (can be negative)
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.move = function(x, y) {
    if (typeof x !== "number") {
      throw new Error("Argument x should be of type: Number");
    }
    if (typeof y !== "number") {
      throw new Error("Argument y should be of type: Number");
    }
    this.x += x;
    this.y += y;
    return this;
  };


  /*
  Rotates the vector around the zero-vector.
  
  @param {number} direction The number of radians to rotate the vector
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.rotate = function(direction) {
    if (typeof direction !== "number") {
      throw new Error("Argument direction should be of type: Number");
    }
    this.setFromDirection(this.getDirection() + direction, this.getLength());
    return this;
  };


  /*
  Scales the vector by multiplying the x- and y values.
  
  @param {number} scaleH A factor with which to scale the Vector horizontally. If scaleH is undefined, both width and height will be scaled after this factor
  @param {number} scaleV A factor with which to scale the Vector vertically
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.scale = function(scaleH, scaleV) {
    if (typeof scaleH !== "number") {
      throw new Error("Argument scaleH should be of type Number");
    }
    scaleV = (scaleV !== void 0 ? scaleV : scaleH);
    this.x *= scaleH;
    this.y *= scaleV;
    return this;
  };


  /*
  Adds another vector to the Vector.
  Can by used for the same purpose as move, but takes a vector as argument.
  
  @param {Engine.Geometry.Vector} vector A vector to add to the Vector
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.add = function(vector) {
    if (vector instanceof this.constructor) {
      this.x += vector.x;
      this.y += vector.y;
    } else if (typeof vector === "number") {
      this.x += vector;
      this.y += vector;
    } else {
      throw new Error("Argument vector should be of type Vector or Number");
    }
    return this;
  };


  /*
  Subtracts another vector from the Vector.
  
  @param {Engine.Geometry.Vector} vector A vector to subtract from the Vector
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.subtract = function(vector) {
    if (vector instanceof this.constructor) {
      this.x -= vector.x;
      this.y -= vector.y;
    } else if (typeof vector === "number") {
      this.x -= vector;
      this.y -= vector;
    } else {
      throw new Error("Argument vector should be of type Vector or Number");
    }
    return this;
  };


  /*
  Divides the Vector with another vector.
  
  @param {Engine.Geometry.Vector} vector A vector to divide the Vector with
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.divide = function(vector) {
    if (vector instanceof this.constructor) {
      this.x /= vector;
      this.y /= vector;
    } else if (typeof vector === "number") {
      this.x /= vector;
      this.y /= vector;
    } else {
      throw new Error("Argument vector should be of type Vector or Number");
    }
    return this;
  };


  /*
  Multiplies the Vector with another vector.
  
  @param {Engine.Geometry.Vector} vector A vector to multiply the Vector with
  @return {Engine.Geometry.Vector} The resulting Vector object (itself)
   */

  Vector.prototype.multiply = function(vector) {
    if (!vector instanceof this.constructor) {
      throw new Error("Argument vector should be of type Vector");
    }
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  };


  /*
  Calculates the cross product of the Vector and another vector
  
  @param {Engine.Geometry.Vector} vector The vector to use for the calculation
  @return {number} The dot product
   */

  Vector.prototype.getDot = function(vector) {
    if (!vector instanceof this.constructor) {
      throw new Error("Argument vector should be of type: Vector");
    }
    return this.x * vector.x + this.y * vector.y;
  };


  /*
  Calculates the cross product of the Vector and another vector
  
  @param {Engine.Geometry.Vector} vector The vector to use for the calculation
  @return {number} The cross product
   */

  Vector.prototype.getCross = function(vector) {
    if (!vector instanceof this.constructor) {
      throw new Error("Argument vector should be of type: Vector");
    }
    return this.x * vector.y - this.y * vector.x;
  };


  /*
  Calculates the length of the Vector
  
  @return {number} The vector's length
   */

  Vector.prototype.getLength = function() {
    return Math.sqrt(this.getDot(this));
  };


  /*
  Calculates the direction of the Vector
  
  @return {number} The vector's direction (in radians)
   */

  Vector.prototype.getDirection = function() {
    return Math.atan2(this.y, this.x);
  };


  /*
  Calculates the direction to another Vector
  
  @param {Engine.Geometry.Vector} point A Vector to calculate the direction to
  @return {number} The direction to the object
   */

  Vector.prototype.getDirectionTo = function(point) {
    if (!point instanceof this.constructor) {
      throw new Error("Only Vectors or objects inheriting Vector are supported");
    }
    return point.copy().subtract(this).getDirection();
  };


  /*
  Calculates the shortest distance from the Vector object to another geometric object
  
  @param {Engine.Geometry.Vector|Engine.Geometry.Line|Engine.Geometry.Circle|Engine.Geometry.Rectangle|Engine.Geometry.Polygon} object The object to calculate the distance to
  @return {number} The distance
   */

  Vector.prototype.getDistance = function(object) {
    if (object instanceof this.constructor) {
      return object.copy().subtract(this).getLength();
    }
    if (object instanceof Engine.Geometry.Line) {
      return object.getDistance(this);
    }
    if (object instanceof Engine.Geometry.Circle) {
      return object.getDistance(this);
    }
    if (object instanceof Engine.Geometry.Rectangle) {
      return object.getDistance(this);
    }
    if (object instanceof Engine.Geometry.Polygon) {
      return object.getDistance(this);
    }
    throw new Error("Argument object should be of type: Vector, Line, Circle, Rectangle or Polygon");
  };

  return Vector;

})();



},{"../engine":1}],13:[function(require,module,exports){
var MatrixCalculationHelper;

module.exports = MatrixCalculationHelper = {
  calculateLocalMatrix: function(object) {
    var position, rotation, scale;
    scale = void 0;
    rotation = void 0;
    position = void 0;
    scale = this.makeScale(object.widthScale * object.size, object.heightScale * object.size);
    rotation = this.makeRotation(-object.direction);
    position = this.makeTranslation(object.x, object.y);
    return this.matrixMultiplyArray([scale, rotation, position]);
  },
  calculateInverseLocalMatrix: function(object) {
    var position, rotation, scale;
    scale = void 0;
    rotation = void 0;
    position = void 0;
    scale = this.makeScale(1 / (object.widthScale * object.size), 1 / (object.heightScale * object.size));
    rotation = this.makeRotation(object.direction);
    position = this.makeTranslation(-object.x, -object.y);
    return this.matrixMultiplyArray([position, rotation, scale]);
  },
  makeIdentity: function() {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  },
  makeTranslation: function(tx, ty) {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },
  makeRotation: function(direction) {
    var c, s;
    c = Math.cos(direction);
    s = Math.sin(direction);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },
  makeScale: function(sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },
  matrixDeterminant: function(matrix) {
    var a, b, c, d, e, f, g, h, i;
    a = matrix[0 * 3 + 0];
    b = matrix[0 * 3 + 1];
    c = matrix[0 * 3 + 2];
    d = matrix[1 * 3 + 0];
    e = matrix[1 * 3 + 1];
    f = matrix[1 * 3 + 2];
    g = matrix[2 * 3 + 0];
    h = matrix[2 * 3 + 1];
    i = matrix[2 * 3 + 2];
    return a * (e * i - f * h) - b * (i * d - f * g) + c * (d * h - e * g);
  },
  matrixInverse: function(matrix) {
    var A, B, C, D, E, F, G, H, I, a, b, c, d, det, e, f, g, h, i;
    det = this.matrixDeterminant(matrix);
    if (det === 0) {
      return false;
    }
    a = matrix[0 * 3 + 0];
    b = matrix[0 * 3 + 1];
    c = matrix[0 * 3 + 2];
    d = matrix[1 * 3 + 0];
    e = matrix[1 * 3 + 1];
    f = matrix[1 * 3 + 2];
    g = matrix[2 * 3 + 0];
    h = matrix[2 * 3 + 1];
    i = matrix[2 * 3 + 2];
    A = e * i - f * h;
    B = -(d * i - f * g);
    C = d * h - e * g;
    D = -(b * i - c * h);
    E = a * i - c * g;
    F = -(a * h - b * g);
    G = b * f - c * e;
    H = -(a * f - c * d);
    I = a * e - b * d;
    return this.matrixMultiplyNumber([A, D, G, B, E, H, C, F, I], 1 / det);
  },
  getNewMatrix: function(matrix) {
    var A, B, C, D, E, F, G, H, I, a, b, c, d, e, f, g, h, i;
    a = matrix[0 * 3 + 0];
    b = matrix[0 * 3 + 1];
    c = matrix[0 * 3 + 2];
    d = matrix[1 * 3 + 0];
    e = matrix[1 * 3 + 1];
    f = matrix[1 * 3 + 2];
    g = matrix[2 * 3 + 0];
    h = matrix[2 * 3 + 1];
    i = matrix[2 * 3 + 2];
    A = e * i - f * h;
    B = -(d * i - f * g);
    C = d * h - e * g;
    D = -(b * i - c * h);
    E = a * i - c * g;
    F = -(a * h - b * g);
    G = b * f - c * e;
    H = -(a * f - c * d);
    I = a * e - b * d;
    return [A, D, G, B, E, H, C, F, I];
  },
  matrixMultiplyNumber: function(matrix, factor) {
    var a, b, c, d, e, f, g, h, i, s;
    a = matrix[0 * 3 + 0];
    b = matrix[0 * 3 + 1];
    c = matrix[0 * 3 + 2];
    d = matrix[1 * 3 + 0];
    e = matrix[1 * 3 + 1];
    f = matrix[1 * 3 + 2];
    g = matrix[2 * 3 + 0];
    h = matrix[2 * 3 + 1];
    i = matrix[2 * 3 + 2];
    s = factor;
    return [a * s, b * s, c * s, d * s, e * s, f * s, g * s, h * s, i * s];
  },
  matrixMultiply: function(a, b) {
    var a1, a2, b1, b2, c1, c2, d1, d2, e1, e2, f1, f2, g1, g2, h1, h2, i1, i2;
    a1 = a[0 * 3 + 0];
    b1 = a[0 * 3 + 1];
    c1 = a[0 * 3 + 2];
    d1 = a[1 * 3 + 0];
    e1 = a[1 * 3 + 1];
    f1 = a[1 * 3 + 2];
    g1 = a[2 * 3 + 0];
    h1 = a[2 * 3 + 1];
    i1 = a[2 * 3 + 2];
    a2 = b[0 * 3 + 0];
    b2 = b[0 * 3 + 1];
    c2 = b[0 * 3 + 2];
    d2 = b[1 * 3 + 0];
    e2 = b[1 * 3 + 1];
    f2 = b[1 * 3 + 2];
    g2 = b[2 * 3 + 0];
    h2 = b[2 * 3 + 1];
    i2 = b[2 * 3 + 2];
    return [a1 * a2 + b1 * d2 + c1 * g2, a1 * b2 + b1 * e2 + c1 * h2, a1 * c2 + b1 * f2 + c1 * i2, d1 * a2 + e1 * d2 + f1 * g2, d1 * b2 + e1 * e2 + f1 * h2, d1 * c2 + e1 * f2 + f1 * i2, g1 * a2 + h1 * d2 + i1 * g2, g1 * b2 + h1 * e2 + i1 * h2, g1 * c2 + h1 * f2 + i1 * i2];
  },
  matrixMultiplyArray: function(matrices) {
    var i, len, r;
    r = matrices[0];
    len = matrices.length;
    i = 1;
    while (i < len) {
      r = this.matrixMultiply(r, matrices[i]);
      i++;
    }
    return r;
  }
};



},{}],14:[function(require,module,exports){
var MixinHelper;

module.exports = MixinHelper = {

  /*
  Imports all properties of another object.
  
  @param {Object} from The object from which to copy the properties
  @param {boolean} [copyIfPossible=false] If possible, copy properties which are actually pointers. This option will look for and use a copy()- or clone() function inside the properties
   */
  "import": function(to, from) {
    var i;
    for (i in from) {
      to[i] = from[i];
    }
  },
  mixin: function(to, from) {
    return this["import"](to.prototype, from.prototype);
  }
};



},{}],15:[function(require,module,exports){
module.exports = {
  slideOut: function(camera, from, animOptions) {
    switch (from) {
      case "left":
        return camera.projectionRegion.animate({
          x: camera.projectionRegion.x + engine.canvasResX
        }, animOptions);
      case "right":
        return camera.projectionRegion.animate({
          x: camera.projectionRegion.x - engine.canvasResX
        }, animOptions);
      case "top":
        return camera.projectionRegion.animate({
          y: camera.projectionRegion.y + engine.canvasResY
        }, animOptions);
      case "bottom":
        return camera.projectionRegion.animate({
          y: camera.projectionRegion.y - engine.canvasResY
        }, animOptions);
    }
  },
  slideIn: function(camera, from, animOptions) {
    switch (from) {
      case "left":
        camera.projectionRegion.x -= engine.canvasResX;
        return camera.projectionRegion.animate({
          x: camera.projectionRegion.x + engine.canvasResX
        }, animOptions);
      case "right":
        camera.projectionRegion.x += engine.canvasResX;
        return camera.projectionRegion.animate({
          x: camera.projectionRegion.x - engine.canvasResX
        }, animOptions);
      case "top":
        camera.projectionRegion.y -= engine.canvasResY;
        return camera.projectionRegion.animate({
          y: camera.projectionRegion.y + engine.canvasResY
        }, animOptions);
      case "bottom":
        camera.projectionRegion.y += engine.canvasResY;
        return camera.projectionRegion.animate({
          y: camera.projectionRegion.y - engine.canvasResY
        }, animOptions);
    }
  },
  squeezeOut: function(camera, from, animOptions) {
    switch (from) {
      case "left":
        return camera.projectionRegion.animate({
          width: 0,
          x: camera.projectionRegion.x + engine.canvasResX
        }, animOptions);
      case "right":
        return camera.projectionRegion.animate({
          width: 0
        }, animOptions);
      case "top":
        return camera.projectionRegion.animate({
          height: 0,
          y: camera.projectionRegion.y + engine.canvasResY
        }, animOptions);
      case "bottom":
        return camera.projectionRegion.animate({
          height: 0
        }, animOptions);
    }
  },
  squeezeIn: function(camera, from, animOptions) {
    var oldHeight, oldWidth;
    oldWidth = void 0;
    oldHeight = void 0;
    switch (from) {
      case "left":
        oldWidth = camera.projectionRegion.width;
        camera.projectionRegion.width = 0;
        return camera.projectionRegion.animate({
          width: oldWidth
        }, animOptions);
      case "right":
        oldWidth = camera.projectionRegion.width;
        camera.projectionRegion.width = 0;
        camera.projectionRegion.x += engine.canvasResX;
        return camera.projectionRegion.animate({
          x: camera.projectionRegion.x - engine.canvasResX,
          width: oldWidth
        }, animOptions);
      case "top":
        oldHeight = camera.projectionRegion.height;
        camera.projectionRegion.height = 0;
        return camera.projectionRegion.animate({
          height: oldHeight
        }, animOptions);
      case "bottom":
        oldHeight = camera.projectionRegion.height;
        camera.projectionRegion.height = 0;
        camera.projectionRegion.y += engine.canvasResY;
        return camera.projectionRegion.animate({
          y: camera.projectionRegion.y - engine.canvasResY,
          height: oldHeight
        }, animOptions);
    }
  }
};



},{}],16:[function(require,module,exports){
var WebGLHelper;

module.exports = WebGLHelper = {
  colorFromCSSString: function(string) {
    var a, b, c;
    a = void 0;
    b = void 0;
    c = void 0;
    if (string.length === 4) {
      a = string.substr(1, 1);
      b = string.substr(2, 1);
      c = string.substr(3, 1);
      return parseInt("0x" + a + a + b + b + c + c);
    } else {
      return parseInt("0x" + string.substr(1, 6));
    }
  },
  setPlane: function(gl, x, y, width, height) {
    var x1, x2, y1, y2;
    x1 = x;
    x2 = x + width;
    y1 = y;
    y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
  },
  setPlaneOutline: function(gl, x, y, width, height, outlineWidth) {
    var ix1, ix2, iy1, iy2, ox1, ox2, oy1, oy2;
    outlineWidth /= 2;
    ox1 = x - outlineWidth;
    ox2 = x + width + outlineWidth;
    oy1 = y - outlineWidth;
    oy2 = y + height + outlineWidth;
    ix1 = x + outlineWidth;
    ix2 = x + width - outlineWidth;
    iy1 = y + outlineWidth;
    iy2 = y + height - outlineWidth;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ox1, oy1, ox2, oy1, ix1, iy1, ix1, iy1, ix2, iy1, ox2, oy1, ox1, oy1, ox1, oy2, ix1, iy1, ix1, iy1, ix1, iy2, ox1, oy2, ix1, iy2, ox1, oy2, ox2, oy2, ix1, iy2, ix2, iy2, ox2, oy2, ox2, oy1, ox2, oy2, ix2, iy1, ix2, iy1, ix2, iy2, ox2, oy2]), gl.STATIC_DRAW);
  },
  setConvexPolygon: function(gl, coords) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
  },
  setCircle: function(gl, x, y, segmentsCount, radius) {
    var coords, i, segmentLength;
    i = void 0;
    coords = void 0;
    segmentLength = void 0;
    coords = new Array(segmentsCount * 2);
    segmentLength = Math.PI * 2 / segmentsCount;
    i = 0;
    while (i < segmentsCount) {
      coords[i * 2] = x + Math.cos(segmentLength * i) * radius;
      coords[i * 2 + 1] = y + Math.sin(segmentLength * i) * radius;
      i++;
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
  },
  setCircleOutline: function(gl, x, y, segmentsCount, radius, outlineWidth) {
    var coords, i, ir, or_, segmentLength;
    coords = new Array(segmentsCount * 4);
    segmentLength = Math.PI * 2 / segmentsCount;
    or_ = radius + outlineWidth / 2;
    ir = radius - outlineWidth / 2;
    i = 0;
    while (i <= segmentsCount) {
      coords[i * 4] = x + Math.cos(segmentLength * i) * or_;
      coords[i * 4 + 1] = y + Math.sin(segmentLength * i) * or_;
      coords[i * 4 + 2] = x + Math.cos(segmentLength * i) * ir;
      coords[i * 4 + 3] = y + Math.sin(segmentLength * i) * ir;
      i++;
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
  }
};



},{}],17:[function(require,module,exports){

/*
Constructor for the Keyboard class

@name Input.Keyboard
@class A class that eases checking of the current state of all keys.
 */
var Keyboard;

module.exports = Keyboard = (function() {
  function Keyboard() {
    var key;
    key = void 0;
    document.addEventListener("keydown", (function(_this) {
      return function(event) {
        _this.onKeyDown(event);
        if (engine.preventDefaultKeyboard) {
          event.preventDefault();
        }
      };
    })(this), false);
    document.addEventListener("keyup", (function(_this) {
      return function(event) {
        _this.onKeyUp(event);
        if (engine.preventDefaultKeyboard) {
          event.preventDefault();
        }
      };
    })(this), false);
    this.keys = new Array(400);
    key = 0;
    while (key < this.keys.length) {
      this.keys[key] = {
        events: []
      };
      key++;
    }
    return;
  }


  /*
  Registers every onkeydown event to the Keyboard object.
  
  @private
  @param {KeyboardEvent} event Event object passed by the onkeydown event
   */

  Keyboard.prototype.onKeyDown = function(event) {
    var key;
    key = void 0;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    if (!this.isDown(event.keyCode)) {
      key = this.keys[event.keyCode];
      key.events = key.events.slice(0, 1);
      key.events.unshift(new Date().getTime());
    }
  };


  /*
  Registers every onkeyup event to the Keyboard object.
  
  @private
  @param {KeyboardEvent} event Event object passed by the onkeyup event
   */

  Keyboard.prototype.onKeyUp = function(event) {
    var key;
    key = void 0;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    if (this.isDown(event.keyCode)) {
      key = this.keys[event.keyCode];
      key.events = key.events.slice(0, 1);
      key.events.unshift(-new Date().getTime());
    }
  };


  /*
  Checks if a given key is down.
  
  @param {number|string} key A charcode or a string representing the key
  @return {boolean} True if the key is down, false if not
   */

  Keyboard.prototype.isDown = function(key) {
    if (key === void 0) {
      throw new Error("Missing argument: key");
    }
    if (typeof key === "string") {
      key = key.toUpperCase().charCodeAt(0);
    }
    return this.keys[key].events.length && this.keys[key].events[0] > 0;
  };


  /*
  Checks if a given key has been pressed (between last and current frame).
  
  @param {number|string} key A charcode or a string representing the key
  @return {boolean} True if the key has been pressed, false if not
   */

  Keyboard.prototype.isPressed = function(key) {
    if (key === void 0) {
      throw new Error("Missing argument: key");
    }
    if (typeof key === "string") {
      key = key.toUpperCase().charCodeAt(0);
    }
    return this.keys[key].events.length && this.keys[key].events[0] > engine.last;
  };


  /*
  Checks if a given key has been released (between last and current frame).
  
  @param {number|string} key A charcode or a string representing the key
  @return {boolean} True if the key has been pressed, false if not
   */

  Keyboard.prototype.isReleased = function(key) {
    if (key === void 0) {
      throw new Error("Missing argument: key");
    }
    if (typeof key === "string") {
      key = key.toUpperCase().charCodeAt(0);
    }
    return this.keys[key].events.length && -this.keys[key].events[0] > engine.last;
  };

  return Keyboard;

})();



},{}],18:[function(require,module,exports){
var Engine, Pointer;

Engine = require('../engine');


/*
Constructor for the Pointer class

@name Input.Pointer
@class A class that eases the use of mouse and touch, by providing functions for checking the current state of both.
 */

module.exports = Pointer = (function() {
  function Pointer() {
    var button;
    if (engine.host.hasTouch) {
      document.addEventListener("touchstart", (function(_this) {
        return function(event) {
          _this.onTouchStart(event);
        };
      })(this), false);
      document.addEventListener("touchend", (function(_this) {
        return function(event) {
          _this.onTouchEnd(event);
        };
      })(this), false);
      document.addEventListener("touchmove", (function(_this) {
        return function(event) {
          _this.onTouchMove(event);
        };
      })(this), false);
    } else {
      document.addEventListener("mousedown", (function(_this) {
        return function(event) {
          _this.onMouseDown(event);
        };
      })(this), false);
      document.addEventListener("mouseup", (function(_this) {
        return function(event) {
          _this.onMouseUp(event);
        };
      })(this), false);
      document.addEventListener("mousemove", (function(_this) {
        return function(event) {
          engine.host.hasMouse = true;
          _this.onMouseMove(event);
        };
      })(this), false);
    }
    this.mouse = new Engine.Geometry.Vector();
    this.mouse.window = new Engine.Geometry.Vector();
    this.mouse.buttons = new Array(11);
    button = 0;
    while (button < this.mouse.buttons.length) {
      this.mouse.buttons[button] = new Engine.Geometry.Vector();
      this.mouse.buttons[button].events = new Array(2);
      button++;
    }
    this.mouse.lastMoved = 0;
    this.touches = new Array(10);
    button = 0;
    while (button < this.touches.length) {
      this.touches[button] = new Engine.Geometry.Vector();
      this.touches[button].x = void 0;
      this.touches[button].y = void 0;
      this.touches[button].events = new Array(2);
      button++;
    }
    return;
  }


  /*
  Registers every onmousedown event to the Mouse object.
  
  @private
  @param {MouseEvent} event Event object passed by the onmousedown event
   */

  Pointer.prototype.onMouseDown = function(event) {
    var button;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    this.onMouseMove(event);
    if (!this.isDown(event.which)) {
      button = this.mouse.buttons[event.which];
      button.events = button.events.slice(0, 1);
      button.events.unshift(new Date().getTime());
    }
  };


  /*
  Registers every onmouseup event to the Mouse object.
  
  @private
  @param {MouseEvent} event Event object passed by the onmouseup event
   */

  Pointer.prototype.onMouseUp = function(event) {
    var button;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    button = void 0;
    this.onMouseMove(event);
    if (this.isDown(event.which)) {
      button = this.mouse.buttons[event.which];
      button.events = button.events.slice(0, 1);
      button.events.unshift(-new Date().getTime());
    }
  };


  /*
  Registers every onmousemove event to the Mouse object.
  
  @private
  @param {MouseEvent} event Event object passed by the onmousemove event
   */

  Pointer.prototype.onMouseMove = function(event) {
    var roomPos;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    roomPos = void 0;
    this.mouse.window.set(event.pageX, event.pageY);
    this.mouse.set(this.mouse.window.x - engine.arena.offsetLeft - engine.canvas.offsetLeft + document.body.scrollLeft, this.mouse.window.y - engine.arena.offsetTop - engine.canvas.offsetTop + document.body.scrollTop);
    this.mouse.x = this.mouse.x / engine.arena.offsetWidth * engine.canvasResX;
    this.mouse.y = this.mouse.y / engine.arena.offsetHeight * engine.canvasResY;
    roomPos = this.calculateRoomPosition(this.mouse);
    this.mouse.x = roomPos.x;
    this.mouse.y = roomPos.y;
    this.mouse.buttons.forEach((function(_this) {
      return function(b) {
        b.x = _this.mouse.x;
        b.y = _this.mouse.y;
      };
    })(this));
    this.mouse.lastMoved = new Date().getTime();
    if (this.cursor) {
      this.cursor.x = this.mouse.x;
      this.cursor.y = this.mouse.y;
    }
  };


  /*
  Registers every ontouchstart event to the Mouse object.
  
  @private
  @param {TouchEvent} event Event object passed by the ontouchstart event
   */

  Pointer.prototype.onTouchStart = function(event) {
    var eventTouch, j, len1, pointerTouch, ref, touchNumber;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    ref = event.changedTouches;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      eventTouch = ref[j];
      touchNumber = this.findTouchNumber();
      pointerTouch = this.touches[touchNumber];
      pointerTouch.identifier = eventTouch.identifier;
      pointerTouch.events = pointerTouch.events.slice(0, 1);
      pointerTouch.events.unshift(new Date().getTime());
    }
    this.onTouchMove(event);
  };


  /*
  Registers every ontouchend event to the Mouse object.
  
  @private
  @param {TouchEvent} event Event object passed by the ontouchend event
   */

  Pointer.prototype.onTouchEnd = function(event) {
    var eventTouch, j, len1, pointerTouch, ref;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    ref = event.changedTouches;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      eventTouch = ref[j];
      pointerTouch = this.touches.filter(function(t) {
        return t.identifier === eventTouch.identifier;
      })[0];
      pointerTouch.events = pointerTouch.events.slice(0, 1);
      pointerTouch.events.unshift(-new Date().getTime());
    }
    this.onTouchMove(event);
  };


  /*
  Registers every ontouchmove event to the Mouse object.
  
  @private
  @param {TouchEvent} event Event object passed by the ontouchmove event
   */

  Pointer.prototype.onTouchMove = function(event) {
    var eventTouch, j, len1, pointerTouch, ref, roomPos;
    if (event === void 0) {
      throw new Error("Missing argument: event");
    }
    ref = event.touches;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      eventTouch = ref[j];
      pointerTouch = this.touches.filter(function(t) {
        return t.identifier === eventTouch.identifier;
      })[0];
      pointerTouch.set(eventTouch.pageX - engine.arena.offsetLeft - engine.canvas.offsetLeft + document.body.scrollLeft, eventTouch.pageY - engine.arena.offsetTop - engine.canvas.offsetTop + document.body.scrollTop);
      pointerTouch.x = pointerTouch.x / engine.arena.offsetWidth * engine.canvasResX;
      pointerTouch.y = pointerTouch.y / engine.arena.offsetHeight * engine.canvasResY;
      roomPos = this.calculateRoomPosition(pointerTouch);
      pointerTouch.x = roomPos.x;
      pointerTouch.y = roomPos.y;
    }
  };


  /*
  Checks if the mouse has been moved between the last and the current frame.
  
  @return {boolean} True if the pointer has been moved, false if not
   */

  Pointer.prototype.mouseHasMoved = function() {
    return engine.last < this.mouse.lastMoved;
  };


  /*
  Checks if a mouse button or touch is currently down.
  
  @param {number} button A pointer constant representing the pointer to check
  @return {Object[]|boolean} Returns an array containing the pointers that are currently down, or false if no pointers are down
   */

  Pointer.prototype.isDown = function(button) {
    var pointers;
    if (button === void 0) {
      throw new Error("Missing argument: button");
    }
    switch (this.getButtonType(button)) {
      case "mouse":
        pointers = (button === Engine.Globals.MOUSE_ANY ? this.mouse.buttons : this.mouse.buttons[button]);
        break;
      case "touch":
        pointers = (button === Engine.Globals.TOUCH_ANY ? this.touches : this.touches[button - Engine.Globals.TOUCH_1]);
        break;
      case "any":
        pointers = this.mouse.buttons.concat(this.touches);
    }
    return this.checkPointer(pointers, "down");
  };


  /*
  Checks if a mouse button or touch has just been pressed (between the last and the current frame).
  
  @param {number} button A pointer constant representing the pointer to check
  @return {Object[]|boolean} Returns an array containing the pointers that have just been pressed, or false if no pressed pointers where detected
   */

  Pointer.prototype.isPressed = function(button) {
    var pointers;
    if (button === void 0) {
      throw new Error("Missing argument: button");
    }
    pointers = void 0;
    switch (this.getButtonType(button)) {
      case "mouse":
        pointers = (button === Engine.Globals.MOUSE_ANY ? this.mouse.buttons : this.mouse.buttons[button]);
        break;
      case "touch":
        pointers = (button === Engine.Globals.TOUCH_ANY ? this.touches : this.touches[button - Engine.Globals.TOUCH_1]);
        break;
      case "any":
        pointers = this.mouse.buttons.concat(this.touches);
    }
    return this.checkPointer(pointers, "pressed");
  };


  /*
  Checks if a mouse button or touch just been released (between the last and the current frame).
  
  @param {number} button A pointer constant representing the pointer to check
  @return {Object[]|boolean} Returns an array containing the pointers that have just been released, or false if no released pointers where detected
   */

  Pointer.prototype.isReleased = function(button) {
    var pointers;
    if (button === void 0) {
      throw new Error("Missing argument: button");
    }
    pointers = void 0;
    switch (this.getButtonType(button)) {
      case "mouse":
        pointers = (button === Engine.Globals.MOUSE_ANY ? this.mouse.buttons : this.mouse.buttons[button]);
        break;
      case "touch":
        pointers = (button === Engine.Globals.TOUCH_ANY ? this.touches : this.touches[button - Engine.Globals.TOUCH_1]);
        break;
      case "any":
        pointers = this.mouse.buttons.concat(this.touches);
    }
    return this.checkPointer(pointers, "released");
  };


  /*
  Checks if an area defined by a geometric shape, or its outside, has just been pressed (between the last and the current frame).
  The shape can be any geometric object that has a contains function (Rectangle, Polygon).
  
  @param {button} button A pointer constant representing the pointers to check
  @param {Math.Rectangle|Math.Polygon|Math.Circle} shape A geometric shape defining the area to check
  @param {boolean} outside [Whether or not to check the outside of the specified area]
  @return {Object[]|boolean} An array containing the pointers that have pressed the shape, or false if no presses inside the shape were detected
   */

  Pointer.prototype.shapeIsPressed = function(button, shape, outside) {
    var i, j, len1, pointer, pointers, ret;
    button = (button !== void 0 ? button : Engine.Globals.MOUSE_Engine.Globals.TOUCH_ANY);
    if (shape === void 0) {
      throw new Error("Missing argument: shape");
    }
    if (typeof shape.contains !== "function") {
      throw new Error("Argument shape has implement a \"contains\"-function");
    }
    i = void 0;
    pointers = void 0;
    pointer = void 0;
    ret = void 0;
    pointers = this.isPressed(button);
    ret = [];
    for (j = 0, len1 = pointers.length; j < len1; j++) {
      pointer = pointers[j];
      if (pointer.x === false || pointer.y === false) {
        continue;
      }
      if (!outside && shape.contains(pointer)) {
        ret.push(pointer);
      } else {
        if (outside && !shape.contains(pointer)) {
          ret.push(pointer);
        }
      }
    }
    return ret;
  };


  /*
  Checks if an area defined by a geometric shape, or its outside, has just been released (between the last and the current frame).
  The shape can be any geometric object that has a contains function (Rectangle, Polygon).
  
  @param {button} button A pointer constant representing the pointers to check
  @param {Math.Rectangle|Math.Polygon|Math.Circle} shape A geometric shape defining the area to check
  @param {boolean} outside [Whether or not to check the outside of the specified area]
  @return {Object[]|boolean} An array containing the pointers that have released the shape, or false if no releases inside the shape were detected
   */

  Pointer.prototype.shapeIsReleased = function(button, shape, outside) {
    var j, len1, pointer, pointers, ret;
    button = (button !== void 0 ? button : Engine.Globals.MOUSE_Engine.Globals.TOUCH_ANY);
    if (shape === void 0) {
      throw new Error("Missing argument: shape");
    }
    if (typeof shape.contains !== "function") {
      throw new Error("Argument shape has implement a \"contains\"-function");
    }
    pointers = this.isReleased(button);
    ret = [];
    for (j = 0, len1 = pointers.length; j < len1; j++) {
      pointer = pointers[j];
      if (pointer.x === false || pointer.y === false) {
        continue;
      }
      if (!outside && shape.contains(pointer)) {
        ret.push(pointer);
      } else {
        if (outside && !shape.contains(pointer)) {
          ret.push(pointer);
        }
      }
    }
    return ret;
  };


  /*
  Checks if an area defined by a geometric shape, or its outside, is down (currently clicked by mouse or touch).
  The shape can be any geometric object that has a contains function (Rectangle, Polygon).
  
  @param {button} button A pointer constant representing the pointers to check
  @param {Math.Rectangle|Math.Polygon|Math.Circle} shape A geometric shape defining the area to check
  @param {boolean} outside [Whether or not to check the outside of the specified area]
  @return {Object[]|boolean} An array containing the pointers that are currently pressing the shape, or false if no pointers inside the shape were detected
   */

  Pointer.prototype.shapeIsDown = function(button, shape, outside) {
    var j, len1, pointer, pointers, ret;
    button = (button !== void 0 ? button : Engine.Globals.MOUSE_Engine.Globals.TOUCH_ANY);
    if (shape === void 0) {
      throw new Error("Missing argument: shape");
    }
    if (typeof shape.contains !== "function") {
      throw new Error("Argument shape has implement a \"contains\"-function");
    }
    pointers = this.isDown(button);
    ret = [];
    for (j = 0, len1 = pointers.length; j < len1; j++) {
      pointer = pointers[j];
      if (pointer.x === false || pointer.y === false) {
        continue;
      }
      if (!outside && shape.contains(pointer)) {
        ret.push(pointer);
      } else {
        if (outside && !shape.contains(pointer)) {
          ret.push(pointer);
        }
      }
    }
    return ret;
  };


  /*
  Returns a string representing the button type.
  
  @private
  @param {number} button A pointer button constant representing the button
  @return {string} A string representing the type of button ("mouse", "touch" or "any")
   */

  Pointer.prototype.getButtonType = function(button) {
    if (button >= Engine.Globals.MOUSE_ANY && button <= Engine.Globals.MOUSE_10) {
      return "mouse";
    } else if (button >= Engine.Globals.TOUCH_ANY && button <= Engine.Globals.TOUCH_10) {
      return "touch";
    } else if (button === Engine.Globals.MOUSE_TOUCH_ANY) {
      return "any";
    } else {
      throw new Error("Argument button has to be a pointer constant (see jseGlobals.js)");
    }
  };


  /*
  Checks the state of a pointer object
  
  @private
  @param {Object|Object[]} pointers A pointer object or an array of pointer objects to check the state of
  @param {string} state A state to check for "pressed", "released" or "down"
  @return {boolean} Whether or not the pointer or one of the pointers has the provided state
   */

  Pointer.prototype.checkPointer = function(pointers, state) {
    var j, len1, pointer, ret;
    if (pointers === "undefined") {
      throw new Error("Missing argument: pointers");
    }
    if (state === "undefined") {
      throw new Error("Missing argument: state");
    }
    if (["pressed", "released", "down"].indexOf(state) === -1) {
      throw new Error("Argument state must be one of the following values: \"pressed\", \"released\" or \"down\"");
    }
    if (!Array.prototype.isPrototypeOf(pointers)) {
      pointers = [pointers];
    }
    ret = [];
    for (j = 0, len1 = pointers.length; j < len1; j++) {
      pointer = pointers[j];
      switch (state) {
        case "pressed":
          if (pointer.events[0] > engine.last || pointer.events[1] > engine.last) {
            ret.push(pointer);
          }
          break;
        case "released":
          if (-pointer.events[0] > engine.last || -pointer.events[1] > engine.last) {
            ret.push(pointer);
          }
          break;
        case "down":
          if (pointer.events[0] > 0) {
            ret.push(pointer);
          }
      }
    }
    if (ret.length) {
      return ret;
    } else {
      return false;
    }
  };


  /*
  Converts a coordinate which is relative to the main canvas to a position in the room (based on the room's cameras)
  
  @private
  @param {Engine.Geometry.Vector} vector A vector representing a position which is relative to the main canvas
  @return {Engine.Geometry.Vector} vector A vector representing the calculated position relative to the room
   */

  Pointer.prototype.calculateRoomPosition = function(vector) {
    var camera, len, ret;
    ret = void 0;
    len = void 0;
    camera = void 0;
    ret = vector.copy();
    len = engine.cameras.length;
    while (len--) {
      camera = engine.cameras[len];
      if (camera.projectionRegion.contains(vector) || len === 0) {
        ret.subtract(camera.projectionRegion);
        ret.x *= camera.captureRegion.width / camera.projectionRegion.width;
        ret.y *= camera.captureRegion.height / camera.projectionRegion.height;
        ret.add(camera.captureRegion);
        return ret;
      }
    }
    return ret;
  };


  /*
  Finds the first available spot in the Pointer.touches-array, used for registering the touches as numbers from 0-9.
  In Google Chrome, each touch's identifier can be used directly since the numbers - starting from 0 - are reused, when the a touch is released.
  In Safari however each touch has a unique id (a humongous number), and a function (this) is therefore needed for identifying the touches as the numbers 0-9, which can be used in the Pointer.touches-array.
  
  @private
  @return {number|boolean} The first available spot in the Pointer.touches-array where a new touch can be registered. If no spot is available, false is returned
   */

  Pointer.prototype.findTouchNumber = function() {
    var i, j, len1, ref, touch;
    ref = this.touches;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      touch = ref[i];
      if (!(touch.events[0] > 0)) {
        return i;
      }
    }
    return false;
  };


  /*
  Checks if an area defined by a geometric shape, or its outside, is hovered by the mouse pointer.
  The shape can be any geometric object that has a contains function (Rectangle, Polygon).
  
  @param {Math.Rectangle|Math.Polygon|Math.Circle} shape A geometric shape defining the area to check
  @param {boolean} outside [Whether or not to check the outside of the specified area]
  @return {boolean} True if the shape if hovered, false if not
   */

  Pointer.prototype.shapeIsHovered = function(shape, outside) {
    if (!outside && (shape.contains(this.mouse))) {
      return true;
    } else {
      if (outside && (!shape.contains(this.mouse))) {
        return true;
      }
    }
    return false;
  };


  /*
  Releases a button, and thereby prevents the button from being detected as "pressed" by the isPressed function.
  This function is very useful for preventing one button press from having multiple effects inside the game. For instance on buttons that are placed on top of each other.
  
  @param {number} button The button to release
  @return {boolean} True if the button has now been released, false if the button was not already pressed
   */

  Pointer.prototype.release = function(button) {
    var events, i, pointers, unpressed;
    if (button === void 0) {
      throw new Error("Missing argument: button");
    }
    i = void 0;
    pointers = void 0;
    events = void 0;
    unpressed = void 0;
    pointers = this.isPressed(button);
    if (!pointers) {
      return false;
    }
    i = 0;
    while (i < pointers.length) {
      events = pointers[i].events;
      if (events[0] > engine.last) {
        events.shift();
        events.push(void 0);
        unpressed = true;
      }
      if (events[1] > engine.last) {
        events.pop();
        events.push(void 0);
        unpressed = true;
      }
      i++;
    }
    return unpressed;
  };


  /*
  Checks if the mouse pointer is outside the game arena.
  
  @return {boolean} True if the pointer is outside, false if not
   */

  Pointer.prototype.outside = function() {
    return new Math.Rectangle(engine.arena.offsetLeft, engine.arena.offsetTop, engine.arena.offsetWidth, engine.arena.offsetHeight).contains(this.mouse.window) === false;
  };


  /*
  Resets the mouse cursor, automatically called by the engine before each frame i executed, unless engine.resetCursorOnEachFrame is set to false
  
  @private
   */

  Pointer.prototype.resetCursor = function() {
    engine.arena.style.cursor = "default";
  };


  /*
  Sets the mouse cursor for the arena.
  By default the mouse cursor will be reset on each frame (this can be changed with the "resetCursorOnEachFrame" engine option)
  Please be aware that not all images can be used as cursor. Not all sizes and formats are supported by all browsers.
  
  @param {string} A resource string, image path string or css cursor of the cursor
   */

  Pointer.prototype.setCursor = function(cursor) {
    var resource;
    if (cursor === void 0) {
      throw new Error("Missing argument: cursor");
    }
    if (typeof cursor !== "string") {
      throw new Error("Argument cursor should be of type: string");
    }
    resource = void 0;
    resource = engine.loader.getImage(cursor);
    if (resource) {
      cursor = "url('" + resource.src + "') 0 0, auto";
    } else {
      if (!/^\w*$/.test(cursor)) {
        cursor = "url('" + cursor + "') 0 0, auto";
      }
    }
    engine.arena.style.cursor = cursor;
  };

  return Pointer;

})();



},{"../engine":1}],19:[function(require,module,exports){
var Animatable;

module.exports = Animatable = (function() {
  function Animatable() {}


  /*
  Used for animating numeric properties of the owner of the function.
  Available easing functions are:
  "linear"
  "quadIn"
  "quadOut"
  "quadInOut"
  "powerIn"
  "powerOut"
  "powerInOut"
  "sinusInOut"
  
  @param {object} properties An object containing key-value pairs in the following format:<code>
  {
  "[property name]": "[end value]"
  }
  </code>
  @param {object} options An object containing key-value pairs for the animation's option:<code>
  {
  "duraton": "[animation duration (in ms)]",
  "callback": "[callback function]",
  "easing": "[easing function to use]"
  }
  </code>
   */

  Animatable.prototype.animate = function(properties, options) {
    var anim, c, i, loop_, map, opt;
    if (properties === void 0) {
      throw new Error("Missing argument: properties");
    }
    if (options === void 0) {
      throw new Error("Missing argument: options");
    }
    anim = {};
    map = properties;
    opt = (options ? options : {});
    anim.obj = this;
    loop_ = (options.loop !== void 0 ? options.loop : (this.loop !== void 0 ? this.loop : engine.defaultAnimationLoop));
    anim.callback = (opt.callback !== void 0 ? opt.callback : function() {});
    anim.easing = (opt.easing !== void 0 ? opt.easing : Engine.Globals.EASING_QUAD_IN_OUT);
    anim.duration = (opt.duration !== void 0 ? opt.duration : 1000);
    anim.onStep = (opt.onStep !== void 0 ? opt.onStep : function() {});
    anim.prop = {};
    for (i in map) {
      if (map.hasOwnProperty(i)) {
        anim.prop[i] = {
          begin: this[i],
          end: map[i]
        };
      }
    }
    c = 0;
    for (i in anim.prop) {
      if (anim.prop.hasOwnProperty(i)) {
        if (anim.prop[i].begin === anim.prop[i].end && !this.propertyIsAnimated(i)) {
          delete anim.prop[i];
        } else {
          c++;
        }
      }
    }
    if (!c && anim.callback === function() {}) {
      return;
    }
    loop_.addAnimation(anim);
  };


  /*
  @scope Mixin.Animatable
   */


  /*
  Checks if the object is currently being animated.
  
  @return {boolean} Whether or not the object is being animated
   */

  Animatable.prototype.isAnimated = function() {
    var animId, animation, loop_, name, room, roomId;
    roomId = void 0;
    room = void 0;
    name = void 0;
    loop_ = void 0;
    animId = void 0;
    animation = void 0;
    roomId = 0;
    while (roomId < engine.roomList.length) {
      room = engine.roomList[roomId];
      for (name in room.loops) {
        if (room.loops.hasOwnProperty(name)) {
          loop_ = room.loops[name];
          animId = loop_.animations.length - 1;
          while (animId > -1) {
            animation = loop_.animations[animId];
            if (animation.obj === this) {
              return true;
            }
            animId--;
          }
        }
      }
      roomId++;
    }
    return false;
  };


  /*
  Checks if a specific property is current being animated
  
  @return {boolean} Whether or not the property is being animated
   */

  Animatable.prototype.propertyIsAnimated = function(property) {
    var animId, animation, loop_, name, room, roomId;
    roomId = void 0;
    room = void 0;
    name = void 0;
    loop_ = void 0;
    animId = void 0;
    animation = void 0;
    roomId = 0;
    while (roomId < engine.roomList.length) {
      room = engine.roomList[roomId];
      for (name in room.loops) {
        if (room.loops.hasOwnProperty(name)) {
          loop_ = room.loops[name];
          animId = loop_.animations.length - 1;
          while (animId > -1) {
            animation = loop_.animations[animId];
            if (animation.obj === this && animation.prop[property] !== void 0) {
              return true;
            }
            animId--;
          }
        }
      }
      roomId++;
    }
    return false;
  };


  /*
  Fetches all current animations of the object.
  
  @return {Object[]} An array of all the current animations of the object
   */

  Animatable.prototype.getAnimations = function() {
    var animId, animation, animations, loop_, name, room, roomId;
    animations = void 0;
    roomId = void 0;
    room = void 0;
    name = void 0;
    loop_ = void 0;
    animId = void 0;
    animation = void 0;
    animations = [];
    roomId = 0;
    while (roomId < engine.roomList.length) {
      room = engine.roomList[roomId];
      for (name in room.loops) {
        if (room.loops.hasOwnProperty(name)) {
          loop_ = room.loops[name];
          animId = loop_.animations.length - 1;
          while (animId > -1) {
            animation = loop_.animations[animId];
            if (animation.obj === this) {
              animations.push(animation);
            }
            animId--;
          }
        }
      }
      roomId++;
    }
    return animations;
  };


  /*
  Stops all current animations of the object.
   */

  Animatable.prototype.stopAnimations = function() {
    var name, room, roomId;
    roomId = void 0;
    room = void 0;
    name = void 0;
    roomId = 0;
    while (roomId < engine.roomList.length) {
      room = engine.roomList[roomId];
      for (name in room.loops) {
        if (room.loops.hasOwnProperty(name)) {
          room.loops[name].removeAnimationsOfObject(this);
        }
      }
      roomId++;
    }
  };

  Animatable.prototype.schedule = function(func, delay, loopName) {
    var room;
    room = void 0;
    loopName = loopName || "eachFrame";
    room = this.getRoom();
    if (!room) {
      throw new Error("Schedule requires that the object is added to a room");
    }
    room.loops[loopName].schedule(this, func, delay);
  };

  return Animatable;

})();



},{}],20:[function(require,module,exports){
var CanvasRenderer, Engine;

Engine = require('../engine');

module.exports = CanvasRenderer = (function() {
  function CanvasRenderer(canvas) {
    var gl, options;
    gl = void 0;
    options = void 0;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    return;
  }

  CanvasRenderer.prototype.render = function(cameras) {
    var c, camera, camerasLength, h, i, ii, rooms, roomsLength, w, wm, wmS, wmT;
    camerasLength = cameras.length;
    c = this.context;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    i = 0;
    while (i < camerasLength) {
      camera = cameras[i];
      c.save();
      w = camera.captureRegion.width;
      h = camera.captureRegion.height;
      wmT = Engine.Helpers.MatrixCalculation.makeTranslation(-camera.captureRegion.x, -camera.captureRegion.y);
      if (camera.captureRegion.width !== 0 && camera.captureRegion.height !== 0) {
        wmS = Engine.Helpers.MatrixCalculation.makeScale(camera.projectionRegion.width / camera.captureRegion.width, camera.projectionRegion.height / camera.captureRegion.height);
      } else {
        wmS = Engine.Helpers.MatrixCalculation.makeIdentity();
      }
      wm = Engine.Helpers.MatrixCalculation.matrixMultiply(wmT, wmS);
      wm = Engine.Helpers.MatrixCalculation.matrixMultiply(wm, Engine.Helpers.MatrixCalculation.makeTranslation(camera.projectionRegion.x, camera.projectionRegion.y));
      c.beginPath();
      c.moveTo(camera.projectionRegion.x, camera.projectionRegion.y);
      c.lineTo(camera.projectionRegion.x + camera.projectionRegion.width, camera.projectionRegion.y);
      c.lineTo(camera.projectionRegion.x + camera.projectionRegion.width, camera.projectionRegion.y + camera.projectionRegion.height);
      c.lineTo(camera.projectionRegion.x, camera.projectionRegion.y + camera.projectionRegion.height);
      c.closePath();
      c.clip();
      rooms = [engine.masterRoom, camera.room];
      roomsLength = rooms.length;
      ii = 0;
      while (ii < roomsLength) {
        this.renderTree(rooms[ii], wm);
        ii++;
      }
      c.restore();
      i++;
    }
  };

  CanvasRenderer.prototype.renderTree = function(object, wm) {
    var i, len, localWm, offset;
    localWm = Engine.Helpers.MatrixCalculation.matrixMultiplyArray([Engine.Helpers.MatrixCalculation.calculateLocalMatrix(object), wm]);
    if (!object.isVisible()) {
      return;
    }
    if (object.renderType !== "") {
      offset = Engine.Helpers.MatrixCalculation.matrixMultiply(Engine.Helpers.MatrixCalculation.makeTranslation(-object.offset.x, -object.offset.y), localWm);
      this.context.setTransform(offset[0], offset[1], offset[3], offset[4], offset[6], offset[7]);
      this.context.globalAlpha = object.opacity;
    }
    switch (object.renderType) {
      case "textblock":
      case "sprite":
        this.renderSprite(object);
        break;
      case "circle":
        this.renderCircle(object);
        break;
      case "line":
        this.renderLine(object);
        break;
      case "rectangle":
        this.renderRectangle(object);
        break;
      case "polygon":
        this.renderPolygon(object);
    }
    if (object.children) {
      len = object.children.length;
      i = 0;
      while (i < len) {
        this.renderTree(object.children[i], localWm);
        i++;
      }
    }
  };

  CanvasRenderer.prototype.renderSprite = function(object) {
    if (object.imageLength !== 1 && object.animationSpeed !== 0) {
      if (engine.gameTime - object.animationLastSwitch > 1000 / object.animationSpeed) {
        object.imageNumber = object.imageNumber + (object.animationSpeed > 0 ? 1 : -1);
        object.animationLastSwitch = engine.gameTime;
        if (object.imageNumber === object.imageLength) {
          object.imageNumber = (object.animationLoops ? 0 : object.imageLength - 1);
        } else {
          if (object.imageNumber === -1) {
            object.imageNumber = (object.animationLoops ? object.imageLength - 1 : 0);
          }
        }
      }
    }
    this.context.drawImage(object.bm, (object.clipWidth + object.bm.spacing) * object.imageNumber, 0, object.clipWidth, object.clipHeight, 0, 0, object.clipWidth, object.clipHeight);
  };


  /*
  Draws a Circle object on the canvas (if added as a child of a View)
  @private
  @param {CanvasRenderingContext2D} c A canvas 2D context on which to draw the Circle
  @param {Math.Vector} drawOffset A vector defining the offset with which to draw the object
   */

  CanvasRenderer.prototype.renderCircle = function(object) {
    var c;
    c = this.context;
    c.strokeStyle = object.strokeStyle;
    c.fillStyle = object.fillStyle;
    c.beginPath();
    c.arc(0, 0, object.radius, 0, Math.PI * 2, true);
    c.lineWidth = object.lineWidth;
    c.globalAlpha = object.opacity;
    c.fill();
    c.stroke();
  };


  /*
  Draws a Polygon object on the canvas (if added as a child of a View)
  @private
  @param {CanvasRenderingContext2D} c A canvas 2D context on which to draw the Polygon
  @param {Vector} drawOffset A vector defining the offset with which to draw the object
   */

  CanvasRenderer.prototype.renderPolygon = function(object) {
    var c, i, len;
    c = this.context;
    c.strokeStyle = object.strokeStyle;
    c.fillStyle = object.fillStyle;
    if (object.lineDash !== [] && c.setLineDash) {
      c.setLineDash(object.lineDash);
    }
    c.beginPath();
    len = object.points.length;
    i = 0;
    while (i < len) {
      c.lineTo(object.points[i].x, object.points[i].y);
      i++;
    }
    c.lineWidth = object.lineWidth;
    c.globalAlpha = object.opacity;
    if (object.closed) {
      c.closePath();
      c.fill();
      c.stroke();
    } else {
      c.fill();
      c.stroke();
      c.closePath();
    }
  };


  /*
  Draws a Line object on the canvas (if added as a child of a View)
  @private
  @param {CanvasRenderingContext2D} c A canvas 2D context on which to draw the Line
   */

  CanvasRenderer.prototype.renderLine = function(object) {
    var c;
    c = this.context;
    c.strokeStyle = object.strokeStyle;
    c.globalAlpha = object.opacity;
    c.beginPath();
    c.moveTo(object.a.x, object.a.y);
    c.lineTo(object.b.x, object.b.y);
    c.lineWidth = object.lineWidth;
    c.lineCap = object.lineCap;
    c.stroke();
  };


  /*
  Draws a Rectangle object on the canvas (if added as a child of a View)
  @private
  @param {CanvasRenderingContext2D} c A canvas 2D context on which to draw the Rectangle
  @param {Vector} cameraOffset A vector defining the offset with which to draw the object
   */

  CanvasRenderer.prototype.renderRectangle = function(object) {
    var c;
    c = this.context;
    c.strokeStyle = object.strokeStyle;
    c.fillStyle = object.fillStyle;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(object.width, 0);
    c.lineTo(object.width, object.height);
    c.lineTo(0, object.height);
    c.closePath();
    c.lineWidth = object.lineWidth;
    c.fill();
    c.stroke();
  };

  return CanvasRenderer;

})();



},{"../engine":1}],21:[function(require,module,exports){
var ColorShaderProgram, Engine, TextureShaderProgram, WebGLRenderer;

Engine = require('../engine');

TextureShaderProgram = require('./webgl/texture-shader-program');

ColorShaderProgram = require('./webgl/color-shader-program');

module.exports = WebGLRenderer = (function() {
  function WebGLRenderer(canvas) {
    var gl, options;
    this.canvas = canvas;
    this.cache = {
      currentAlpha: void 0,
      currentResolution: {
        width: 0,
        height: 0
      }
    };
    this.programs = {};
    this.currentProgram = false;
    options = {
      premultipliedAlpha: false,
      alpha: false
    };
    this.gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
    gl = this.gl;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    this.programs = {
      texture: new TextureShaderProgram(gl),
      color: new ColorShaderProgram(gl)
    };
    return;
  }

  WebGLRenderer.prototype.setProgram = function(program) {
    var gl;
    if (this.currentProgram !== program) {
      gl = void 0;
      gl = this.gl;
      this.currentProgram = program;
      gl.useProgram(program.program);
      program.onSet(gl);
      gl.uniform2f(program.locations.u_resolution, this.cache.currentResolution.width, this.cache.currentResolution.height);
      gl.uniform1f(this.currentProgram.locations.u_alpha, this.cache.currentAlpha);
    }
  };

  WebGLRenderer.prototype.render = function(cameras) {
    var camera, camerasLength, gl, h, i, ii, rooms, roomsLength, w, wm;
    gl = this.gl;
    camerasLength = cameras.length;
    i = 0;
    while (i < camerasLength) {
      camera = cameras[i];
      w = camera.captureRegion.width;
      h = camera.captureRegion.height;
      if (this.cache.currentResolution.width !== w || this.cache.currentResolution.height !== h) {
        this.cache.currentResolution.width = w;
        this.cache.currentResolution.height = h;
        if (this.currentProgram) {
          gl.uniform2f(this.currentProgram.locations.u_resolution, w, h);
        }
      }
      wm = Engine.Helpers.MatrixCalculation.makeTranslation(-camera.captureRegion.x, -camera.captureRegion.y);
      gl.viewport(camera.projectionRegion.x, camera.projectionRegion.y, camera.projectionRegion.width, camera.projectionRegion.height);
      rooms = [engine.masterRoom, camera.room];
      roomsLength = rooms.length;
      ii = 0;
      while (ii < roomsLength) {
        this.renderTree(rooms[ii], wm);
        ii++;
      }
      i++;
    }
  };

  WebGLRenderer.prototype.renderTree = function(object, wm) {
    var gl, i, len, localWm, offset;
    gl = this.gl;
    localWm = Engine.Helpers.MatrixCalculation.matrixMultiplyArray([Engine.Helpers.MatrixCalculation.calculateLocalMatrix(object), wm]);
    offset = Engine.Helpers.MatrixCalculation.makeTranslation(-object.offset.x, -object.offset.y);
    if (!object.isVisible()) {
      return;
    }
    if (this.cache.currentAlpha !== object.opacity) {
      this.cache.currentAlpha = object.opacity;
      if (this.currentProgram) {
        gl.uniform1f(this.currentProgram.locations.u_alpha, object.opacity);
      }
    }
    switch (object.renderType) {
      case "textblock":
      case "sprite":
        this.setProgram(this.programs.texture);
        this.currentProgram.renderSprite(gl, object, Engine.Helpers.MatrixCalculation.matrixMultiply(offset, localWm));
        break;
      case "line":
        this.setProgram(this.programs.color);
        this.currentProgram.renderLine(gl, object, Engine.Helpers.MatrixCalculation.matrixMultiply(offset, localWm));
        break;
      case "rectangle":
        this.setProgram(this.programs.color);
        this.currentProgram.renderRectangle(gl, object, Engine.Helpers.MatrixCalculation.matrixMultiply(offset, localWm));
        break;
      case "circle":
        this.setProgram(this.programs.color);
        this.currentProgram.renderCircle(gl, object, Engine.Helpers.MatrixCalculation.matrixMultiply(offset, localWm));
    }
    if (object.children) {
      len = object.children.length;
      i = 0;
      while (i < len) {
        this.renderTree(object.children[i], localWm);
        i++;
      }
    }
  };

  return WebGLRenderer;

})();



},{"../engine":1,"./webgl/color-shader-program":22,"./webgl/texture-shader-program":23}],22:[function(require,module,exports){
var Engine, WebGLColorShaderProgram;

Engine = require('../../engine');

module.exports = WebGLColorShaderProgram = (function() {
  function WebGLColorShaderProgram(gl) {
    var initBuffers, initShaders, locations, program;
    initShaders = void 0;
    initBuffers = void 0;
    program = void 0;
    locations = void 0;
    this.program = gl.createProgram();
    this.initShaders(gl);
    this.bindLocations(gl);
    this.initBuffers(gl);
    this.cache = {
      currentBuffer: this.vertexBuffer
    };
    return;
  }

  WebGLColorShaderProgram.prototype.initShaders = function(gl) {
    var fragmentCode, fragmentShader, vertexCode, vertexShader;
    vertexCode = void 0;
    fragmentCode = void 0;
    vertexShader = void 0;
    fragmentShader = void 0;
    vertexCode = "attribute vec2 a_position; uniform vec2 u_resolution; uniform mat3 u_matrix; void main() { vec2 position = (u_matrix * vec3(a_position, 1)).xy; vec2 zeroToOne = position / u_resolution; vec2 zeroToTwo = zeroToOne * 2.0; vec2 clipSpace = zeroToTwo - 1.0; gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); }";
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexCode);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(vertexShader));
    }
    gl.attachShader(this.program, vertexShader);
    fragmentCode = "precision mediump float; uniform int u_color; uniform float u_alpha; void main() { float rValue = float(u_color / 256 / 256); float gValue = float(u_color / 256 - int(rValue * 256.0)); float bValue = float(u_color - int(rValue * 256.0 * 256.0) - int(gValue * 256.0)); gl_FragColor = vec4(rValue / 255.0, gValue / 255.0, bValue / 255.0, u_alpha); }";
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(fragmentShader));
    }
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
  };

  WebGLColorShaderProgram.prototype.bindLocations = function(gl) {
    this.locations = {
      a_position: gl.getAttribLocation(this.program, "a_position"),
      u_resolution: gl.getUniformLocation(this.program, "u_resolution"),
      u_matrix: gl.getUniformLocation(this.program, "u_matrix"),
      u_color: gl.getUniformLocation(this.program, "u_color"),
      u_alpha: gl.getUniformLocation(this.program, "u_alpha")
    };
  };

  WebGLColorShaderProgram.prototype.initBuffers = function(gl) {
    this.vertexBuffer = gl.createBuffer();
  };

  WebGLColorShaderProgram.prototype.onSet = function(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(this.locations.a_position);
    gl.vertexAttribPointer(this.locations.a_position, 2, gl.FLOAT, false, 0, 0);
  };

  WebGLColorShaderProgram.prototype.renderLine = function(gl, object, wm) {
    var a, b, c, color, coords, l, len;
    l = void 0;
    len = void 0;
    coords = void 0;
    color = void 0;
    a = void 0;
    b = void 0;
    c = void 0;
    l = this.locations;
    if (object.strokeStyle === "transparent") {
      return;
    } else if (object.strokeStyle.length === 4) {
      color = object.strokeStyle;
      a = color.substr(1, 1);
      b = color.substr(2, 1);
      c = color.substr(3, 1);
      color = parseInt("0x" + a + a + b + b + c + c);
    } else {
      color = parseInt("0x" + object.strokeStyle.substr(1, 6));
    }
    gl.uniform1i(l.u_color, color);
    coords = object.createPolygonFromWidth(object.lineWidth, object.lineCap).getCoordinates();
    this.setConvexPolygon(gl, coords);
    gl.uniformMatrix3fv(l.u_matrix, false, wm);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, coords.length / 2);
  };

  WebGLColorShaderProgram.prototype.renderRectangle = function(gl, object, wm) {
    var l;
    l = void 0;
    l = this.locations;
    gl.uniformMatrix3fv(l.u_matrix, false, wm);
    if (object.fillStyle !== "transparent") {
      gl.uniform1i(l.u_color, this.colorFromCSSString(object.fillStyle));
      this.setPlane(gl, 0, 0, object.width, object.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    if (object.strokeStyle !== "transparent") {
      gl.uniform1i(l.u_color, this.colorFromCSSString(object.strokeStyle));
      this.setPlaneOutline(gl, 0, 0, object.width, object.height, object.lineWidth);
      gl.drawArrays(gl.TRIANGLES, 0, 24);
    }
  };

  WebGLColorShaderProgram.prototype.renderCircle = function(gl, object, wm) {
    var l, perimeter, segmentsCount;
    l = void 0;
    perimeter = void 0;
    segmentsCount = void 0;
    l = this.locations;
    gl.uniformMatrix3fv(l.u_matrix, false, wm);
    if (object.radius < 10) {
      segmentsCount = 12;
    } else if (object.radius < 50) {
      segmentsCount = 30;
    } else if (object.radius < 100) {
      segmentsCount = 50;
    } else {
      segmentsCount = 80;
    }
    if (object.fillStyle !== "transparent") {
      gl.uniform1i(l.u_color, this.colorFromCSSString(object.fillStyle));
      this.setCircle(gl, 0, 0, segmentsCount, object.radius);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, segmentsCount);
    }
    if (object.strokeStyle !== "transparent") {
      gl.uniform1i(l.u_color, this.colorFromCSSString(object.strokeStyle));
      this.setCircleOutline(gl, 0, 0, segmentsCount, object.radius, object.lineWidth);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, segmentsCount * 2 + 2);
    }
  };

  return WebGLColorShaderProgram;

})();



},{"../../engine":1}],23:[function(require,module,exports){
var Engine, WebGLTextureShaderProgram;

Engine = require('../../engine');

module.exports = WebGLTextureShaderProgram = (function() {
  function WebGLTextureShaderProgram(gl) {
    var initBuffers, initShaders, locations, program;
    initShaders = void 0;
    initBuffers = void 0;
    program = void 0;
    locations = void 0;
    this.cache = {
      regularTextCoordBuffer: false,
      animatedTextCoordBuffer: false,
      rectangleCornerBuffer: false,
      currentBuffer: false,
      currentTexture: void 0,
      textures: {}
    };
    this.program = gl.createProgram();
    this.initShaders(gl);
    this.bindLocations(gl);
    this.initBuffers(gl);
    return;
  }

  WebGLTextureShaderProgram.prototype.initShaders = function(gl) {
    var fragmentCode, fragmentShader, vertexCode, vertexShader;
    vertexCode = void 0;
    fragmentCode = void 0;
    vertexShader = void 0;
    fragmentShader = void 0;
    vertexCode = "attribute vec2 a_position; attribute vec2 a_texCoord; uniform vec2 u_resolution; uniform mat3 u_matrix; varying vec2 v_texCoord; void main() { vec2 position = (u_matrix * vec3(a_position, 1)).xy; vec2 zeroToOne = position / u_resolution; vec2 zeroToTwo = zeroToOne * 2.0; vec2 clipSpace = zeroToTwo - 1.0; gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); v_texCoord = a_texCoord; }";
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexCode);
    gl.compileShader(vertexShader);
    gl.attachShader(this.program, vertexShader);
    fragmentCode = "precision mediump float; uniform sampler2D u_image; varying vec2 v_texCoord; uniform float u_alpha; void main() { vec4 textureColor = texture2D(u_image, v_texCoord); gl_FragColor = vec4(textureColor.rgb, textureColor.a * u_alpha); }";
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentCode);
    gl.compileShader(fragmentShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
  };

  WebGLTextureShaderProgram.prototype.bindLocations = function(gl) {
    this.locations = {
      a_texCoord: gl.getAttribLocation(this.program, "a_texCoord"),
      a_position: gl.getAttribLocation(this.program, "a_position"),
      u_resolution: gl.getUniformLocation(this.program, "u_resolution"),
      u_matrix: gl.getUniformLocation(this.program, "u_matrix"),
      u_alpha: gl.getUniformLocation(this.program, "u_alpha")
    };
  };

  WebGLTextureShaderProgram.prototype.initBuffers = function(gl) {
    this.cache.regularTextCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cache.regularTextCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);
    this.cache.animatedTextCoordBuffer = gl.createBuffer();
    this.cache.rectangleCornerBuffer = gl.createBuffer();
  };

  WebGLTextureShaderProgram.prototype.setRegularTextCoordBuffer = function(gl) {
    if (this.cache.currentBuffer !== this.cache.regularTextCoordBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.cache.regularTextCoordBuffer);
      gl.enableVertexAttribArray(this.locations.a_texCoord);
      gl.vertexAttribPointer(this.locations.a_texCoord, 2, gl.FLOAT, false, 0, 0);
      this.cache.currentBuffer = this.cache.regularTextCoordBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.cache.rectangleCornerBuffer);
    }
  };

  WebGLTextureShaderProgram.prototype.setAnimatedTextCoordBuffer = function(gl, object) {
    var x1, x2, y1, y2;
    x1 = (object.clipWidth + object.bm.spacing) * object.imageNumber;
    x2 = x1 + object.clipWidth;
    x1 /= object.bm.width;
    x2 /= object.bm.width;
    y1 = 0;
    y2 = 1;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cache.animatedTextCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.locations.a_texCoord);
    gl.vertexAttribPointer(this.locations.a_texCoord, 2, gl.FLOAT, false, 0, 0);
    this.cache.currentBuffer = this.cache.animatedTextCoordBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cache.rectangleCornerBuffer);
  };

  WebGLTextureShaderProgram.prototype.onSet = function(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cache.rectangleCornerBuffer);
    gl.enableVertexAttribArray(this.locations.a_position);
    gl.vertexAttribPointer(this.locations.a_position, 2, gl.FLOAT, false, 0, 0);
  };

  WebGLTextureShaderProgram.prototype.renderSprite = function(gl, object, wm) {
    var l, t;
    l = this.locations;
    if (object.renderType === "textblock" && this.cache.textures[object.bm.oldSrc]) {
      delete this.cache.textures[object.bm.oldSrc];
    }
    t = this.getSpriteTexture(gl, object);
    if (this.cache.currentTexture !== t) {
      this.cache.currentTexture = t;
      if (object.imageLength === 1) {
        this.setRegularTextCoordBuffer(gl);
      } else {
        if (engine.gameTime - object.animationLastSwitch > 1000 / object.animationSpeed) {
          object.imageNumber = object.imageNumber + (object.animationSpeed > 0 ? 1 : -1);
          object.animationLastSwitch = engine.gameTime;
          if (object.imageNumber === object.imageLength) {
            object.imageNumber = (object.animationLoops ? 0 : object.imageLength - 1);
          } else {
            if (object.imageNumber === -1) {
              object.imageNumber = (object.animationLoops ? object.imageLength - 1 : 0);
            }
          }
        }
        this.setAnimatedTextCoordBuffer(gl, object);
      }
      gl.bindTexture(gl.TEXTURE_2D, t);
      Engine.Helpers.WebGL.setPlane(gl, 0, 0, object.clipWidth, object.clipHeight);
    }
    gl.uniformMatrix3fv(l.u_matrix, false, wm);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  WebGLTextureShaderProgram.prototype.getSpriteTexture = function(gl, object) {
    return this.cache.textures[object.bm.src] || this.createSpriteTexture(gl, object.bm);
  };

  WebGLTextureShaderProgram.prototype.createSpriteTexture = function(gl, image) {
    var texture;
    texture = void 0;
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    if (image.imageLength === 1) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.cache.textures[image.src] = texture;
    return texture;
  };

  return WebGLTextureShaderProgram;

})();



},{"../../engine":1}],24:[function(require,module,exports){

/*
Constructor for the sound class

@name Sound.Effect
@class A wrapper-class for audio-elements. A Sound object stores multiple copies of the same sound to enable multiple simultaneous playbacks, and provides functions for controlling (start, stop) each playback.

@property {HTMLAudioElement} source The audio element which is used as the source of the music object

@param {HTMLAudioElement} audioElement The Audio element to use as source for the sound object
 */
var Effect;

module.exports = Effect = (function() {
  function Effect(audioElement) {
    if (audioElement === void 0) {
      throw new Error("Missing argument: audioElement");
    }
    if (audioElement.toString() !== "[object HTMLAudioElement]") {
      throw new Error("Argument audioElement has to be of type HTMLAudioElement");
    }
    this.source = audioElement;
    this.playbackId = 0;
    this.elements = [];
    this.source.addEventListener("canplaythrough", (function(_this) {
      return function() {
        _this.cacheCopies();
      };
    })(this), false);
    return;
  }


  /*
  Caches copies of the sound element, to enable simultaneous playback of the sound.
  This function is automatically called when the source sound is ready for playback.
  
  @private
   */

  Effect.prototype.cacheCopies = function() {
    var i, results;
    i = 0;
    results = [];
    while (i < engine.cachedSoundCopies) {
      this.elements.push(this.source.cloneNode());
      this.elements[i].started = false;
      results.push(i++);
    }
    return results;
  };


  /*
  Starts a playback of the object. The object supports multiple playbacks. Therefore a playback ID is issued for each playback, making it possible to stop a specific playback, or stop it from looping.
  
  @param {boolean} loop Whether or not to loop the playback
  @return {number|boolean} If playback succeeds: a playback ID representing the playback, else: false
   */

  Effect.prototype.play = function(loop_) {
    var j, len, ref, sound;
    if (Engine.Sounds.Muted) {
      return false;
    }
    ref = this.elements;
    for (j = 0, len = ref.length; j < len; j++) {
      sound = ref[j];
      if ((sound.started === false || sound.ended) && !sound.loop) {
        sound.started = true;
        sound.volume = 1;
        sound.play();
        if (loop_) {
          sound.loop = "loop";
        }
        this.playbackId++;
        sound.playbackId = this.playbackId;
        return this.playbackId;
      }
    }
    console.log("Too many playbacks of the same sound: " + this.source.src);
    return false;
  };


  /*
  Stops a specific playback of the object
  
  @param {number} playbackId The playback ID of the playback to stop. The ID is generated when a playback is started, and is returned by the play-function
   */

  Effect.prototype.stop = function(playbackId) {
    var j, len, ref, sound;
    if (playbackId === void 0) {
      throw new Error("Missing argument: playbackId");
    }
    ref = this.elements;
    for (j = 0, len = ref.length; j < len; j++) {
      sound = ref[j];
      if (sound.playbackId === playbackId && sound.started && !sound.ended) {
        sound.volume = 0;
        sound.loop = false;
        return true;
      }
    }
    return false;
  };


  /*
  Stops all playbacks of the object
   */

  Effect.prototype.stopAll = function() {
    var j, len, ref, sound;
    ref = this.elements;
    for (j = 0, len = ref.length; j < len; j++) {
      sound = ref[j];
      if (sound.started && !sound.ended) {
        sound.volume = 0;
        sound.loop = false;
      }
    }
  };


  /*
  Stops a specific playback from looping
  
  @param {number} playbackId The playback ID of the playback to stop from looping. The ID is generated when a playback is started, and is returned by the play-function
   */

  Effect.prototype.stopLoop = function(playbackId) {
    var sound;
    throw new Error("Missing argument: playbackId")((function() {
      var j, len, ref;
      if (playbackId === void 0) {
        ref = this.elements;
        for (j = 0, len = ref.length; j < len; j++) {
          sound = ref[j];
          if (sound.playbackId === playbackId && sound.started && !sound.ended) {
            sound.loop = false;
            true;
          }
        }
        return false;
      }
    }).call(this));
  };

  return Effect;

})();



},{}],25:[function(require,module,exports){

/*
Constructor for the Music class

@name Sound.Music
@class A wrapper-class for audio-elements which are to be used as music.

@property {boolean} paused Whether or not the music object is currently paused
@property {HTMLAudioElement} source The audio element which is used as the source of the music object

@param {HTMLAudioElement} audioElement The Audio element to use as source for the music object
 */
var Music;

module.exports = Music = (function() {
  function Music(audioElement) {
    if (audioElement === void 0) {
      throw new Error("Missing argument: audioElement");
    }
    if (audioElement.toString() !== "[object HTMLAudioElement]") {
      throw new Error("Argument audioElement has to be of type HTMLAudioElement");
    }
    this.source = audioElement;
    this.paused = false;
    return;
  }


  /*
  Starts playback of the object
  
  @param {boolean} loop Whether or not to loop the playback
  @return {boolean} True if the playback has started successfully, false if not
   */

  Music.prototype.play = function(loop_) {
    if (engine.musicMuted) {
      return false;
    }
    this.source.play();
    this.paused = false;
    if (loop_) {
      this.source.loop = "loop";
    }
    return true;
  };


  /*
  Pauses the playback of the object
   */

  Music.prototype.pause = function() {
    this.paused = true;
    this.source.pause();
  };


  /*
  Stops the playback of the object
   */

  Music.prototype.stop = function() {
    if (!this.source.ended) {
      this.source.pause();
      this.source.currentTime = 0;
      this.source.loop = false;
      return true;
    }
    return false;
  };


  /*
  Stops the playback from looping
   */

  Music.prototype.stopLoop = function() {
    if (this.source.started && !this.source.ended) {
      this.source.loop = false;
      return true;
    }
    return false;
  };

  return Music;

})();



},{}],26:[function(require,module,exports){
var Child, Engine;

Engine = require('../engine');


/*
@name View.Child
@class If a class inherits Child it can be added to the view list. Therefore all objects which can be drawn inherits this class
 */

module.exports = Child = (function() {
  function Child() {
    this.renderType = "";
    this.initWithoutRedrawRegions();
    engine.registerObject(this);
    return;
  }

  Child.prototype.initWithoutRedrawRegions = function() {
    var hidden;
    this.x = 0;
    this.y = 0;
    this.opacity = 1;
    this.direction = 0;
    this.size = 1;
    this.widthScale = 1;
    this.heightScale = 1;
    hidden = {
      offset: new Engine.Geometry.Vector()
    };
    Object.defineProperty(this, "offset", {
      get: function() {
        return hidden.offset;
      },
      set: function(value) {
        if (typeof value === "string") {
          this.offsetGlobal = value;
          hidden.offset = this.parseOffsetGlobal(value);
        } else {
          this.offsetGlobal = false;
          hidden.offset = value;
        }
        return value;
      }
    });
  };

  Child.prototype.initWithRedrawRegions = function() {
    var hidden;
    this.hasChanged = false;
    hidden = void 0;
    hidden = {
      x: 0,
      y: 0,
      opacity: 1,
      direction: 0,
      size: 1,
      widthScale: 1,
      heightScale: 1,
      offset: void 0,
      parentObject: this
    };
    Object.defineProperty(this, "x", {
      get: function() {
        return hidden.x;
      },
      set: function(value) {
        if (hidden.x !== value) {
          hidden.x = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "y", {
      get: function() {
        return hidden.y;
      },
      set: function(value) {
        if (hidden.y !== value) {
          hidden.y = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "opacity", {
      get: function() {
        return hidden.opacity;
      },
      set: function(value) {
        if (hidden.opacity !== value) {
          hidden.opacity = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "direction", {
      get: function() {
        return hidden.direction;
      },
      set: function(value) {
        if (hidden.direction !== value) {
          hidden.direction = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "size", {
      get: function() {
        return hidden.size;
      },
      set: function(value) {
        if (hidden.size !== value) {
          hidden.size = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "widthScale", {
      get: function() {
        return hidden.widthScale;
      },
      set: function(value) {
        if (hidden.widthScale !== value) {
          hidden.widthScale = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "heightScale", {
      get: function() {
        return hidden.heightScale;
      },
      set: function(value) {
        if (hidden.heightScale !== value) {
          hidden.heightScale = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "offset", {
      get: function() {
        return hidden.offset;
      },
      set: function(value) {
        var off_;
        if (hidden.offset !== value) {
          hidden.offset = value;
          off_ = {
            x: value.x,
            y: value.y
          };
          Object.defineProperty(hidden.offset, "x", {
            get: function() {
              return off_.x;
            },
            set: function(value) {
              if (off_.x !== value) {
                off_.x = value;
                hidden.parentObject.onAfterChange();
              }
            }
          });
          Object.defineProperty(hidden.offset, "y", {
            get: function() {
              return off_.y;
            },
            set: function(value) {
              if (off_.y !== value) {
                off_.y = value;
                hidden.parentObject.onAfterChange();
              }
            }
          });
          this.onAfterChange();
        }
      }
    });
    this.offset = new Vector();
  };

  Child.prototype.onAfterChange = function() {
    if (!this.hasChanged && this.isDrawn()) {
      this.lastRedrawRegion = this.currentRedrawRegion;
      this.currentRedrawRegion = (this.getCombinedRedrawRegion ? this.getCombinedRedrawRegion() : this.getRedrawRegion());
      if (this.currentRedrawRegion) {
        engine.redrawObjects.push(this);
        this.hasChanged = true;
      }
    }
  };


  /*
  Parses an offset global into an actual Vector offset
  (this function is only here for convenience and should be replaced by any class that inherits the child class)
  
  @param  {number} offset Offset global (OFFSET_TOP_LEFT, etc.)
  @return {Vector} A parsed version of the offset global
   */

  Child.prototype.parseOffsetGlobal = function(offset) {
    return new Engine.Geometry.Vector();
  };


  /*
  Checks if the child object is inside a room that is currently visible
  
  @return {Boolean} Whether or not the child object is currently in a visible room
   */

  Child.prototype.isInVisibleRoom = function() {
    var p;
    p = void 0;
    p = this.getParents().pop();
    return p === engine.currentRoom || p === engine.masterRoom;
  };


  /*
  Checks if the child object is in a state where it will get drawn.
  For this function to return true, the child object has to be both visible and placed in a visible room.
  
  @return {Boolean} Whether or not the child object is in a state where it will get drawn
   */

  Child.prototype.isDrawn = function() {
    return this.isVisible() && this.isInVisibleRoom();
  };


  /*
  Fetches the position of the child inside the room
  
  @return {Vector|Boolean} The objects position in its room, or false if the object is not placed in any room.
   */

  Child.prototype.getRoomPosition = function() {
    var i, parent, parents, pos;
    pos = void 0;
    parents = void 0;
    parent = void 0;
    i = void 0;
    parents = this.getParents();
    if (parents.length && parents[parents.length - 1] instanceof Engine.Room) {
      pos = new Vector(this.x, this.y);
      i = 0;
      while (i < parents.length) {
        parent = parents[i];
        pos.scale(parent.widthScale * parent.size, parent.heightScale * parent.size);
        pos.rotate(parent.direction);
        pos.move(parent.x, parent.y);
        i++;
      }
      return pos;
    } else {
      return false;
    }
  };


  /*
  Creates and returns and array of all the child's parents (from closest to farthest)
  
  @return {View.Container[]} A list of all the child's parents
   */

  Child.prototype.getParents = function() {
    var parent, parents;
    parent = void 0;
    parents = void 0;
    parents = [];
    parent = this;
    while ((parent = parent.parent) !== void 0) {
      parents.push(parent);
    }
    return parents;
  };


  /*
  Finds the room to which the object is currently added
  
  @return {View.Room|Boolean} The room to which the object is currently added, or false if the object is not added to a room
   */

  Child.prototype.getRoom = function() {
    var ancestor, parents;
    parents = void 0;
    ancestor = void 0;
    parents = this.getParents();
    if (parents.length === 0) {
      return false;
    }
    ancestor = parents[parents.length - 1];
    if (ancestor instanceof Engine.Room) {
      return ancestor;
    } else {
      return false;
    }
  };


  /*
  Sets the position of the object relative to its parent
  
  @param {number} x The horisontal position
  @param {number} y The vertical position
   */

  Child.prototype.moveTo = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };


  /*
  Calculates the distance to another child (the distance between the object's positions)
  @param  {View.Child} child The object to calculate the distance to
  @return {number} The distance in pixels
   */

  Child.prototype.getDistanceTo = function(child) {
    return this.getRoomPosition().subtract(child.getRoomPosition()).getLength();
  };


  /*
  Calculates the direction to another child
  @param  {View.Child} child The object to calculate the direction to
  @return {number} The direction in radians
   */

  Child.prototype.getDirectionTo = function(child) {
    return child.getRoomPosition().subtract(this.getRoomPosition()).getDirection();
  };


  /*
  Checks if the objects is visible. This function runs before each draw to ensure that it is necessary
  @return {boolean} Whether or not the object is visible (based on its size and opacity vars)
   */

  Child.prototype.isVisible = function() {
    return !(this.size === 0 || this.widthScale === 0 || this.heightScale === 0);
  };

  return Child;

})();



},{"../engine":1}],27:[function(require,module,exports){
var Circle, Engine,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
Constructor for Circle class, uses the set function, to set the properties of the circle.

@name View.Circle
@class A class which is used for handling circles
@augments Math.Circle
@augments View.Child

@property {number} x The circle's horizontal position
@property {number} y The circle's vertical position
@property {number} radius The circle's radius
@property {string} strokeStyle The circle's color if added to a view (css color string)
@property {number} lineWidth The circle's width if added to a view (in px)
@property {string} fillStyle The circle's fill color if added to a view (css color string)

@param {number} x The x-coordinate for the center of the circle
@param {number} y The y-coordinate for the center of the circle
@param {number} radius The radius for the circle
@param {string} [fillStyle = "#000"] The circle's fill color if added to a view (css color string)
@param {string} [strokeStyle = "#000"] The circle's color if added to a view (css color string)
@param {number} [lineWidth = 1] The circle's width if added to a view (in px)
 */

module.exports = Circle = (function(superClass) {
  extend(Circle, superClass);

  Engine.Helpers.Mixin.mixin(Circle, Engine.Views.Child);

  function Circle(x, y, radius, fillStyle, strokeStyle, lineWidth) {
    Engine.Views.Child.call(this);
    this.renderType = "circle";
    if (engine.enableRedrawRegions) {
      this.CircleInitWithRedrawRegions(x, y, radius, fillStyle, strokeStyle, lineWidth);
    } else {
      this.CircleInitWithoutRedrawRegions(x, y, radius, fillStyle, strokeStyle, lineWidth);
    }
    return;
  }

  Circle.prototype.CircleInitWithoutRedrawRegions = function(x, y, radius, fillStyle, strokeStyle, lineWidth) {
    this.radius = radius;
    this.fillStyle = fillStyle || "#000";
    this.strokeStyle = strokeStyle || "#000";
    this.lineWidth = lineWidth || 1;
    this.set(x, y, radius);
  };

  Circle.prototype.CircleInitWithRedrawRegions = function(x, y, radius, fillStyle, strokeStyle, lineWidth) {
    var hidden;
    hidden = void 0;
    hidden = {
      radius: radius,
      fillStyle: fillStyle || "#000",
      strokeStyle: strokeStyle || "#000",
      lineWidth: lineWidth || 1
    };
    Object.defineProperty(this, "radius", {
      get: function() {
        return hidden.radius;
      },
      set: function(value) {
        if (hidden.radius !== value) {
          hidden.radius = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "fillStyle", {
      get: function() {
        return hidden.fillStyle;
      },
      set: function(value) {
        if (hidden.fillStyle !== value) {
          hidden.fillStyle = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "strokeStyle", {
      get: function() {
        return hidden.strokeStyle;
      },
      set: function(value) {
        if (hidden.strokeStyle !== value) {
          hidden.strokeStyle = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "lineWidth", {
      get: function() {
        return hidden.lineWidth;
      },
      set: function(value) {
        if (hidden.lineWidth !== value) {
          hidden.lineWidth = value;
          this.onAfterChange();
        }
      }
    });
    this.set(x, y, radius);
  };


  /*
  Calculates the region which the object will fill out when redrawn.
  
  @private
  @return {Math.Rectangle} The bounding rectangle of the redraw
   */

  Circle.prototype.getRedrawRegion = function() {
    var ln, rect;
    rect = void 0;
    ln = void 0;
    ln = Math.ceil(this.lineWidth / 2);
    rect = new Engine.Geometry.Rectangle(Math.floor(this.x - (this.radius + ln + 5)), Math.floor(this.y - (this.radius + ln + 5)), Math.ceil((this.radius + ln + 5) * 2), Math.ceil((this.radius + ln + 5) * 2));
    return rect.add(this.parent.getRoomPosition());
  };

  return Circle;

})(Engine.Geometry.Circle);



},{"../engine":1}],28:[function(require,module,exports){
var Collidable, Engine,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
The constructor for the Collidable class

@name View.Collidable
@class A class with functions for collision checking.
Can check both for precise (bitmap-based) collisions and bounding box collisions
@augments View.Sprite

@property {HTMLCanvasElement|HTMLImageElement} mask The mask to use for bitmap based collision checking, by default the mask will be autogenerated from the collidable's source
@property {int} collisionResolution The space between the checked pixels when checking for bitmap based collisions

@param {string} source A resource string for the sprite of the created object.
@param {number} [x=0] The x-position of the created object.
@param {number} [y=0] The y-position of the created object.
@param {number} [direction=0] The direction of the created object. Defaults to 0
@param {object} [additionalProperties] An object containing key-value pairs that will be set as properties for the created object. Can be used for setting advanced options such as sprite offset and opacity.
 */

module.exports = Collidable = (function(superClass) {
  extend(Collidable, superClass);

  function Collidable(source, x, y, direction, additionalProperties) {
    Engine.Views.Sprite.call(this, source, x, y, direction, additionalProperties);
    this.mask = (this.mask ? this.mask : engine.loader.getMask(source, this.getTheme()));
    this.collisionResolution = (this.collisionResolution ? this.collisionResolution : engine.defaultCollisionResolution);
    return;
  }


  /*
  Checks for a collision with other objects' rotated BBoxes. The word polygon is used because the check is actually done by using the Polygon object.
  
  @param {Collidable|Collidable[]} objects Target object, or array of target objects
  @param {boolean} getCollidingObjects Whether or not to return an array of colliding objects (is slower because the check cannot stop when a single collission has been detected)
  @return {Object[]|boolean} If getCollidingObjects is set to true, an array of colliding object, else a boolean representing whether or not a collission was detected.
   */

  Collidable.prototype.boundingBoxCollidesWith = function(objects, getCollidingObjects) {
    var collidingObjects, i, obj, pol1, pol2;
    if (objects === void 0) {
      throw new Error("Missing argument: objects");
    }
    if (!Array.prototype.isPrototypeOf(objects)) {
      objects = [objects];
    }
    getCollidingObjects = (getCollidingObjects !== void 0 ? getCollidingObjects : false);
    pol1 = void 0;
    pol2 = void 0;
    i = void 0;
    collidingObjects = void 0;
    obj = void 0;
    pol1 = this.getTransformedBoundingBox();
    collidingObjects = [];
    i = 0;
    while (i < objects.length) {
      obj = objects[i];
      pol2 = obj.getTransformedBoundingBox();
      if (pol1.intersects(pol2) || pol1.contains(pol2.points[0]) || pol2.contains(pol1.points[0])) {
        if (getCollidingObjects) {
          collidingObjects.push(obj);
        } else {
          return true;
        }
      }
      i++;
    }
    if (collidingObjects.length) {
      return collidingObjects;
    } else {
      return false;
    }
  };

  Collidable.prototype.getTransformedBoundingBox = function() {
    var box, i, parent, parents;
    box = void 0;
    parents = void 0;
    parent = void 0;
    i = void 0;
    box = this.mask.bBox.copy().move(-this.offset.x, -this.offset.y);
    parents = this.getParents();
    parents.unshift(this);
    i = 0;
    while (i < parents.length) {
      parent = parents[i];
      if (parent.size !== 1 || parent.widthScale !== 1 || parent.heightScale !== 1) {
        box.scale(parent.size * parent.widthScale, parent.size * parent.heightScale);
      }
      if (parent.direction !== 0) {
        box.rotate(parent.direction);
      }
      if (parent.x !== 0 || parent.y !== 0) {
        box.move(parent.x, parent.y);
      }
      i++;
    }
    return box;
  };


  /*
  Checks for a mask based collisions with other Collidable objects.
  
  @param {View.Collidable|View.Collidable[]} objects Target object, or array of target objects
  @param {boolean} getCollisionPosition If true, the function returns an object representing the position of the detected collision. Defaults to false
  @return {Object|boolean} If getCollisionPosition is false, a boolean representing whether or not a collision was detected, else an object of the following type:
  <code>{
  "x": [The average horizontal distance from the Collidable to the detected collision],
  "y": [The average vertical distance from the Collidable to the detected collision],
  "pixelCount": [The number of colliding pixels]
  }</code>
   */

  Collidable.prototype.maskCollidesWith = function(objects, getCollisionPosition) {
    var avX, avY, bitmap, i, length, pixel, pxArr, retVector, x, y;
    if (objects === void 0) {
      throw new Error("Missing argument: objects");
    }
    bitmap = void 0;
    i = void 0;
    length = void 0;
    pixel = void 0;
    pxArr = void 0;
    x = void 0;
    y = void 0;
    avX = void 0;
    avY = void 0;
    retVector = void 0;
    if (!Array.prototype.isPrototypeOf(objects)) {
      objects = [objects];
    }
    getCollisionPosition = (getCollisionPosition !== void 0 ? getCollisionPosition : false);
    bitmap = this.createCollisionBitmap(objects);
    length = bitmap.data.length / 4;
    pxArr = [];
    pixel = 0;
    while (pixel < length) {
      x = pixel % bitmap.width;
      if (this.collisionResolution > 1 && x < this.collisionResolution) {
        y = Math.floor(pixel / bitmap.width);
        pixel -= x;
        if (y % 2) {
          pixel += Math.floor(this.collisionResolution / 2);
        }
      }
      if (bitmap.data[pixel * 4] < 127) {
        if (getCollisionPosition) {
          if (y === void 0) {
            y = Math.floor(pixel / bitmap.width);
          }
          pxArr.push({
            x: x,
            y: y
          });
        } else {
          return true;
        }
      }
      pixel += this.collisionResolution;
    }
    if (pxArr.length > 0) {
      pxArr = pxArr.sort(function(a, b) {
        if (a.x === b.x) {
          return 0;
        } else if (a.x > b.x) {
          return 1;
        } else {
          return -1;
        }
      });
      avX = (pxArr[0].x + pxArr[pxArr.length - 1].x) / 2;
      pxArr = pxArr.sort(function(a, b) {
        if (a.y === b.y) {
          return 0;
        } else if (a.y > b.y) {
          return 1;
        } else {
          return -1;
        }
      });
      avY = (pxArr[0].y + pxArr[pxArr.length - 1].y) / 2;
      avX -= this.offset.x;
      avY -= this.offset.y;
      avX /= this.size * this.widthScale;
      avY /= this.size * this.heightScale;
      retVector = new Engine.Geometry.Vector(avX, avY);
      retVector.rotate(this.direction);
      retVector.pixelCount = pxArr.length;
      return retVector;
    }
    return false;
  };

  Collidable.prototype.createCollisionBitmap = function(objects) {
    var c, calc, canvas, dt, i, ii, lm, mask, obj, offset, parents, wm;
    obj = void 0;
    canvas = void 0;
    mask = void 0;
    c = void 0;
    parents = void 0;
    i = void 0;
    ii = void 0;
    wm = void 0;
    lm = void 0;
    dt = void 0;
    calc = void 0;
    offset = void 0;
    mask = this.mask;
    calc = Engine.Helpers.MatrixCalculation;
    canvas = document.createElement("canvas");
    canvas.width = Math.ceil(this.clipWidth);
    canvas.height = Math.ceil(this.clipHeight);
    c = canvas.getContext("2d");
    c.fillStyle = "#FFF";
    c.fillRect(0, 0, canvas.width, canvas.height);
    parents = this.getParents();
    parents.unshift(this);
    wm = calc.makeIdentity();
    wm = calc.matrixMultiply(calc.makeTranslation(this.offset.x, this.offset.y), wm);
    i = 0;
    while (i < parents.length) {
      wm = calc.matrixMultiply(calc.calculateInverseLocalMatrix(parents[i]), wm);
      i++;
    }
    if (wm === false) {
      throw new Error("Trying to detect collision for invisble object");
    }
    i = 0;
    while (i < objects.length) {
      obj = objects[i];
      if (obj === this) {
        continue;
      }
      lm = calc.makeIdentity();
      parents = obj.getParents();
      parents.reverse();
      parents.push(obj);
      ii = 0;
      while (ii < parents.length) {
        lm = calc.matrixMultiply(calc.calculateLocalMatrix(parents[ii]), lm);
        ii++;
      }
      offset = calc.matrixMultiply(lm, wm);
      offset = calc.matrixMultiply(calc.makeTranslation(-obj.offset.x, -obj.offset.y), offset);
      c.setTransform(offset[0], offset[1], offset[3], offset[4], offset[6], offset[7]);
      c.drawImage(obj.mask, (obj.clipWidth + obj.bm.spacing) * obj.imageNumber, 0, obj.clipWidth, obj.clipHeight, 0, 0, obj.clipWidth, obj.clipHeight);
      i++;
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 0.5;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.drawImage(mask, (this.clipWidth + this.bm.spacing) * this.imageNumber, 0, this.clipWidth, this.clipHeight, 0, 0, this.clipWidth, this.clipHeight);
    return c.getImageData(0, 0, canvas.width, canvas.height);
  };


  /*
  A "metafunction" for checking if the Collidable collides with another object of the same type.
  This function uses boundingBoxCollidesWith for narrowing down the number of objects to check, then uses maskCollidesWith for doing a precise collision check on the remaining objects.
  
  @param {View.Collidable|View.Collidable[]} objects Target object, or array of target objects
  @param {boolean} getCollisionPosition If true, the function returns an object representing the position of the detected collision. Defaults to false
  @param {boolean} getCollidingObjects If true, the function returns all colliding objects
  @return {Object|boolean} If not getCollisionPosition or getCollidingObjects is true, a boolean representing whether or not a collision was detected. If getCollisionPosition and or getCollidingObjects is true, returns an object of the following type:
  <code>{
  "objects": [Array of colliding objects],
  "positions": [Array of collision positions for each object]
  "combinedPosition": [The combined position of the collision]
  }</code>
  
  If getCollidingObjects is false, the objects-array will be empty and the positions-array will only contain one position which is the average collision position for all colliding objects.
  If getCollisionPosition is false, the positions-array will be empty
  If both getCollisionPosition and getCollidingObjects are true, the objects-array will contain all colliding objects, and the positions-array will contain each colliding object's collision position
   */

  Collidable.prototype.collidesWith = function(objects, getCollisionPosition, getCollidingObjects) {
    var i, position, ret;
    if (objects === void 0) {
      throw new Error("Missing argument: objects");
    }
    ret = void 0;
    i = void 0;
    position = void 0;
    if (!Array.prototype.isPrototypeOf(objects)) {
      objects = [objects];
    }
    getCollidingObjects = (getCollidingObjects !== void 0 ? getCollidingObjects : false);
    if (this.size === 0 || this.widthScale === 0 || this.heightScale === 0) {
      return false;
    }
    objects = this.boundingBoxCollidesWith(objects, true);
    if (objects === false) {
      return false;
    }
    if (!getCollisionPosition && !getCollidingObjects) {
      return this.maskCollidesWith(objects);
    } else {
      ret = {
        objects: [],
        positions: [],
        combinedPosition: false
      };
      if (getCollidingObjects === false) {
        position = this.maskCollidesWith(objects, true);
        if (position) {
          ret.positions.push(position);
          ret.combinedPosition = position.copy();
          ret.combinedPosition.pixelCount = 0;
        }
      } else {
        if (getCollisionPosition) {
          i = 0;
          while (i < objects.length) {
            position = this.maskCollidesWith(objects[i], true);
            if (position) {
              ret.objects.push(objects[i]);
              ret.positions.push(position);
            }
            i++;
          }
          if (ret.positions.length) {
            ret.combinedPosition = new Engine.Geometry.Vector();
            ret.combinedPosition.pixelCount = 0;
            ret.positions.forEach(function(p) {
              ret.combinedPosition.add(p.scale(p.pixelCount));
              ret.combinedPosition.pixelCount += p.pixelCount;
            });
            ret.combinedPosition.scale(1 / ret.combinedPosition.pixelCount);
          }
        } else {
          i = 0;
          while (i < objects.length) {
            if (this.maskCollidesWith(objects[i])) {
              ret.objects.push(objects[i]);
            }
            i++;
          }
        }
      }
    }
    if (ret.positions.length + ret.objects.length !== 0) {
      return ret;
    } else {
      return false;
    }
  };

  return Collidable;

})(Engine.Views.Sprite);



},{"../engine":1}],29:[function(require,module,exports){
var Container, Engine,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

Engine = require('../engine');


/*
Constructor for the View class.

@name Container
@class A class for objects that are to be drawn on the canvas (or to contain drawn objects)
All objects which are drawn on the game's canvas extends the View-class.
@augments Child

@property {Child[]} children The view's children
@property {Container} parent The parent of the view or undefined if the view is an orphan
@property {boolean} drawCacheEnabled Whether or not draw caching is enabled

@param {Child} child1 A child to add to the view upon creation
@param {Child} child2 An other child to add to the view upon creation
@param {Child} child3 A third ...
 */

module.exports = Container = (function(superClass) {
  extend(Container, superClass);

  function Container() {
    var children;
    children = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    this.children = [];
    Container.__super__.constructor.call(this);
    this.parent = void 0;
    this.addChildren.apply(this, children);
    this.create = new Engine.ObjectCreator(this);
    return;
  }


  /*
  Adds children to a View object. If the object that the children are added to, is a descendant of the current room, the children will be drawn on the stage when added. The added children will be drawn above the current children.
  
  @param {Child} child1 A child to add to the View object
  @param {Child} child2 Another child to add...
  @return {Child[]} An array containing the added children
   */

  Container.prototype.addChildren = function(child1, child2) {
    var child, i;
    if (arguments.length === 0) {
      return;
    }
    i = 0;
    while (i < arguments.length) {
      child = arguments[i];
      if (!child instanceof Engine.Views.Child) {
        throw new Error("Argument child has to be of type: Child");
      }
      if (child.parent) {
        child.parent.removeChildren(child);
      }
      this.children.push(child);
      child.parent = this;
      engine.enableRedrawRegions && child.onAfterChange();
      if (child.refreshSource) {
        child.refreshSource();
      }
      i++;
    }
    return arguments;
  };


  /*
  Adds a child to a View object, below an already added child. This means that the inserted child (or children) will be drawn below the child which they are inserted below.
  
  @param {Child|Child[]} insertChildren Child or array of children to insert before an existing child
  @param {Child} child Current child to insert other children before
  @return {Child[]} Array of the inserted children
   */

  Container.prototype.insertBelow = function(insertChildren, child) {
    var arr, i;
    if (insertChildren === void 0) {
      throw new Error("Missing argument: insertChildren");
    }
    if (child === void 0) {
      throw new Error("Missing argument: child");
    }
    arr = void 0;
    i = void 0;
    if (!Array.prototype.isPrototypeOf(insertChildren)) {
      arr = [];
      arr.push(insertChildren);
      insertChildren = arr;
    }
    if ((i = this.children.indexOf(child)) !== -1) {
      this.children.splice.apply(this.children, [i, 0].concat(insertChildren));
    }
    i = 0;
    while (i < insertChildren.length) {
      child = insertChildren[i];
      if (!child instanceof Engine.Views.Child) {
        throw new Error("Argument child has to be of type: Child");
      }
      if (child.parent) {
        child.parent.removeChildren(child);
      }
      child.parent = this;
      engine.enableRedrawRegions && child.onAfterChange();
      if (child.refreshSource) {
        child.refreshSource();
      }
      i++;
    }
    return insertChildren;
  };


  /*
  Fetches an array of all the View's children.
  This will not return a pointer, so changing the returned array will not change the View's children.
  
  @return {Child[]} Array containing all of the View's children
   */

  Container.prototype.getChildren = function() {
    var i, ret;
    ret = void 0;
    i = void 0;
    ret = [];
    i = 0;
    while (i < this.children.length) {
      ret.push(this.children[i]);
      i++;
    }
    return ret;
  };


  /*
  Sets theme of an  Children whose theme is not already set, will inherit the set theme. To enforce the theme to all children, use the recursive argument.
  
  @param {string} themeName The name of the theme to apply as the object's theme
  @param {boolean} [recursive=false] Whether or not the set theme will be applied to children for which a theme has already been set. If this argument is unset, it will default to false
   */

  Container.prototype.setTheme = function(themeName, recursive) {
    var i;
    if (themeName) {
      if (loader.themes[themeName] === void 0) {
        throw new Error("Trying to set nonexistent theme: " + themeName);
      }
    } else {
      themeName = void 0;
    }
    i = void 0;
    recursive = (recursive !== void 0 ? recursive : false);
    this.theme = themeName;
    if (this.refreshSource) {
      this.refreshSource();
    }
    if (recursive) {
      i = 0;
      while (i < this.children.length) {
        this.children[i].setTheme(void 0, true);
        i++;
      }
    } else {
      this.applyToThisAndChildren(function() {
        if (this.refreshSource) {
          this.refreshSource();
        }
      });
    }
  };


  /*
  Executes a function for the View and all of the its children.
  
  @param {function} func Function to execute
   */

  Container.prototype.applyToThisAndChildren = function(func) {
    var i;
    if (func === void 0) {
      throw new Error("Missing argument: function");
    }
    i = void 0;
    func.call(this);
    i = 0;
    while (i < this.children.length) {
      if (this.children[i].applyToThisAndChildren) {
        this.children[i].applyToThisAndChildren(func);
      } else {
        func.call(this.children[i]);
      }
      i++;
    }
  };


  /*
  Gets the complete region that will used for drawing on next redraw
  
  @return {Math.Rectangle} A rectangle representing the region
   */

  Container.prototype.getCombinedRedrawRegion = function() {
    var addBox, box, child, i;
    box = void 0;
    addBox = void 0;
    i = void 0;
    child = void 0;
    if (this.getRedrawRegion) {
      box = this.getRedrawRegion();
    }
    i = 0;
    while (i < this.children.length) {
      child = this.children[i];
      if (child.getCombinedRedrawRegion) {
        addBox = child.getCombinedRedrawRegion();
      } else {
        addBox = child.getRedrawRegion();
      }
      child.currentRedrawRegion = addBox;
      if (addBox) {
        if (box) {
          box = box.getBoundingRectangle(addBox);
        } else {
          box = addBox;
        }
      }
      i++;
    }
    return box;
  };


  /*
  Removes one or more children from the
  
  @param {Child} child1 A child to add to the View object
  @param {Child} child2 Another child to remove...
  @return {Child[]} An array of the children which was removed. If an object, which was supplied as argument, was not a child of the View, it will not appear in the returned array
   */

  Container.prototype.removeChildren = function(child1, child2) {
    var childId, i, removed;
    if (arguments.length === 0) {
      throw new Error("This function needs at least one argument");
    }
    i = void 0;
    childId = void 0;
    removed = void 0;
    removed = [];
    i = arguments.length;
    while (i > -1) {
      childId = this.children.indexOf(arguments[i]);
      if (childId !== -1) {
        this.children.splice(childId, 1);
        removed.push(arguments[i]);
        arguments[i].parent = void 0;
      }
      i--;
    }
    return removed;
  };


  /*
  Removes all children from the
  
  @param {boolean} purge Whether or not to purge the removed children, meaning that their scheduled functions and loop-attached functions will be removed. (true by default)
   */

  Container.prototype.removeAllChildren = function(purge) {
    var rmChild;
    purge = (purge !== void 0 ? purge : true);
    rmChild = void 0;
    rmChild = this.children.splice(0, this.children.length);
    rmChild.forEach(function(c) {
      c.parent = void 0;
      if (purge) {
        engine.purge(c);
      }
    });
  };


  /*
  Draws all children and grandchildren of an object that inherits the View class. It is usually not necessary to call this function since it is automatically called by the engine's redraw loop.
  
  @param {CanvasRenderingContext2D} c A canvas' 2d context to draw the children on
  @param {Math.Rectangle} area A rectangle specifying the area to draw
  @param {boolean} forceRedraw Whether or not to force a redraw even though draw caching is enabled (this option is actually used when caching the view)
   */

  Container.prototype.draw = function(c, area, noCache) {
    if (engine.enableRedrawRegions) {
      this.drawRedrawRegions(c, area);
    } else {
      this.drawWholeCanvas(c, noCache);
    }
  };

  Container.prototype.drawWholeCanvas = function(c, noCache) {
    var child, i, len;
    i = void 0;
    len = void 0;
    child = void 0;
    if (!this.isVisible()) {
      return;
    }
    this.transformCanvasContext(c);
    if (this.drawCacheEnabled && !noCache) {
      c.drawImage(this.drawCacheCanvas, 0, 0);
    } else {
      if (this.drawCanvas) {
        engine.drawCalls++;
        this.drawCanvas(c);
        if (engine.drawBoundingBoxes && this.drawBoundingBox) {
          this.drawBoundingBox(c);
        }
        if (engine.drawMasks && this.drawMask) {
          this.drawMask(c);
        }
      }
      len = this.children.length;
      i = 0;
      while (i < len) {
        child = this.children[i];
        if (child.draw) {
          child.draw(c);
        } else if (child.isVisible()) {
          engine.drawCalls++;
          child.transformCanvasContext(c);
          child.drawCanvas(c);
          child.restoreCanvasContext(c);
        }
        i++;
      }
    }
    this.restoreCanvasContext(c);
  };


  /*
  Remove drawCanvas function which was inherited from View
   */

  Container.prototype.drawCanvas = void 0;

  Container.prototype.getRedrawRegion = void 0;

  return Container;

})(Engine.Views.Child);



},{"../engine":1}],30:[function(require,module,exports){
var Engine, GameObject,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
The constructor for the GameObject class.

@name View.GameObject
@class A class which incorporates functions that are often used by objects in games:
- Is drawn as a sprite
- Has movement vector
- Has collision checking
@augments View.Collidable

@property {Engine.CustomLoop} loop The loop to which movement of the object has been assigned
@property {boolean} alive Whether or not the object is alive. If the object is not alive, it will not move
@property {Math.Vector} speed The two-directional velocity of the object in px/second

@param {string} source A string representing the source of the object's bitmap
@param {number} [x=0] The x-position of the object in the game arena, in pixels
@param {number} [y=0] The y-position of the object in the game arena, in pixels
@param {number} [direction=0] The rotation (in radians) of the object when drawn in the game arena
@param {Object} [additionalProperties] An object containing additional properties to assign to the created object.
The default is:
<code>
{
size: 1,
opacity: 1,
composite: 'source-over',
offset: new Math.Vector('center', 'center'),
loop: 'eachFrame',
speed: new Math.Vector(0, 0)
}
</code>
 */

module.exports = GameObject = (function(superClass) {
  extend(GameObject, superClass);

  function GameObject(source, x, y, direction, additionalProperties) {
    if (source === void 0) {
      throw new Error("Missing argument: source");
    }
    if (x === void 0) {
      throw new Error("Missing argument: x");
    }
    if (y === void 0) {
      throw new Error("Missing argument: y");
    }
    GameObject.__super__.constructor.call(this, source, x, y, direction, additionalProperties);
    this.loop = (this.loop ? this.loop : engine.defaultActivityLoop);
    this.loop.attachFunction(this, this.updatePosition);
    this.speed = (this.speed ? this.speed : new Engine.Geometry.Vector(0, 0));
    this.alive = true;
    return;
  }


  /*
  Adds the game object's speed vector to its current position. This function is automatically run in each frame.
  
  @private
   */

  GameObject.prototype.updatePosition = function() {
    if (this.alive) {
      this.x += engine.convertSpeed(this.speed.x);
      this.y += engine.convertSpeed(this.speed.y);
    }
  };

  return GameObject;

})(Engine.Views.Collidable);



},{"../engine":1}],31:[function(require,module,exports){
var Engine, Line,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
Constructor for the Line class. Uses setFromVectors to create the line's start and end points

@name View.Line
@class A class which is used for handling lines
@augments View.Child
@augments Mixin.Animatable

@property {View.Vector} a The line's starting point
@property {View.Vector} b The line's ending point
@property {string} strokeStyle The line's color if added to a view (css color string)
@property {string} lineWidth The line's width if added to a view (in px)
@property {string} lineCap The line's cap style if added to a view

@param {View.Vector} startVector A Vector representing the start point of the line
@param {View.Vector} endVector A Vector representing the end point of the line
@param {string} [strokeStyle="#000"] The line's color if added to a view (css color string)
@param {number} [lineWidth=1] The line's width if added to a view (in px)
@param {string} [lineCap='butt'] The line's cap style if added to a view
 */

module.exports = Line = (function(superClass) {
  extend(Line, superClass);

  Engine.Helpers.Mixin.mixin(Line, Engine.Views.Child);

  function Line(startVector, endVector, strokeStyle, lineWidth, lineCap) {
    Engine.Views.Child.call(this);
    this.renderType = "line";
    if (engine.enableRedrawRegions) {
      this.LineInitWithRedrawRegions(startVector, endVector, strokeStyle, lineWidth, lineCap);
    } else {
      this.LineInitWithoutRedrawRegions(startVector, endVector, strokeStyle, lineWidth, lineCap);
    }
    return;
  }

  Line.prototype.LineInitWithoutRedrawRegions = function(startVector, endVector, strokeStyle, lineWidth, lineCap) {
    this.strokeStyle = strokeStyle || "#000";
    this.lineWidth = lineWidth || 1;
    this.lineCap = lineCap || "butt";
    this.setFromVectors(startVector || new Engine.Geometry.Vector(), endVector || new Engine.Geometry.Vector());
  };

  Line.prototype.LineInitWithRedrawRegions = function(startVector, endVector, strokeStyle, lineWidth, lineCap) {
    var hidden;
    hidden = void 0;
    hidden = {
      strokeStyle: strokeStyle || "#000",
      lineWidth: lineWidth || 1,
      lineCap: lineCap || "butt",
      a: void 0,
      b: void 0,
      parentObject: this
    };
    Object.defineProperty(this, "strokeStyle", {
      get: function() {
        return hidden.strokeStyle;
      },
      set: function(value) {
        if (hidden.strokeStyle !== value) {
          hidden.strokeStyle = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "lineCap", {
      get: function() {
        return hidden.lineCap;
      },
      set: function(value) {
        if (hidden.lineCap !== value) {
          hidden.lineCap = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "lineWidth", {
      get: function() {
        return hidden.lineWidth;
      },
      set: function(value) {
        if (hidden.lineWidth !== value) {
          hidden.lineWidth = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "a", {
      get: function() {
        return hidden.a;
      },
      set: function(value) {
        var xHidden, yHidden;
        if (hidden.a !== value) {
          hidden.a = value;
          xHidden = void 0;
          yHidden = void 0;
          xHidden = hidden.a.x;
          yHidden = hidden.a.y;
          Object.defineProperty(hidden.a, "x", {
            get: function() {
              return xHidden;
            },
            set: function(value) {
              if (xHidden !== value) {
                xHidden = value;
                hidden.parentObject.onAfterChange();
              }
            }
          });
          Object.defineProperty(hidden.a, "y", {
            get: function() {
              return yHidden;
            },
            set: function(value) {
              if (yHidden !== value) {
                yHidden = value;
                hidden.parentObject.onAfterChange();
              }
            }
          });
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "b", {
      get: function() {
        return hidden.b;
      },
      set: function(value) {
        var xHidden, yHidden;
        if (hidden.b !== value) {
          hidden.b = value;
          xHidden = void 0;
          yHidden = void 0;
          xHidden = hidden.b.x;
          yHidden = hidden.b.y;
          Object.defineProperty(hidden.b, "x", {
            get: function() {
              return xHidden;
            },
            set: function(value) {
              if (xHidden !== value) {
                xHidden = value;
                hidden.parentObject.onAfterChange();
              }
            }
          });
          Object.defineProperty(hidden.b, "y", {
            get: function() {
              return yHidden;
            },
            set: function(value) {
              if (yHidden !== value) {
                yHidden = value;
                hidden.parentObject.onAfterChange();
              }
            }
          });
          this.onAfterChange();
        }
      }
    });
    this.setFromVectors(startVector || new Engine.Geometry.Vector(), endVector || new Engine.Geometry.Vector());
  };


  /*
  Calculates the region which the object will fill out when redrawn.
  
  @private
  @return {Math.Rectangle} The bounding rectangle of the redraw
   */

  Line.prototype.getRedrawRegion = function() {
    var box, i, ln, parent, parents;
    box = void 0;
    parents = void 0;
    parent = void 0;
    i = void 0;
    ln = void 0;
    box = this.getPolygon();
    parents = this.getParents();
    parents.unshift(this);
    i = 0;
    while (i < parents.length) {
      parent = parents[i];
      box.scale(parent.size * parent.widthScale, parent.size * parent.heightScale);
      box.rotate(parent.direction);
      box.move(parent.x, parent.y);
      i++;
    }
    box = box.getBoundingRectangle();
    ln = Math.ceil(this.lineWidth / 2);
    box.x = Math.floor(box.x - ln);
    box.y = Math.floor(box.y - ln);
    box.width = Math.ceil(box.width + ln * 2 + 1);
    box.height = Math.ceil(box.height + ln * 2 + 1);
    return box;
  };


  /*
  Override View.Child's isVisible-function, making the line invisible if its points share the same coordinates
  Above is how canvas does by default (but other renderers should do this by default as well)
  
  @return {Boolean} Whether or not the line is "visible" (if not, renderers will not try to draw it)
   */

  Line.prototype.isVisible = function() {
    return View.Child.prototype.isVisible.call(this) && (this.a.x !== this.b.x || this.a.y !== this.b.y);
  };

  return Line;

})(Engine.Geometry.Line);



},{"../engine":1}],32:[function(require,module,exports){
var Engine, Polygon,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
The constructor for the Polygon class. Uses the setFromPoints-function to set the points of the polygon.

@name View.Polygon
@class A class which is used for handling polygons
@augments Math.Polygon
@augments View.Child

@property {Vector[]} points An array of the polygon's points. Each point is connect to the previous- and next points, and the first and last points are connected
@property {string} strokeStyle The polygon's color if added to a view (css color string)
@property {number} lineWidth The polygon's width if added to a view (in px)
@property {string} fillStyle The polygon's fill color if added to a view (css color string)

@param {Vector[]} points An array of Vector's which are to be used as points for the polygon. Keep in mind that the polygon will NOT copy the points, so changing another reference to one of the added points will change the point inside the polygon.
@param {string} [fillStyle = "#000"] The polygon's fill color if added to a view (css color string)
@param {string} [strokeStyle = "#000"] The polygon's color if added to a view (css color string)
@param {number} [lineWidth = 1] The polygon's width if added to a view (in px)
 */

module.exports = Polygon = (function(superClass) {
  extend(Polygon, superClass);

  Engine.Helpers.Mixin.mixin(Polygon, Engine.Views.Child);

  function Polygon(points, fillStyle, strokeStyle, lineWidth) {
    Engine.Views.Child.call(this);
    this.renderType = "polygon";
    this.setFromPoints(points);
    this.fillStyle = fillStyle || "#000";
    this.strokeStyle = strokeStyle || "#000";
    this.lineWidth = lineWidth || 1;
    this.opacity = 1;
    this.closed = 1;
    this.lineDash = [];
    return;
  }


  /*
  Calculates the region which the object will fill out when redrawn.
  
  @private
  @return {Rectangle} The bounding rectangle of the redraw
   */

  Polygon.prototype.getRedrawRegion = function() {
    var ln, rect;
    ln = void 0;
    rect = this.getBoundingRectangle();
    ln = Math.ceil(this.lineWidth / 2);
    rect.x -= ln;
    rect.y -= ln;
    rect.width += ln * 2;
    rect.height += ln * 2;
    return rect.add(this.parent.getRoomPosition());
  };

  return Polygon;

})(Engine.Geometry.Polygon);



},{"../engine":1}],33:[function(require,module,exports){
var Engine, Rectangle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
The constructor for the Rectangle class. Uses the set-function to set the properties of the rectangle.

@name View.Rectangle
@class A class which is used for drawable non-rotated rectangles
@augments Math.Rectangle
@augments View.Child

@property {number} x The top left corner's x-coordinate
@property {number} y The top left corner's y-coordinate
@property {number} width The width of the rectangle
@property {number} height The height of the rectangle
@property {string} strokeStyle The rectangle's color if added to a view (css color string)
@property {number} lineWidth The rectangle's width if added to a view (in px)
@property {string} fillStyle The rectangle's fill color if added to a view (css color string)

@param {number} x The x-coordinate for the rectangle's top left corner
@param {number} y The y-coordinate for the rectangle's top left corner
@param {number} [width = 0] The width of the rectangle
@param {number} [height = 0] The height of the rectangle
@param {string} [fillStyle = "#000"] The rectangle's fill color if added to a view (css color string)
@param {string} [strokeStyle = "#000"] The rectangle's color if added to a view (css color string)
@param {number} [lineWidth = 1] The rectangle's width if added to a view (in px)
 */

module.exports = Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  Engine.Helpers.Mixin.mixin(Rectangle, Engine.Views.Child);

  function Rectangle(x, y, width, height, fillStyle, strokeStyle, lineWidth) {
    Engine.Views.Child.call(this);
    this.renderType = "rectangle";
    if (engine.enableRedrawRegions) {
      this.RectangleInitWithRedrawRegions(x, y, width, height, fillStyle, strokeStyle, lineWidth);
    } else {
      this.RectangleInitWithoutRedrawRegions(x, y, width, height, fillStyle, strokeStyle, lineWidth);
    }
    return;
  }


  /*
  @lends View.Rectangle.prototype
   */

  Rectangle.prototype.RectangleInitWithoutRedrawRegions = function(x, y, width, height, fillStyle, strokeStyle, lineWidth) {
    var hidden;
    hidden = void 0;
    this.width = width || 0;
    this.height = height || 0;
    this.fillStyle = fillStyle || "#000";
    this.strokeStyle = strokeStyle || "#000";
    hidden = {
      lineWidth: lineWidth || 1
    };
    Object.defineProperty(this, "lineWidth", {
      get: function() {
        return hidden.lineWidth;
      },
      set: function(value) {
        if (hidden.lineWidth !== value) {
          hidden.lineWidth = value;
          if (this.offsetGlobal) {
            this.offset = this.offsetGlobal;
          }
        }
      }
    });
    this.set(x, y, width, height);
  };

  Rectangle.prototype.RectangleInitWithRedrawRegions = function(x, y, width, height, fillStyle, strokeStyle, lineWidth) {
    var hidden;
    hidden = void 0;
    hidden = {
      width: width || 0,
      height: height || 0,
      fillStyle: fillStyle || "#000",
      strokeStyle: strokeStyle || "#000",
      lineWidth: lineWidth || 1
    };
    Object.defineProperty(this, "width", {
      get: function() {
        return hidden.width;
      },
      set: function(value) {
        if (hidden.width !== value) {
          hidden.width = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "height", {
      get: function() {
        return hidden.height;
      },
      set: function(value) {
        if (hidden.height !== value) {
          hidden.height = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "fillStyle", {
      get: function() {
        return hidden.fillStyle;
      },
      set: function(value) {
        if (hidden.fillStyle !== value) {
          hidden.fillStyle = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "strokeStyle", {
      get: function() {
        return hidden.strokeStyle;
      },
      set: function(value) {
        if (hidden.strokeStyle !== value) {
          hidden.strokeStyle = value;
          this.onAfterChange();
        }
      }
    });
    Object.defineProperty(this, "lineWidth", {
      get: function() {
        return hidden.lineWidth;
      },
      set: function(value) {
        if (hidden.lineWidth !== value) {
          hidden.lineWidth = value;
          this.onAfterChange();
        }
      }
    });
    this.set(x, y, width, height);
  };


  /*
  Parses an offset global into an actual Math.Vector offset that fits the instance
  
  @param  {number} offset Offset global (OFFSET_TOP_LEFT, etc.)
  @return {Math.Vector} The offset vector the offset global corresponds to for the instance
   */

  Rectangle.prototype.parseOffsetGlobal = function(offset) {
    var ret;
    ret = new Math.Vector();
    if ([OFFSET_TOP_LEFT, OFFSET_MIDDLE_LEFT, OFFSET_BOTTOM_LEFT].indexOf(offset) !== -1) {
      ret.x = -this.lineWidth / 2;
    } else if ([OFFSET_TOP_CENTER, OFFSET_MIDDLE_CENTER, OFFSET_BOTTOM_CENTER].indexOf(offset) !== -1) {
      ret.x = this.width / 2;
    } else {
      if ([OFFSET_TOP_RIGHT, OFFSET_MIDDLE_RIGHT, OFFSET_BOTTOM_RIGHT].indexOf(offset) !== -1) {
        ret.x = this.width + this.lineWidth / 2;
      }
    }
    if ([OFFSET_TOP_LEFT, OFFSET_TOP_CENTER, OFFSET_TOP_RIGHT].indexOf(offset) !== -1) {
      ret.y = -this.lineWidth / 2;
    } else if ([OFFSET_MIDDLE_LEFT, OFFSET_MIDDLE_CENTER, OFFSET_MIDDLE_RIGHT].indexOf(offset) !== -1) {
      ret.y = this.height / 2;
    } else {
      if ([OFFSET_BOTTOM_LEFT, OFFSET_BOTTOM_CENTER, OFFSET_BOTTOM_RIGHT].indexOf(offset) !== -1) {
        ret.y = this.height + this.lineWidth / 2;
      }
    }
    return ret;
  };


  /*
  Calculates the region which the object will fill out when redrawn.
  
  @private
  @return {Rectangle} The bounding rectangle of the redraw
   */

  Rectangle.prototype.getRedrawRegion = function() {
    var ln, rect;
    ln = void 0;
    rect = this.copy();
    ln = Math.ceil(this.lineWidth / 2);
    rect.x -= ln;
    rect.y -= ln;
    rect.width += ln * 2;
    rect.height += ln * 2;
    return rect.add(this.parent.getRoomPosition());
  };

  return Rectangle;

})(Engine.Geometry.Rectangle);



},{"../engine":1}],34:[function(require,module,exports){
var Engine, Sprite,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');


/*
The constructor for Sprite objects.

@name View.Sprite
@class Class for drawing bitmaps with rotation and size.
Usually all graphical objects in a game are sprites or extends this class.
@augments View.Container
@augments Mixin.Animatable

@property {string} source A resource string representing the bitmap source of the sprite, use setSource() to set the source (do not set it directly)
@property {number} direction The direction of the sprite (in radians)
@property {int} imageNumber The current image in the animation (0 the source is not an animation)
@property {int} imageLength The number of images in the source (1 the source is not an animation)
@property {Vector} offset The offset with which the sprite will be drawn (to its position)
@property {number} animationSpeed The number of images / second in the animation (only relevant if the source is an animation)
@property {boolean} animationLoops Whether or not the animation should loop (only relevant if the source is an animation)
@property {number} size A size modifier which modifies both the width and the height of the sprite
@property {number} widthScale A size modifier which modifies the width of the sprite
@property {number} heightScale A size modifier which modifies the height of the object
@property {number} opacity The opacity of the sprite

@param {string} source A string representing the source of the object's bitmap
@param {number} [x=0] The x-position of the object in the game arena, in pixels
@param {number} [y=0] The y-position of the object in the game arena, in pixels
@param {number} [direction=0] The rotation (in radians) of the object when drawn in the game arena
@param {Object} [additionalProperties] An object containing additional properties to assign to the created object.
The default is:<code>
{
size: 1,
opacity: 1,
composite: 'source-over',
offset: new Math.Vector('center', 'center')
}</code>
 */

module.exports = Sprite = (function(superClass) {
  extend(Sprite, superClass);

  Engine.Helpers.Mixin.mixin(Sprite, Engine.Mixins.Animatable);

  function Sprite(source, x, y, direction, additionalProperties) {
    var offset;
    if (source === void 0) {
      throw new Error("Missing argument: source");
    }
    Sprite.__super__.constructor.call(this);
    this.renderType = "sprite";
    this.x = (x !== void 0 ? x : 0);
    this.y = (y !== void 0 ? y : 0);
    this.source = source;
    this.direction = (direction !== void 0 ? direction : 0);
    this.imageNumber = 0;
    this.imageLength = 1;
    this.animationSpeed = 30;
    this.animationLastSwitch = engine.gameTime;
    this.animationLoops = true;
    this.clipWidth;
    this.clipHeight;
    Object.defineProperty(this, "width", {
      get: function() {
        return Math.abs(this.clipWidth * this.size * this.widthScale);
      },
      set: function(value) {
        var sign;
        sign = (this.widthScale > 0 ? 1 : -1);
        this.widthScale = sign * Math.abs(value / (this.clipWidth * this.size));
        return value;
      }
    });
    Object.defineProperty(this, "height", {
      get: function() {
        return Math.abs(this.clipHeight * this.size * this.heightScale);
      },
      set: function(value) {
        var sign;
        sign = (this.heightScale > 0 ? 1 : -1);
        this.heightScale = sign * Math.abs(value / (this.clipHeight * this.size));
        return value;
      }
    });
    offset = Engine.Globals.OFFSET_MIDDLE_CENTER;
    if (additionalProperties && additionalProperties.offset) {
      offset = additionalProperties.offset;
      delete additionalProperties.offset;
    }
    Engine.Helpers.Mixin["import"](this, additionalProperties);
    if (!this.refreshSource()) {
      throw new Error("Sprite source was not successfully loaded: " + source);
    }
    this.offset = offset;
    if (engine.avoidSubPixelRendering) {
      this.offset.x = Math.round(this.offset.x);
      this.offset.y = Math.round(this.offset.y);
    }
    return;
  }


  /*
  Parses an offset global into an actual Math.Vector offset that fits the instance
  
  @param  {number} offset Offset global (OFFSET_TOP_LEFT, etc.)
  @return {Math.Vector} The offset vector the offset global corresponds to for the instance
   */

  Sprite.prototype.parseOffsetGlobal = function(offset) {
    var ret;
    ret = new Engine.Geometry.Vector();
    if ([Engine.Globals.OFFSET_TOP_LEFT, Engine.Globals.OFFSET_MIDDLE_LEFT, Engine.Globals.OFFSET_BOTTOM_LEFT].indexOf(offset) !== -1) {
      ret.x = 0;
    } else if ([Engine.Globals.OFFSET_TOP_CENTER, Engine.Globals.OFFSET_MIDDLE_CENTER, Engine.Globals.OFFSET_BOTTOM_CENTER].indexOf(offset) !== -1) {
      ret.x = this.bm.width / this.imageLength / 2;
    } else {
      if ([Engine.Globals.OFFSET_TOP_RIGHT, Engine.Globals.OFFSET_MIDDLE_RIGHT, Engine.Globals.OFFSET_BOTTOM_RIGHT].indexOf(offset) !== -1) {
        ret.x = this.bm.width / this.imageLength;
      }
    }
    if ([Engine.Globals.OFFSET_TOP_LEFT, Engine.Globals.OFFSET_TOP_CENTER, Engine.Globals.OFFSET_TOP_RIGHT].indexOf(offset) !== -1) {
      ret.y = 0;
    } else if ([Engine.Globals.OFFSET_MIDDLE_LEFT, Engine.Globals.OFFSET_MIDDLE_CENTER, Engine.Globals.OFFSET_MIDDLE_RIGHT].indexOf(offset) !== -1) {
      ret.y = this.bm.height / 2;
    } else {
      if ([Engine.Globals.OFFSET_BOTTOM_LEFT, Engine.Globals.OFFSET_BOTTOM_CENTER, Engine.Globals.OFFSET_BOTTOM_RIGHT].indexOf(offset) !== -1) {
        ret.y = this.bm.height;
      }
    }
    return ret;
  };


  /*
  Fetches the name of the theme which currently applies to the object.
  
  @return {string} The name of the object's current theme
   */

  Sprite.prototype.getTheme = function() {
    var parent, theme;
    parent = void 0;
    theme = void 0;
    theme = this.theme;
    parent = this;
    while (theme === void 0) {
      if (parent.theme) {
        theme = parent.theme;
      } else {
        if (parent.parent) {
          parent = parent.parent;
        } else {
          break;
        }
      }
    }
    if (theme) {
      return theme;
    } else {
      return engine.defaultTheme;
    }
  };


  /*
  Updates the source bitmap of the object to correspond to it's current theme (set with setTheme or inherited).
  Calling this function is usually not necessary since it is automatically called when setting the theme of the object itself or it's parent object.
  
  @private
   */

  Sprite.prototype.refreshSource = function() {
    var theme;
    theme = void 0;
    theme = this.getTheme();
    this.bm = engine.loader.getImage(this.source, theme);
    this.imageLength = this.bm.imageLength;
    this.imageNumber = Math.min(this.imageLength - 1, this.imageNumber);
    this.clipWidth = Math.floor(this.bm.width / this.imageLength);
    this.clipHeight = this.bm.height;
    if (this.offsetGlobal) {
      this.offset = this.offsetGlobal;
    }
    return this.bm;
  };


  /*
  Sets the bitmap-source of the object. For more information about bitmaps and themes, see themes.
  
  @param {string} source The resource string of the bitmap-source to use for the object
   */

  Sprite.prototype.setSource = function(source) {
    if (source === void 0) {
      throw new Error("Missing argument: source");
    }
    if (this.source === source) {
      return;
    }
    this.source = source;
    this.refreshSource();
  };


  /*
  Calculates the region which the sprite will fill out when redrawn.
  
  @private
  @return {Rectangle} The bounding rectangle of the sprite's redraw
   */

  Sprite.prototype.getRedrawRegion = function() {
    var box, i, parent, parents;
    box = void 0;
    parents = void 0;
    parent = void 0;
    i = void 0;
    box = new Engine.Geometry.Rectangle(-this.offset.x, -this.offset.y, this.clipWidth, this.clipHeight).getPolygon();
    parents = this.getParents();
    parents.unshift(this);
    i = 0;
    while (i < parents.length) {
      parent = parents[i];
      box.scale(parent.size * parent.widthScale, parent.size * parent.heightScale);
      box.rotate(parent.direction);
      box.move(parent.x, parent.y);
      i++;
    }
    box = box.getBoundingRectangle();
    box.x = Math.floor(box.x);
    box.y = Math.floor(box.y);
    box.width = Math.ceil(box.width + 1);
    box.height = Math.ceil(box.height + 1);
    return box;
  };

  return Sprite;

})(Engine.Views.Container);



},{"../engine":1}],35:[function(require,module,exports){
var Engine, TextBlock,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Engine = require('../engine');

module.exports = TextBlock = (function(superClass) {
  extend(TextBlock, superClass);

  Engine.Helpers.Mixin.mixin(TextBlock, Engine.Mixins.Animatable);


  /*
  The constructor for the TextBlock class.
  
  @name View.TextBlock
  @class A block of text with a limited width. If the width is reached by the text, the text will break into multiple lines.
  @augments Mixin.Animatable
  @augments View.Container
  
  @property {string} font A css string representing the font of the text block
  @property {number} width The width of the text block
  @property {number} height The height of the text block
  @property {string} alignment The text alignment of the text block, possible values are: ALIGNMENT_LEFT, ALIGNMENT_CENTER, ALIGNMENT_RIGHT
  @property {string} color A css string representing the text's color
  @property {Vector} offset The offset with which the sprite will be drawn (to its position)
  @property {number} direction The direction of the sprite (in radians)
  @property {number} size A size modifier which modifies both the width and the height of the sprite
  @property {number} widthScale A size modifier which modifies the width of the sprite
  @property {number} heightScale A size modifier which modifies the height of the object
  @property {number} opacity The opacity of the sprite
  
  @param {string} string The string to display inside the TextBlock
  @param {number} [x=0] The x-position of the object in the game arena, in pixels
  @param {number} [y=0] The y-position of the object in the game arena, in pixels
  @param {number} [width=200] The width of the text block, in pixels. When the text reaches the width, it will break into a new line
  @param {Object} [additionalProperties] An object containing additional properties to assign to the created object.
  The default is:<code>
  {
  font: 'normal 14px Verdana',
  color: '#000',
  alignment: ALIGNMENT_LEFT,
  size: 1,
  opacity: 1,
  composite: 'source-over',
  offset: new Vector(0, 0)
  }</code>
   */

  function TextBlock(string, x, y, width, additionalProperties) {
    var hidden, offset;
    if (string === void 0) {
      throw new Error("Missing argument: string");
    }
    TextBlock.__super__.constructor.call(this);
    this.renderType = "textblock";
    this.x = (x !== void 0 ? x : 0);
    this.y = (y !== void 0 ? y : 0);
    this.imageLength = 1;
    this.imageNumber = 0;
    this.clipWidth = parseInt(width, 10) || 200;
    this.lines = [];
    this.lineWidth = [];
    this.bm = document.createElement("canvas");
    this.bmCtx = this.bm.getContext("2d");
    this.bm.width = this.clipWidth;
    this.bm.height = 10;
    this.bm.spacing = 0;
    hidden = {
      string: "",
      font: "normal 14px Verdana",
      alignment: "left",
      color: "#000000",
      lineHeight: 0
    };
    Object.defineProperty(this, "string", {
      get: function() {
        return hidden.string;
      },
      set: function(value) {
        hidden.string = (typeof value === "string" ? value : value.toString());
        this.stringToLines();
        this.cacheRendering();
        engine.enableRedrawRegions && this.onAfterChange();
        return value;
      }
    });
    Object.defineProperty(this, "font", {
      get: function() {
        return hidden.font;
      },
      set: function(value) {
        if (typeof value !== "string") {
          throw new Error("font should be of type: string");
        }
        if (value === hidden.font) {
          return value;
        }
        hidden.font = value;
        this.stringToLines();
        this.cacheRendering();
        engine.enableRedrawRegions && this.onAfterChange();
        return value;
      }
    });
    Object.defineProperty(this, "alignment", {
      get: function() {
        return hidden.alignment;
      },
      set: function(value) {
        if (["left", "center", "right"].indexOf(value) === -1) {
          throw new Error("alignment should be one of the following: ALIGNMENT_LEFT, ALIGNMENT_CENTER, ALIGNMENT_RIGHT");
        }
        if (value === hidden.alignment) {
          return value;
        }
        hidden.alignment = value;
        this.cacheRendering();
        engine.enableRedrawRegions && this.onAfterChange();
        return value;
      }
    });
    Object.defineProperty(this, "color", {
      get: function() {
        return hidden.color;
      },
      set: function(value) {
        if (!/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})/.test(value)) {
          throw new Error("color should be a CSS color string");
        }
        if (value === hidden.color) {
          return value;
        }
        hidden.color = value;
        this.cacheRendering();
        engine.enableRedrawRegions && this.onAfterChange();
        return value;
      }
    });
    Object.defineProperty(this, "lineHeight", {
      get: function() {
        return hidden.lineHeight;
      },
      set: function(value) {
        hidden.lineHeight = (typeof value !== "number" ? value : parseFloat(value));
        this.calculateCanvasHeight();
        this.cacheRendering();
        engine.enableRedrawRegions && this.onAfterChange();
        return value;
      }
    });
    Object.defineProperty(this, "width", {
      get: function() {
        return Math.abs(this.clipWidth * this.size * this.widthScale);
      },
      set: function(value) {
        var sign;
        sign = (this.widthScale > 0 ? 1 : -1);
        this.widthScale = sign * Math.abs(value / (this.clipWidth * this.size));
        return value;
      }
    });
    Object.defineProperty(this, "height", {
      get: function() {
        return Math.abs(this.clipHeight * this.size * this.heightScale);
      },
      set: function(value) {
        var sign;
        sign = (this.heightScale > 0 ? 1 : -1);
        this.heightScale = sign * Math.abs(value / (this.clipHeight * this.size));
        return value;
      }
    });
    this.lineHeight = (additionalProperties && additionalProperties.lineHeight ? additionalProperties.lineHeight : this.font.match(/[0.0-9]+/) * 1.25);
    offset = Engine.Globals.OFFSET_TOP_LEFT;
    if (additionalProperties && additionalProperties.offset) {
      offset = additionalProperties.offset;
      delete additionalProperties.offset;
    }
    Engine.Helpers.Mixin["import"](this, additionalProperties);
    this.string = string;
    this.offset = offset;
    if (engine.avoidSubPixelRendering) {
      this.offset.x = Math.round(this.offset.x);
      this.offset.y = Math.round(this.offset.y);
    }
    return;
  }


  /*
  Parses an offset global into an actual Vector offset that fits the instance
  
  @param  {number} offset Offset global (OFFSET_TOP_LEFT, etc.)
  @return {Vector} The offset vector the offset global corresponds to for the instance
   */

  TextBlock.prototype.parseOffsetGlobal = function(offset) {
    var ret;
    ret = new Engine.Geometry.Vector();
    if ([Engine.Globals.OFFSET_TOP_LEFT, Engine.Globals.OFFSET_MIDDLE_LEFT, Engine.Globals.OFFSET_BOTTOM_LEFT].indexOf(offset) !== -1) {
      ret.x = 0;
    } else if ([Engine.Globals.OFFSET_TOP_CENTER, Engine.Globals.OFFSET_MIDDLE_CENTER, Engine.Globals.OFFSET_BOTTOM_CENTER].indexOf(offset) !== -1) {
      ret.x = this.clipWidth / 2;
    } else {
      if ([Engine.Globals.OFFSET_TOP_RIGHT, Engine.Globals.OFFSET_MIDDLE_RIGHT, Engine.Globals.OFFSET_BOTTOM_RIGHT].indexOf(offset) !== -1) {
        ret.x = this.clipWidth;
      }
    }
    if ([Engine.Globals.OFFSET_TOP_LEFT, Engine.Globals.OFFSET_TOP_CENTER, Engine.Globals.OFFSET_TOP_RIGHT].indexOf(offset) !== -1) {
      ret.y = 0;
    } else if ([Engine.Globals.OFFSET_MIDDLE_LEFT, Engine.Globals.OFFSET_MIDDLE_CENTER, Engine.Globals.OFFSET_MIDDLE_RIGHT].indexOf(offset) !== -1) {
      ret.y = this.clipHeight / 2;
    } else {
      if ([Engine.Globals.OFFSET_BOTTOM_LEFT, Engine.Globals.OFFSET_BOTTOM_CENTER, Engine.Globals.OFFSET_BOTTOM_RIGHT].indexOf(offset) !== -1) {
        ret.y = this.clipHeight;
      }
    }
    return ret;
  };


  /*
  Breaks the TextBlock's text string into lines.
  
  @private
   */

  TextBlock.prototype.stringToLines = function() {
    var line, lt, paragraphs, pid, wid, word, words;
    lt = void 0;
    line = void 0;
    paragraphs = void 0;
    pid = void 0;
    words = void 0;
    wid = void 0;
    word = void 0;
    lt = document.createElement("span");
    lt.style.font = this.font;
    lt.style.visibility = "hidden";
    lt.style.position = "absolute";
    document.body.appendChild(lt);
    line = 0;
    this.lines = [];
    this.lines[line] = "";
    paragraphs = this.string.split("\n");
    pid = 0;
    while (pid < paragraphs.length) {
      words = paragraphs[pid].split(" ");
      lt.innerHTML = "";
      this.lines[line] = "";
      wid = 0;
      while (wid < words.length) {
        word = words[wid];
        lt.innerHTML += word + " ";
        if (lt.offsetWidth > this.clipWidth) {
          line++;
          this.lines[line] = "";
          lt.innerHTML = "";
          lt.innerHTML += word + " ";
          this.lineWidth[line] = lt.offsetWidth;
        } else {
          this.lineWidth[line] = lt.offsetWidth;
        }
        this.lines[line] += word + " ";
        wid++;
      }
      line++;
      pid++;
    }
    this.calculateCanvasHeight();
    lt.parentNode.removeChild(lt);
  };


  /*
  Calculates and sets the height of the cache canvas based on the number of lines, the font height and the line height
   */

  TextBlock.prototype.calculateCanvasHeight = function() {
    this.bm.height = (this.lines.length - 1) * this.lineHeight + this.font.match(/[0.0-9]+/) * 1.25;
    this.clipHeight = this.bm.height;
  };


  /*
  Does the actual rendering of the text, and caches it (for huge performance gains). This function is automatically called each time a property which affects the rendering has been changed (via the right setter functions).
  
  @private
   */

  TextBlock.prototype.cacheRendering = function() {
    var i, xOffset;
    xOffset = void 0;
    i = void 0;
    this.bmCtx.clearRect(0, 0, this.bm.width, this.bm.height);
    this.bmCtx.font = this.font;
    this.bmCtx.fillStyle = this.color;
    i = 0;
    while (i < this.lines.length) {
      xOffset = 0;
      switch (this.alignment) {
        case "left":
          xOffset = 0;
          break;
        case "right":
          xOffset = this.clipWidth - this.lineWidth[i];
          break;
        case "center":
          xOffset = (this.clipWidth - this.lineWidth[i]) / 2;
      }
      if (this.lines[i]) {
        this.bmCtx.fillText(this.lines[i], xOffset, this.lineHeight * i + this.font.match(/[0.0-9]+/) * 1);
      }
      i++;
    }
    this.createHash();
  };

  TextBlock.prototype.createHash = function() {
    var self;
    self = void 0;
    self = this;
    this.bm.oldSrc = this.bm.src;
    this.bm.src = ["string", "font", "alignment", "color", "lineHeight", "clipWidth"].map(function(property) {
      return self[property];
    }).join("-|-");
  };


  /*
  Checks if the objects is visible. This function runs before each draw to ensure that it is necessary
  @return {boolean} Whether or not the object is visible (based on its size and opacity vars)
   */

  TextBlock.prototype.isVisible = function() {
    return !(this.size === 0 || this.widthScale === 0 || this.heightScale === 0 || /^\s*$/.test(this.string));
  };


  /*
  Calculates a bounding non-rotated rectangle that the text block will fill when drawn.
  
  @private
  @return {Rectangle} The bounding rectangle of the text block when drawn.
   */

  TextBlock.prototype.getRedrawRegion = function() {
    var ret;
    ret = void 0;
    ret = new Math.Rectangle(-this.offset.x, -this.offset.y, this.clipWidth, this.clipHeight);
    ret = ret.getPolygon();
    ret = ret.scale(this.size * this.widthScale, this.size * this.heightScale);
    ret = ret.rotate(this.direction);
    ret = ret.getBoundingRectangle().add(this.getRoomPosition());
    ret.x = Math.floor(ret.x - 1);
    ret.y = Math.floor(ret.y - 1);
    ret.width = Math.ceil(ret.width + 2);
    ret.height = Math.ceil(ret.height + 2);
    return ret;
  };

  return TextBlock;

})(Engine.Views.Container);



},{"../engine":1}]},{},[1]);
