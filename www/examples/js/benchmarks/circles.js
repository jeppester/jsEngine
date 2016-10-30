(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Benchmark, Main, colorNumber, startEngine,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Benchmark = require('./shared/benchmark');

startEngine = require('./shared/startEngine');

colorNumber = 0;

Main = (function(_super) {
  __extends(Main, _super);

  function Main() {
    return Main.__super__.constructor.apply(this, arguments);
  }

  Main.prototype.getColor = function() {
    var color, colors;
    colors = ['#FFF', '#BBB', '#F00', '#FF0', '#F0F', '#0F0', '#0FF', '#00F'];
    color = colors[colorNumber % colors.length];
    ++colorNumber;
    return color;
  };

  Main.prototype.getObject = function(x, y) {
    return new Engine.Views.Circle(x, y, 8, this.getColor(), this.getColor(), 4);
  };

  return Main;

})(Benchmark);

startEngine(Main);



},{"./shared/benchmark":2,"./shared/startEngine":3}],2:[function(require,module,exports){
var Benchmark;

module.exports = Benchmark = (function() {
  Benchmark.prototype.defaultObjectsCount = 8000;

  function Benchmark() {
    engine.loader.hideOverlay((function(_this) {
      return function() {
        return _this.onLoaded();
      };
    })(this));
    this.lastFive = [];
    this.posX = 0;
    this.posY = 0;
    setTimeout(((function(_this) {
      return function() {
        return _this.startTest();
      };
    })(this)), 2000);
  }

  Benchmark.prototype.getSearch = function() {
    var name, part, parts, s, search, value, _i, _len, _ref;
    s = window.location.search.replace(/^\?/, '');
    parts = s.split('&');
    search = {};
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      _ref = part.split('='), name = _ref[0], value = _ref[1];
      search[name] = value;
    }
    return search;
  };

  Benchmark.prototype.onLoaded = function() {
    return this.addObjects(this.getSearch()['objects'] || this.defaultObjectsCount);
  };

  Benchmark.prototype.startTest = function() {
    this.startFrames = engine.frames;
    return setTimeout(((function(_this) {
      return function() {
        return _this.endTest();
      };
    })(this)), 1000);
  };

  Benchmark.prototype.endTest = function() {
    var average, fps, frames, objectsCount;
    objectsCount = this.getObjectsCount();
    frames = engine.frames - this.startFrames;
    fps = engine.frames - this.startFrames;
    this.lastFive.push(frames);
    if (this.lastFive.length > 5) {
      this.lastFive.shift();
    }
    average = this.lastFive.reduce(function(a, b) {
      return a + b;
    });
    average /= this.lastFive.length;
    console.log("Objects: " + objectsCount + " - FPS: " + fps + " - Average: " + average);
    return this.startTest();
  };

  Benchmark.prototype.getObjectsCount = function() {
    return engine.currentRoom.children.length;
  };

  Benchmark.prototype.addObjects = function(count) {
    var col, cols, direction, directionInt, i, row, rows, x, xInt, y, yInt, _i, _results;
    if (count == null) {
      count = 10;
    }
    cols = rows = Math.max(Math.sqrt(count));
    col = 0;
    row = 0;
    direction = 0;
    xInt = engine.canvasResX / cols;
    yInt = engine.canvasResY / rows;
    directionInt = Math.PI / 100;
    _results = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      x = col * xInt;
      y = row * yInt;
      engine.currentRoom.addChildren(this.getObject(x, y, direction));
      direction += directionInt;
      ++row;
      if (row > rows) {
        row = 0;
        _results.push(++col);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Benchmark.prototype.getObject = function(x, y) {
    throw new Error('getObject must be overwritten');
  };

  return Benchmark;

})();



},{}],3:[function(require,module,exports){
module.exports = function(gameClass) {
  return new Engine({
    gameClass: gameClass,
    themesPath: '../assets',
    themes: ['example'],
    backgroundColor: "#000",
    disableWebGL: /canvas/.test(window.location.search),
    pauseOnBlur: false,
    canvasResX: 600,
    canvasResY: 400
  });
};



},{}]},{},[1]);