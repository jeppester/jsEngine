(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var StressTest;

StressTest = (function() {
  function StressTest() {
    engine.loader.hideOverlay((function(_this) {
      return function() {
        return _this.onLoaded();
      };
    })(this));
    this.objectView = new JSEngine.Views.Container();
    this.hudView = new JSEngine.Views.Container();
    engine.currentRoom.addChildren(this.objectView, this.hudView);
    this.fpsCounter = new JSEngine.Views.TextBlock('FPS: 0', 10, 10, 150, {
      color: '#FFF'
    });
    this.objectCounter = new JSEngine.Views.TextBlock('Objects: 0', 10, 30, 150, {
      color: '#FFF'
    });
    this.hudView.addChildren(this.fpsCounter, this.objectCounter);
    engine.currentRoom.addLoop('each20Frames', new JSEngine.CustomLoop(20));
    engine.currentRoom.loops.each20Frames.attachFunction(this, this.updateFPS);
    engine.currentRoom.loops.eachFrame.attachFunction(this, this.controls);
  }

  StressTest.prototype.onLoaded = function() {
    return this.addObjects(2000);
  };

  StressTest.prototype.updateFPS = function() {
    this.fpsCounter.string = 'FPS: ' + engine.fps;
    return this.objectCounter.string = 'Objects: ' + (Object.keys(engine.objectIndex).length - 2);
  };

  StressTest.prototype.addObjects = function(count) {
    var i, sprite, _i, _results;
    if (count == null) {
      count = 10;
    }
    _results = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      sprite = new JSEngine.Views.GameObject('Rock', Math.random() * 600, Math.random() * 400, Math.random() * Math.PI * 2, {
        speed: new JSEngine.Geometry.Vector(-5 + Math.random() * 10, -5 + Math.random() * 10)
      });
      sprite.checkBounce = function() {
        if (this.x < 0) {
          this.x = 0;
          this.speed.x = -this.speed.x;
        } else if (this.x > 600) {
          this.x = 600;
          this.speed.x = -this.speed.x;
        }
        if (this.y < 0) {
          this.y = 0;
          return this.speed.y = -this.speed.y;
        } else if (this.y > 400) {
          this.y = 400;
          return this.speed.y = -this.speed.y;
        }
      };
      engine.currentRoom.loops.eachFrame.attachFunction(sprite, sprite.checkBounce);
      _results.push(this.objectView.addChildren(sprite));
    }
    return _results;
  };

  StressTest.prototype.removeObjects = function(count) {
    var i, objects, _i, _results;
    if (count == null) {
      count = 10;
    }
    objects = this.objectView.getChildren();
    count = Math.min(count, objects.length);
    _results = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      _results.push(engine.purge(objects.shift()));
    }
    return _results;
  };

  StressTest.prototype.controls = function() {
    if (engine.keyboard.isDown(JSEngine.Globals.KEY_UP)) {
      this.addObjects();
    }
    if (engine.keyboard.isDown(JSEngine.Globals.KEY_DOWN)) {
      return this.removeObjects();
    }
  };

  return StressTest;

})();

new JSEngine({
  gameClass: StressTest,
  themes: ['Example'],
  backgroundColor: "#000",
  pauseOnBlur: false,
  canvasResX: 600,
  canvasResY: 400
});



},{}]},{},[1]);
