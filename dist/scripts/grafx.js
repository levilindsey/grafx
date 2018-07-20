(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animationJob = require('./src/animation-job');

Object.keys(_animationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animationJob[key];
    }
  });
});

var _animator = require('./src/animator');

Object.keys(_animator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animator[key];
    }
  });
});

var _frameLatencyProfiler = require('./src/frame-latency-profiler');

Object.keys(_frameLatencyProfiler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _frameLatencyProfiler[key];
    }
  });
});

var _persistentAnimationJob = require('./src/persistent-animation-job');

Object.keys(_persistentAnimationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _persistentAnimationJob[key];
    }
  });
});

var _transientAnimationJob = require('./src/transient-animation-job');

Object.keys(_transientAnimationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _transientAnimationJob[key];
    }
  });
});

},{"./src/animation-job":2,"./src/animator":3,"./src/frame-latency-profiler":4,"./src/persistent-animation-job":5,"./src/transient-animation-job":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * An AnimationJob is used with the animator controller to update and re-draw something each frame.
 *
 * @abstract
 */
var AnimationJob = function () {
  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function AnimationJob(onComplete) {
    _classCallCheck(this, AnimationJob);

    // AnimationJob is an abstract class. It should not be instantiated directly.
    if (new.target === AnimationJob) {
      throw new TypeError('Cannot construct AnimationJob instances directly');
    }

    this._startTime = 0;
    this._isComplete = true;
    this._onComplete = onComplete;
  }

  /**
   * Indicates whether this AnimationJob is complete.
   *
   * @return {boolean}
   */

  _createClass(AnimationJob, [{
    key: 'start',

    /**
     * Sets this AnimationJob as started.
     *
     * @param {DOMHighResTimeStamp} startTime
     */
    value: function start(startTime) {
      this._startTime = startTime;
      this._isComplete = false;
    }

    /**
     * Updates the animation progress of this AnimationJob to match the given time.
     *
     * This is called from the overall animation loop.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     * @abstract
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Draws the current state of this AnimationJob.
     *
     * This is called from the overall animation loop.
     *
     * @abstract
     */

  }, {
    key: 'draw',
    value: function draw() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Handles any necessary state for this AnimationJob being finished.
     *
     * @param {boolean} isCancelled
     */

  }, {
    key: 'finish',
    value: function finish(isCancelled) {
      console.log(this.constructor.name + ' ' + (isCancelled ? 'cancelled' : 'completed'));

      this._isComplete = true;

      if (this._onComplete) {
        this._onComplete();
      }
    }
  }, {
    key: 'isComplete',
    get: function get() {
      return this._isComplete;
    }
  }]);

  return AnimationJob;
}();

exports.AnimationJob = AnimationJob;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animator = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _frameLatencyProfiler = require('./frame-latency-profiler');

var _persistentAnimationJob = require('./persistent-animation-job');

var _transientAnimationJob = require('./transient-animation-job');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var _DELTA_TIME_UPPER_THRESHOLD = 200;
var _FRAME_DURATION_WARNING_THRESHOLD = 1000 / 30;
var _FRAME_LATENCY_LOG_PERIOD = 5000;
var _LATENCY_LOG_LABEL = 'Animation frame period';

/**
 * This class handles the animation loop.
 *
 * This class's responsibilities include:
 * - updating modules for the current frame,
 * - drawing renderables for the current frame,
 * - starting and stopping transient animation jobs,
 * - capping time step durations at a max threshold.
 */

var Animator = function () {
  function Animator() {
    _classCallCheck(this, Animator);

    this._jobs = [];
    this._previousTime = null;
    this._isPaused = true;
    this._requestAnimationFrameId = null;
    this._totalUnpausedRunTime = 0;
    this._lastUnpauseTime = null;
    this._latencyProfiler = new _frameLatencyProfiler.FrameLatencyProfiler(_FRAME_LATENCY_LOG_PERIOD, _FRAME_DURATION_WARNING_THRESHOLD, _LATENCY_LOG_LABEL);
  }

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */

  _createClass(Animator, [{
    key: 'startJob',
    value: function startJob(job) {
      // Is this a restart?
      if (!job.isComplete) {
        console.debug('Restarting AnimationJob: ' + job.constructor.name);

        if (job instanceof _persistentAnimationJob.PersistentAnimationJob) {
          job.reset();
        } else {
          job.finish(true);
          job.start(window.performance.now());
        }
      } else {
        console.debug('Starting AnimationJob: ' + job.constructor.name);

        job.start(this._previousTime);
        this._jobs.push(job);
      }

      this._startAnimationLoop();
    }

    /**
     * Cancels the given AnimationJob.
     *
     * @param {AnimationJob} job
     */

  }, {
    key: 'cancelJob',
    value: function cancelJob(job) {
      console.debug('Cancelling AnimationJob: ' + job.constructor.name);
      job.finish(true);
    }

    /**
     * Cancels all running AnimationJobs.
     */

  }, {
    key: 'cancelAll',
    value: function cancelAll() {
      while (this._jobs.length) {
        this.cancelJob(this._jobs[0]);
      }
    }

    /** @returns {DOMHighResTimeStamp} */

  }, {
    key: 'pause',
    value: function pause() {
      this._stopAnimationLoop();
      console.debug('Animator paused');
    }
  }, {
    key: 'unpause',
    value: function unpause() {
      this._startAnimationLoop();
      console.debug('Animator unpaused');
    }

    /**
     * This is the animation loop that drives all of the animation.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @private
     */

  }, {
    key: '_animationLoop',
    value: function _animationLoop(currentTime) {
      var _this = this;

      // When pausing and restarting, it's possible for the previous time to be slightly inconsistent
      // with the animationFrame time.
      if (currentTime < this._previousTime) {
        this._previousTime = currentTime - 1;
      }

      var deltaTime = currentTime - this._previousTime;
      this._previousTime = currentTime;

      this._latencyProfiler.recordFrameLatency(deltaTime);

      // Large delays between frames can cause lead to instability in the system, so this caps them to
      // a max threshold.
      deltaTime = deltaTime > _DELTA_TIME_UPPER_THRESHOLD ? _DELTA_TIME_UPPER_THRESHOLD : deltaTime;

      if (!this._isPaused) {
        this._requestAnimationFrameId = window.requestAnimationFrame(function (currentTime) {
          return _this._animationLoop(currentTime);
        });
        this._updateJobs(currentTime, deltaTime);
        this._drawJobs();
      }
    }

    /**
     * Updates all of the active AnimationJobs.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     * @private
     */

  }, {
    key: '_updateJobs',
    value: function _updateJobs(currentTime, deltaTime) {
      for (var i = 0, count = this._jobs.length; i < count; i++) {
        var job = this._jobs[i];

        // Remove jobs from the list after they are complete.
        if (job.isComplete) {
          this._removeJob(job, i);
          i--;
          count--;
          continue;
        }

        // Check whether the job is transient and has reached its end.
        if (job instanceof _transientAnimationJob.TransientAnimationJob && job.endTime < currentTime) {
          job.finish(false);
        } else {
          job.update(currentTime, deltaTime);
        }
      }
    }

    /**
     * Removes the given job from the collection of active, animating jobs.
     *
     * @param {AnimationJob} job
     * @param {number} [index=-1]
     * @private
     */

  }, {
    key: '_removeJob',
    value: function _removeJob(job) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      console.debug('Removing AnimationJob: ' + job.constructor.name);

      if (index >= 0) {
        this._jobs.splice(index, 1);
      } else {
        var count = this._jobs.length;
        for (index = 0; index < count; index++) {
          if (this._jobs[index] === job) {
            this._jobs.splice(index, 1);
            break;
          }
        }
      }

      // Stop the animation loop when there are no more jobs to animate.
      if (this._jobs.length === 0) {
        this._stopAnimationLoop();
      }
    }

    /**
     * Draws all of the active AnimationJobs.
     *
     * @private
     */

  }, {
    key: '_drawJobs',
    value: function _drawJobs() {
      for (var i = 0, count = this._jobs.length; i < count; i++) {
        this._jobs[i].draw();
      }
    }

    /**
     * Starts the animation loop if it is not already running.
     *
     * This method is idempotent.
     *
     * @private
     */

  }, {
    key: '_startAnimationLoop',
    value: function _startAnimationLoop() {
      var _this2 = this;

      if (this._isPaused) {
        this._lastUnpauseTime = window.performance.now();
      }
      this._isPaused = false;

      // Only actually start the loop if it isn't already running and the page has focus.
      if (!this._requestAnimationFrameId && !document.hidden) {
        this._latencyProfiler.start();
        this._previousTime = window.performance.now();
        this._requestAnimationFrameId = window.requestAnimationFrame(function (time) {
          return _this2._animationLoop(time);
        });
      }
    }

    /**
     * Stops the animation loop.
     *
     * @private
     */

  }, {
    key: '_stopAnimationLoop',
    value: function _stopAnimationLoop() {
      if (!this._isPaused) {
        this._totalUnpausedRunTime += this._timeSinceLastPaused;
      }
      this._isPaused = true;
      window.cancelAnimationFrame(this._requestAnimationFrameId);
      this._requestAnimationFrameId = null;
      this._latencyProfiler.stop();
    }

    /**
     * Creates a promise that will resolve on the next animation loop.
     *
     * @returns {Promise}
     */

  }, {
    key: 'resolveOnNextFrame',
    value: function resolveOnNextFrame() {
      return new Promise(window.requestAnimationFrame);
    }

    /**
     * Gets the total amount of time the animator has been running while not paused.
     *
     * @returns {DOMHighResTimeStamp}
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._previousTime;
    }

    /** @returns {boolean} */

  }, {
    key: 'isPaused',
    get: function get() {
      return this._isPaused;
    }
  }, {
    key: 'totalRunTime',
    get: function get() {
      return this._isPaused ? this._totalUnpausedRunTime : this._totalUnpausedRunTime + this._timeSinceLastPaused;
    }

    /**
     * @returns {DOMHighResTimeStamp}
     */

  }, {
    key: '_timeSinceLastPaused',
    get: function get() {
      return window.performance.now() - this._lastUnpauseTime;
    }
  }]);

  return Animator;
}();

var animator = new Animator();

exports.animator = animator;

/**
 * @typedef {number} DOMHighResTimeStamp A number of milliseconds, accurate to one thousandth of a
 * millisecond.
 */

},{"./frame-latency-profiler":4,"./persistent-animation-job":5,"./transient-animation-job":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class keeps track of avg/min/max frame latencies over the last logging time period and
 * periodically logs these values.
 */
var FrameLatencyProfiler = function () {
  /**
   * @param {number} logPeriod The period at which to print latency log messages. In milliseconds.
   * @param {number} latencyWarningThreshold If the average latency exceeds this threshold, then the
   * log message is shown as a warning. In milliseconds.
   * @param {string} logLabel A label to show for each latency log message.
   */
  function FrameLatencyProfiler(logPeriod, latencyWarningThreshold, logLabel) {
    _classCallCheck(this, FrameLatencyProfiler);

    this._logPeriod = logPeriod;
    this._latencyWarningThreshold = latencyWarningThreshold;
    this._logLabel = logLabel;

    this._frameCount = null;
    this._maxFrameLatency = null;
    this._minFrameLatency = null;
    this._avgFrameLatency = null;

    this._intervalId = null;
  }

  _createClass(FrameLatencyProfiler, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.stop();
      this.reset();

      this._intervalId = setInterval(function () {
        _this.logFrameLatency();
        _this.reset();
      }, this._logPeriod);
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this._intervalId);
    }
  }, {
    key: "reset",
    value: function reset() {
      this._frameCount = 0;
      this._maxFrameLatency = Number.MIN_VALUE;
      this._minFrameLatency = Number.MAX_VALUE;
      this._avgFrameLatency = 0;
    }

    /**
     * Keeps track of a running average, min value, and max value for the frame latencies.
     *
     * @param {DOMHighResTimeStamp} frameLatency
     */

  }, {
    key: "recordFrameLatency",
    value: function recordFrameLatency(frameLatency) {
      this._frameCount++;
      this._maxFrameLatency = this._maxFrameLatency < frameLatency ? frameLatency : this._maxFrameLatency;
      this._minFrameLatency = this._minFrameLatency > frameLatency ? frameLatency : this._minFrameLatency;
      this._avgFrameLatency = this._avgFrameLatency + (frameLatency - this._avgFrameLatency) / this._frameCount;
    }
  }, {
    key: "logFrameLatency",
    value: function logFrameLatency() {
      if (this._frameCount > 0) {
        var message = this._logLabel + ":  AVG=" + this._avgFrameLatency.toFixed(3) + "  " + ("(MAX=" + this._maxFrameLatency.toFixed(3) + "; MIN=" + this._minFrameLatency.toFixed(3) + ")");
        if (this._maxFrameLatency >= this._latencyWarningThreshold) {
          console.warn(message);
        } else {
          console.debug(message);
        }
      }
    }
  }]);

  return FrameLatencyProfiler;
}();

exports.FrameLatencyProfiler = FrameLatencyProfiler;

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PersistentAnimationJob = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _animationJob = require('./animation-job');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A PersistentAnimationJob recurs or has an indefinite duration.
 *
 * @abstract
 */
var PersistentAnimationJob = function (_AnimationJob) {
  _inherits(PersistentAnimationJob, _AnimationJob);

  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function PersistentAnimationJob(onComplete) {
    _classCallCheck(this, PersistentAnimationJob);

    // PersistentAnimationJob is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (PersistentAnimationJob.__proto__ || Object.getPrototypeOf(PersistentAnimationJob)).call(this, onComplete));

    if (new.target === PersistentAnimationJob) {
      throw new TypeError('Cannot construct PersistentAnimationJob instances directly');
    }
    return _this;
  }

  /**
   * @abstract
   */

  _createClass(PersistentAnimationJob, [{
    key: 'reset',
    value: function reset() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }
  }]);

  return PersistentAnimationJob;
}(_animationJob.AnimationJob);

exports.PersistentAnimationJob = PersistentAnimationJob;

},{"./animation-job":2}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransientAnimationJob = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util2 = require('./util');

var _animationJob = require('./animation-job');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A TransientAnimationJob is temporary and has a definite beginning and end.
 *
 * @abstract
 */
var TransientAnimationJob = function (_AnimationJob) {
  _inherits(TransientAnimationJob, _AnimationJob);

  /**
   * @param {number} duration
   * @param {number} delay
   * @param {Function|String} easingFunction
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function TransientAnimationJob(duration, delay, easingFunction, onComplete) {
    _classCallCheck(this, TransientAnimationJob);

    // TransientAnimationJob is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (TransientAnimationJob.__proto__ || Object.getPrototypeOf(TransientAnimationJob)).call(this, onComplete));

    if (new.target === TransientAnimationJob) {
      throw new TypeError('Cannot construct TransientAnimationJob instances directly');
    }

    _this._duration = duration;
    _this._delay = delay;
    _this._easingFunction = typeof easingFunction === 'function' ? easingFunction : _util2._util.easingFunctions[easingFunction];
    return _this;
  }

  /**
   * @returns {number}
   */

  _createClass(TransientAnimationJob, [{
    key: 'endTime',
    get: function get() {
      return this._startTime + this._duration + this._delay;
    }
  }]);

  return TransientAnimationJob;
}(_animationJob.AnimationJob);

exports.TransientAnimationJob = TransientAnimationJob;

},{"./animation-job":2,"./util":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This module defines a collection of static utility functions.
 */

// A collection of different types of easing functions.
var easingFunctions = {
  linear: function linear(t) {
    return t;
  },
  easeInQuad: function easeInQuad(t) {
    return t * t;
  },
  easeOutQuad: function easeOutQuad(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic: function easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic: function easeOutCubic(t) {
    return 1 + --t * t * t;
  },
  easeInOutCubic: function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart: function easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart: function easeOutQuart(t) {
    return 1 - --t * t * t * t;
  },
  easeInOutQuart: function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  easeInQuint: function easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function easeOutQuint(t) {
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint: function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

var _util = {
  easingFunctions: easingFunctions
};

exports._util = _util;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animationJob = require('./src/animation-job');

Object.keys(_animationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animationJob[key];
    }
  });
});

var _animator = require('./src/animator');

Object.keys(_animator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animator[key];
    }
  });
});

var _frameLatencyProfiler = require('./src/frame-latency-profiler');

Object.keys(_frameLatencyProfiler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _frameLatencyProfiler[key];
    }
  });
});

var _persistentAnimationJob = require('./src/persistent-animation-job');

Object.keys(_persistentAnimationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _persistentAnimationJob[key];
    }
  });
});

var _transientAnimationJob = require('./src/transient-animation-job');

Object.keys(_transientAnimationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _transientAnimationJob[key];
    }
  });
});

},{"./src/animation-job":9,"./src/animator":10,"./src/frame-latency-profiler":11,"./src/persistent-animation-job":12,"./src/transient-animation-job":13}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An AnimationJob is used with the animator controller to update and re-draw something each frame.
 *
 * @abstract
 */
var AnimationJob = function () {
  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function AnimationJob(onComplete) {
    _classCallCheck(this, AnimationJob);

    // AnimationJob is an abstract class. It should not be instantiated directly.
    if (new.target === AnimationJob) {
      throw new TypeError('Cannot construct AnimationJob instances directly');
    }

    this._startTime = 0;
    this._isComplete = true;
    this._onComplete = onComplete;
  }

  /**
   * Indicates whether this AnimationJob is complete.
   *
   * @return {boolean}
   */


  _createClass(AnimationJob, [{
    key: 'start',


    /**
     * Sets this AnimationJob as started.
     *
     * @param {DOMHighResTimeStamp} startTime
     */
    value: function start(startTime) {
      this._startTime = startTime;
      this._isComplete = false;
    }

    /**
     * Updates the animation progress of this AnimationJob to match the given time.
     *
     * This is called from the overall animation loop.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     * @abstract
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Draws the current state of this AnimationJob.
     *
     * This is called from the overall animation loop.
     *
     * @abstract
     */

  }, {
    key: 'draw',
    value: function draw() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Handles any necessary state for this AnimationJob being finished.
     *
     * @param {boolean} isCancelled
     */

  }, {
    key: 'finish',
    value: function finish(isCancelled) {
      console.log(this.constructor.name + ' ' + (isCancelled ? 'cancelled' : 'completed'));

      this._isComplete = true;

      if (this._onComplete) {
        this._onComplete();
      }
    }
  }, {
    key: 'isComplete',
    get: function get() {
      return this._isComplete;
    }
  }]);

  return AnimationJob;
}();

exports.AnimationJob = AnimationJob;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _frameLatencyProfiler = require('./frame-latency-profiler');

var _persistentAnimationJob = require('./persistent-animation-job');

var _transientAnimationJob = require('./transient-animation-job');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _DELTA_TIME_UPPER_THRESHOLD = 200;
var _FRAME_DURATION_WARNING_THRESHOLD = 1000 / 30;
var _FRAME_LATENCY_LOG_PERIOD = 5000;
var _LATENCY_LOG_LABEL = 'Animation frame period';

/**
 * This class handles the animation loop.
 *
 * This class's responsibilities include:
 * - updating modules for the current frame,
 * - drawing renderables for the current frame,
 * - starting and stopping transient animation jobs,
 * - capping time step durations at a max threshold.
 */

var Animator = function () {
  function Animator() {
    _classCallCheck(this, Animator);

    this._jobs = [];
    this._previousTime = null;
    this._isPaused = true;
    this._requestAnimationFrameId = null;
    this._totalUnpausedRunTime = 0;
    this._lastUnpauseTime = null;
    this._latencyProfiler = new _frameLatencyProfiler.FrameLatencyProfiler(_FRAME_LATENCY_LOG_PERIOD, _FRAME_DURATION_WARNING_THRESHOLD, _LATENCY_LOG_LABEL);
  }

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */


  _createClass(Animator, [{
    key: 'startJob',
    value: function startJob(job) {
      // Is this a restart?
      if (!job.isComplete) {
        console.debug('Restarting AnimationJob: ' + job.constructor.name);

        if (job instanceof _persistentAnimationJob.PersistentAnimationJob) {
          job.reset();
        } else {
          job.finish(true);
          job.start(window.performance.now());
        }
      } else {
        console.debug('Starting AnimationJob: ' + job.constructor.name);

        job.start(this._previousTime);
        this._jobs.push(job);
      }

      this._startAnimationLoop();
    }

    /**
     * Cancels the given AnimationJob.
     *
     * @param {AnimationJob} job
     */

  }, {
    key: 'cancelJob',
    value: function cancelJob(job) {
      console.debug('Cancelling AnimationJob: ' + job.constructor.name);
      job.finish(true);
    }

    /**
     * Cancels all running AnimationJobs.
     */

  }, {
    key: 'cancelAll',
    value: function cancelAll() {
      while (this._jobs.length) {
        this.cancelJob(this._jobs[0]);
      }
    }

    /** @returns {DOMHighResTimeStamp} */

  }, {
    key: 'pause',
    value: function pause() {
      this._stopAnimationLoop();
      console.debug('Animator paused');
    }
  }, {
    key: 'unpause',
    value: function unpause() {
      this._startAnimationLoop();
      console.debug('Animator unpaused');
    }

    /**
     * This is the animation loop that drives all of the animation.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @private
     */

  }, {
    key: '_animationLoop',
    value: function _animationLoop(currentTime) {
      var _this = this;

      // When pausing and restarting, it's possible for the previous time to be slightly inconsistent
      // with the animationFrame time.
      if (currentTime < this._previousTime) {
        this._previousTime = currentTime - 1;
      }

      var deltaTime = currentTime - this._previousTime;
      this._previousTime = currentTime;

      this._latencyProfiler.recordFrameLatency(deltaTime);

      // Large delays between frames can cause lead to instability in the system, so this caps them to
      // a max threshold.
      deltaTime = deltaTime > _DELTA_TIME_UPPER_THRESHOLD ? _DELTA_TIME_UPPER_THRESHOLD : deltaTime;

      if (!this._isPaused) {
        this._requestAnimationFrameId = window.requestAnimationFrame(function (currentTime) {
          return _this._animationLoop(currentTime);
        });
        this._updateJobs(currentTime, deltaTime);
        this._drawJobs();
      }
    }

    /**
     * Updates all of the active AnimationJobs.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     * @private
     */

  }, {
    key: '_updateJobs',
    value: function _updateJobs(currentTime, deltaTime) {
      for (var i = 0, count = this._jobs.length; i < count; i++) {
        var job = this._jobs[i];

        // Remove jobs from the list after they are complete.
        if (job.isComplete) {
          this._removeJob(job, i);
          i--;
          count--;
          continue;
        }

        // Check whether the job is transient and has reached its end.
        if (job instanceof _transientAnimationJob.TransientAnimationJob && job.endTime < currentTime) {
          job.finish(false);
        } else {
          job.update(currentTime, deltaTime);
        }
      }
    }

    /**
     * Removes the given job from the collection of active, animating jobs.
     *
     * @param {AnimationJob} job
     * @param {number} [index=-1]
     * @private
     */

  }, {
    key: '_removeJob',
    value: function _removeJob(job) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      console.debug('Removing AnimationJob: ' + job.constructor.name);

      if (index >= 0) {
        this._jobs.splice(index, 1);
      } else {
        var count = this._jobs.length;
        for (index = 0; index < count; index++) {
          if (this._jobs[index] === job) {
            this._jobs.splice(index, 1);
            break;
          }
        }
      }

      // Stop the animation loop when there are no more jobs to animate.
      if (this._jobs.length === 0) {
        this._stopAnimationLoop();
      }
    }

    /**
     * Draws all of the active AnimationJobs.
     *
     * @private
     */

  }, {
    key: '_drawJobs',
    value: function _drawJobs() {
      for (var i = 0, count = this._jobs.length; i < count; i++) {
        this._jobs[i].draw();
      }
    }

    /**
     * Starts the animation loop if it is not already running.
     *
     * This method is idempotent.
     *
     * @private
     */

  }, {
    key: '_startAnimationLoop',
    value: function _startAnimationLoop() {
      var _this2 = this;

      if (this._isPaused) {
        this._lastUnpauseTime = window.performance.now();
      }
      this._isPaused = false;

      // Only actually start the loop if it isn't already running and the page has focus.
      if (!this._requestAnimationFrameId && !document.hidden) {
        this._latencyProfiler.start();
        this._previousTime = window.performance.now();
        this._requestAnimationFrameId = window.requestAnimationFrame(function (time) {
          return _this2._animationLoop(time);
        });
      }
    }

    /**
     * Stops the animation loop.
     *
     * @private
     */

  }, {
    key: '_stopAnimationLoop',
    value: function _stopAnimationLoop() {
      if (!this._isPaused) {
        this._totalUnpausedRunTime += this._timeSinceLastPaused;
      }
      this._isPaused = true;
      window.cancelAnimationFrame(this._requestAnimationFrameId);
      this._requestAnimationFrameId = null;
      this._latencyProfiler.stop();
    }

    /**
     * Creates a promise that will resolve on the next animation loop.
     *
     * @returns {Promise}
     */

  }, {
    key: 'resolveOnNextFrame',
    value: function resolveOnNextFrame() {
      return new Promise(window.requestAnimationFrame);
    }

    /**
     * Gets the total amount of time the animator has been running while not paused.
     *
     * @returns {DOMHighResTimeStamp}
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._previousTime;
    }

    /** @returns {boolean} */

  }, {
    key: 'isPaused',
    get: function get() {
      return this._isPaused;
    }
  }, {
    key: 'totalRunTime',
    get: function get() {
      return this._isPaused ? this._totalUnpausedRunTime : this._totalUnpausedRunTime + this._timeSinceLastPaused;
    }

    /**
     * @returns {DOMHighResTimeStamp}
     */

  }, {
    key: '_timeSinceLastPaused',
    get: function get() {
      return window.performance.now() - this._lastUnpauseTime;
    }
  }]);

  return Animator;
}();

var animator = new Animator();

exports.animator = animator;

/**
 * @typedef {number} DOMHighResTimeStamp A number of milliseconds, accurate to one thousandth of a
 * millisecond.
 */

},{"./frame-latency-profiler":11,"./persistent-animation-job":12,"./transient-animation-job":13}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class keeps track of avg/min/max frame latencies over the last logging time period and
 * periodically logs these values.
 */
var FrameLatencyProfiler = function () {
  /**
   * @param {number} logPeriod The period at which to print latency log messages. In milliseconds.
   * @param {number} latencyWarningThreshold If the average latency exceeds this threshold, then the
   * log message is shown as a warning. In milliseconds.
   * @param {string} logLabel A label to show for each latency log message.
   */
  function FrameLatencyProfiler(logPeriod, latencyWarningThreshold, logLabel) {
    _classCallCheck(this, FrameLatencyProfiler);

    this._logPeriod = logPeriod;
    this._latencyWarningThreshold = latencyWarningThreshold;
    this._logLabel = logLabel;

    this._frameCount = null;
    this._maxFrameLatency = null;
    this._minFrameLatency = null;
    this._avgFrameLatency = null;

    this._intervalId = null;
  }

  _createClass(FrameLatencyProfiler, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.stop();
      this.reset();

      this._intervalId = setInterval(function () {
        _this.logFrameLatency();
        _this.reset();
      }, this._logPeriod);
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this._intervalId);
    }
  }, {
    key: "reset",
    value: function reset() {
      this._frameCount = 0;
      this._maxFrameLatency = Number.MIN_VALUE;
      this._minFrameLatency = Number.MAX_VALUE;
      this._avgFrameLatency = 0;
    }

    /**
     * Keeps track of a running average, min value, and max value for the frame latencies.
     *
     * @param {DOMHighResTimeStamp} frameLatency
     */

  }, {
    key: "recordFrameLatency",
    value: function recordFrameLatency(frameLatency) {
      this._frameCount++;
      this._maxFrameLatency = this._maxFrameLatency < frameLatency ? frameLatency : this._maxFrameLatency;
      this._minFrameLatency = this._minFrameLatency > frameLatency ? frameLatency : this._minFrameLatency;
      this._avgFrameLatency = this._avgFrameLatency + (frameLatency - this._avgFrameLatency) / this._frameCount;
    }
  }, {
    key: "logFrameLatency",
    value: function logFrameLatency() {
      if (this._frameCount > 0) {
        var message = this._logLabel + ":  AVG=" + this._avgFrameLatency.toFixed(3) + "  " + ("(MAX=" + this._maxFrameLatency.toFixed(3) + "; MIN=" + this._minFrameLatency.toFixed(3) + ")");
        if (this._maxFrameLatency >= this._latencyWarningThreshold) {
          console.warn(message);
        } else {
          console.debug(message);
        }
      }
    }
  }]);

  return FrameLatencyProfiler;
}();

exports.FrameLatencyProfiler = FrameLatencyProfiler;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PersistentAnimationJob = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _animationJob = require('./animation-job');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A PersistentAnimationJob recurs or has an indefinite duration.
 *
 * @abstract
 */
var PersistentAnimationJob = function (_AnimationJob) {
  _inherits(PersistentAnimationJob, _AnimationJob);

  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function PersistentAnimationJob(onComplete) {
    _classCallCheck(this, PersistentAnimationJob);

    // PersistentAnimationJob is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (PersistentAnimationJob.__proto__ || Object.getPrototypeOf(PersistentAnimationJob)).call(this, onComplete));

    if (new.target === PersistentAnimationJob) {
      throw new TypeError('Cannot construct PersistentAnimationJob instances directly');
    }
    return _this;
  }

  /**
   * @abstract
   */


  _createClass(PersistentAnimationJob, [{
    key: 'reset',
    value: function reset() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }
  }]);

  return PersistentAnimationJob;
}(_animationJob.AnimationJob);

exports.PersistentAnimationJob = PersistentAnimationJob;

},{"./animation-job":9}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransientAnimationJob = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util2 = require('./util');

var _animationJob = require('./animation-job');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A TransientAnimationJob is temporary and has a definite beginning and end.
 *
 * @abstract
 */
var TransientAnimationJob = function (_AnimationJob) {
  _inherits(TransientAnimationJob, _AnimationJob);

  /**
   * @param {number} duration
   * @param {number} delay
   * @param {Function|String} easingFunction
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function TransientAnimationJob(duration, delay, easingFunction, onComplete) {
    _classCallCheck(this, TransientAnimationJob);

    // TransientAnimationJob is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (TransientAnimationJob.__proto__ || Object.getPrototypeOf(TransientAnimationJob)).call(this, onComplete));

    if (new.target === TransientAnimationJob) {
      throw new TypeError('Cannot construct TransientAnimationJob instances directly');
    }

    _this._duration = duration;
    _this._delay = delay;
    _this._easingFunction = typeof easingFunction === 'function' ? easingFunction : _util2._util.easingFunctions[easingFunction];
    return _this;
  }

  /**
   * @returns {number}
   */


  _createClass(TransientAnimationJob, [{
    key: 'endTime',
    get: function get() {
      return this._startTime + this._duration + this._delay;
    }
  }]);

  return TransientAnimationJob;
}(_animationJob.AnimationJob);

exports.TransientAnimationJob = TransientAnimationJob;

},{"./animation-job":9,"./util":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This module defines a collection of static utility functions.
 */

// A collection of different types of easing functions.
var easingFunctions = {
  linear: function linear(t) {
    return t;
  },
  easeInQuad: function easeInQuad(t) {
    return t * t;
  },
  easeOutQuad: function easeOutQuad(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic: function easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic: function easeOutCubic(t) {
    return 1 + --t * t * t;
  },
  easeInOutCubic: function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart: function easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart: function easeOutQuart(t) {
    return 1 - --t * t * t * t;
  },
  easeInOutQuart: function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  easeInQuint: function easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function easeOutQuint(t) {
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint: function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

var _util = {
  easingFunctions: easingFunctions
};

exports._util = _util;

},{}],15:[function(require,module,exports){
"use strict";

module.exports = {}; // FIXME: Point this to dist

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camera = require('./src/camera');

Object.keys(_camera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _camera[key];
    }
  });
});

var _firstPersonCamera = require('./src/first-person-camera');

Object.keys(_firstPersonCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _firstPersonCamera[key];
    }
  });
});

var _fixedCamera = require('./src/fixed-camera');

Object.keys(_fixedCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fixedCamera[key];
    }
  });
});

var _fixedFollowCamera = require('./src/fixed-follow-camera');

Object.keys(_fixedFollowCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fixedFollowCamera[key];
    }
  });
});

var _followCamera = require('./src/follow-camera');

Object.keys(_followCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _followCamera[key];
    }
  });
});

var _thirdPersonCamera = require('./src/third-person-camera');

Object.keys(_thirdPersonCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _thirdPersonCamera[key];
    }
  });
});

var _overheadCamera = require('./src/overhead-camera');

Object.keys(_overheadCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _overheadCamera[key];
    }
  });
});

},{"./src/camera":17,"./src/first-person-camera":18,"./src/fixed-camera":19,"./src/fixed-follow-camera":20,"./src/follow-camera":21,"./src/overhead-camera":22,"./src/third-person-camera":23}],17:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Camera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _lslAnimatex = require('lsl-animatex');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

// TODO: Make the rotation quaternion based with 6DoF.

// TODO: Add support for scripting the camera to follow a curve:
// (https://msdn.microsoft.com/en-us/library/bb203908(v=xnagamestudio.31).aspx)

/**
 * This class defines common camera logic.
 *
 * @abstract
 */
var Camera = function (_PersistentAnimationJ) {
  _inherits(Camera, _PersistentAnimationJ);

  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  function Camera(cameraParams, oldCamera) {
    _classCallCheck(this, Camera);

    // Camera is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

    if (new.target === Camera) {
      throw new TypeError('Cannot construct Camera instances directly');
    }

    _this._cameraParams = cameraParams;
    _this._fovY = null;
    _this._aspectRatio = null;
    _this._zNear = null;
    _this._zFar = null;
    _this._position = vec3.create();
    _this._orientation = quat.create(); // TODO: Use this.
    _this._viewMatrix = mat4.create();
    _this._projectionMatrix = mat4.create();
    _this._viewProjectionMatrix = mat4.create();

    _this._matchOldCamera(oldCamera);
    return _this;
  }

  _createClass(Camera, [{
    key: 'reset',
    value: function reset() {
      this._setPerspective(this._cameraParams.fovY, this._cameraParams.defaultAspectRatio, this._cameraParams.zNear, this._cameraParams.zFar);
    }

    // TODO: Call this after adding support for dynamically switching cameras.

  }, {
    key: 'destroy',
    value: function destroy() {}

    /**
     * Set this camera's orientation and position.
     *
     * @param {vec3} eye The camera position.
     * @param {vec3} target The focal point.
     * @param {vec3} up The local up direction.
     * @param {vec3} viewDirection The (normalized) direction the camera is looking.
     * @protected
     */

  }, {
    key: '_setPositionAndLookAt',
    value: function _setPositionAndLookAt(eye, target, up, viewDirection) {
      vec3.copy(this._position, eye);
      this._setLookAtFromCurrentPosition(target, up, viewDirection);
    }

    /**
     * Set this camera's orientation, but do not change its position.
     *
     * @param {vec3} target The focal point.
     * @param {vec3} up The local up direction.
     * @param {vec3} viewDirection The (normalized) direction the camera is looking.
     * @protected
     */

  }, {
    key: '_setLookAtFromCurrentPosition',
    value: function _setLookAtFromCurrentPosition(target, up, viewDirection) {
      mat4.lookAt(this._viewMatrix, this._position, target, up);
      quat.rotationTo(this._orientation, this._cameraParams._defaultLookAtDirection, viewDirection); // TODO: Check this; might need to swap arguments.
      this._updateViewProjectionMatrix();
    }

    /**
     * Translate this camera by the given amount from its current position.
     *
     * @param {vec3} translation
     * @protected
     */

  }, {
    key: '_translate',
    value: function _translate(translation) {
      vec3.add(this._position, this._position, translation);
    }

    /**
     * Rotate this camera by the given amount from its current orientation.
     *
     * @param {quat} rotation
     * @protected
     */

  }, {
    key: '_rotate',
    value: function _rotate(rotation) {}
    // TODO


    /**
     * @param {number} fovY In radians.
     * @param {number} aspectRatio Width / height.
     * @param {number} zNear
     * @param {number} zFar
     * @protected
     */

  }, {
    key: '_setPerspective',
    value: function _setPerspective(fovY, aspectRatio, zNear, zFar) {
      this._fovY = fovY;
      this._aspectRatio = aspectRatio;
      this._zNear = zNear;
      this._zFar = zFar;
      this._updateProjectionMatrix();
    }

    /**
     * Re-calculates the view-projection matrix. This should be called any time either the view or
     * projection matrices is updated.
     *
     * @protected
     */

  }, {
    key: '_updateProjectionMatrix',
    value: function _updateProjectionMatrix() {
      mat4.perspective(this._projectionMatrix, this._fovY, this._aspectRatio, this._zNear, this._zFar);
      this._updateViewProjectionMatrix();
    }

    /**
     * Re-calculates the view-projection matrix. This should be called any time either the view or
     * projection matrices is updated.
     *
     * @protected
     */

  }, {
    key: '_updateViewProjectionMatrix',
    value: function _updateViewProjectionMatrix() {
      mat4.multiply(this._viewProjectionMatrix, this._projectionMatrix, this._viewMatrix);
    }

    /**
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     * @abstract
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }
  }, {
    key: 'draw',
    value: function draw() {}

    /**
     * @param {number} fovY The vertical field of view, in radians.
     * @protected
     */

  }, {
    key: '_matchOldCamera',

    /**
     * Update this camera's state to match the given old camera.
     *
     * @param {Camera} oldCamera
     * @protected
     */
    value: function _matchOldCamera(oldCamera) {
      if (!oldCamera) {
        return;
      }
      this._fovY = oldCamera._fovY;
      this._aspectRatio = oldCamera._aspectRatio;
      this._zNear = oldCamera._zNear;
      this._zFar = oldCamera._zFar;
      vec3.copy(this._position, oldCamera._position);
      vec3.copy(this._orientation, oldCamera._orientation);
      mat4.copy(this._viewMatrix, oldCamera._viewMatrix);
      mat4.copy(this._projectionMatrix, oldCamera._projectionMatrix);
      mat4.copy(this._viewProjectionMatrix, oldCamera._viewProjectionMatrix);
    }
  }, {
    key: 'fov',
    set: function set(fovY) {
      this._fovY = fovY;
      this._updateProjectionMatrix();
    }

    /**
     * @param {number} aspectRatio Width / height.
     */

  }, {
    key: 'aspectRatio',
    set: function set(aspectRatio) {
      this._setPerspective(this._cameraParams.fovY, aspectRatio, this._cameraParams.zNear, this._cameraParams.zFar);
    }

    /** @returns {vec3} */

  }, {
    key: 'position',
    get: function get() {
      return this._position;
    }
    /** @returns {quat} */

  }, {
    key: 'orientation',
    get: function get() {
      return this._orientation;
    }
    /** @returns {mat4} */

  }, {
    key: 'viewMatrix',
    get: function get() {
      return this._viewMatrix;
    }
    /** @returns {mat4} */

  }, {
    key: 'projectionMatrix',
    get: function get() {
      return this._projectionMatrix;
    }
    /** @returns {mat4} */

  }, {
    key: 'viewProjectionMatrix',
    get: function get() {
      // TODO: Stop using the above two getters and use this instead?
      return this._viewProjectionMatrix;
    }
  }]);

  return Camera;
}(_lslAnimatex.PersistentAnimationJob);

exports.Camera = Camera;

/**
 * @typedef {Function} CameraConfig
 * @property {number} fovY
 * @property {number} zNear
 * @property {number} zFar
 * @property {number} defaultAspectRatio
 * @property {vec3} _defaultLookAtDirection
 */

/**
 * @typedef {Object} FollowCameraConfig
 * @property {number} springCoefficient
 * @property {number} dampingCoefficient
 * @property {number} intendedDistanceFromTarget
 * @property {number} intendedRotationAngleFromTarget
 * @property {vec3} intendedRotationAxisFromTarget
 * @property {vec3} _intendedTranslationFromTarget
 */

/**
 * @typedef {Object} FirstPersonCameraConfig
 * @property {vec3} intendedDisplacementFromTarget
 * @property {vec3} viewDirection
 * @property {number} targetDistance
 */

/**
 * @typedef {Object} FixedCameraConfig
 * @property {vec3} position
 * @property {vec3} viewDirection
 * @property {vec3} _up
 */

},{"lsl-animatex":8}],18:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirstPersonCamera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _camera = require('./camera');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines a first-person camera.
 *
 * A first-person camera is positioned at a character and moves and rotates with the character.
 */
var FirstPersonCamera = function (_Camera) {
  _inherits(FirstPersonCamera, _Camera);

  /**
   * @param {CameraTarget} cameraTarget
   * @param {FirstPersonCameraConfig} firstPersonCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  function FirstPersonCamera(cameraTarget, firstPersonCameraParams, cameraParams, oldCamera) {
    _classCallCheck(this, FirstPersonCamera);

    var _this = _possibleConstructorReturn(this, (FirstPersonCamera.__proto__ || Object.getPrototypeOf(FirstPersonCamera)).call(this, cameraParams, oldCamera));

    _this._cameraTarget = cameraTarget;
    _this._firstPersonCameraParams = firstPersonCameraParams;
    _this._cameraTarget = cameraTarget;
    return _this;
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */

  _createClass(FirstPersonCamera, [{
    key: 'update',
    value: function update(currentTime, deltaTime) {
      this._updatePosition();
      this._updateOrientation();
    }

    /**
     * @private
     */

  }, {
    key: '_updatePosition',
    value: function _updatePosition() {
      var intendedPosition = this._getIntendedPosition();
      vec3.copy(this._position, intendedPosition);
    }

    /**
     * Update the camera's orientation using the "look at" method according to its position and the
     * position of its target.
     *
     * @protected
     */

  }, {
    key: '_updateOrientation',
    value: function _updateOrientation() {
      // Get the view direction, and transform it to align with the target's orientation.
      var viewDirection = vec3.create();
      vec3.copy(viewDirection, this._firstPersonCameraParams.viewDirection);
      vec3.transformQuat(viewDirection, viewDirection, this._cameraTarget.orientation);

      var target = vec3.create();
      vec3.scaleAndAdd(target, this._position, viewDirection, this._firstPersonCameraParams.targetDistance);

      // Initialize "up" as the world z-axis.
      var up = vec3.fromValues(0, 1, 0);

      // Transform "up" to align with the camera target's local z-axis.
      vec3.transformQuat(up, up, this._cameraTarget.orientation);

      var right = vec3.create();
      vec3.cross(right, viewDirection, up);

      // Transform "up" to align with the camera's local z-axis.
      vec3.cross(up, right, viewDirection);

      this._setPositionAndLookAt(this._position, target, up, viewDirection);
    }

    /**
     * The intended position for this camera to be in according to the position and orientation of the
     * camera target.
     *
     * @returns {vec3}
     * @protected
     * @abstract
     */

  }, {
    key: '_getIntendedPosition',
    value: function _getIntendedPosition() {
      var intendedPosition = vec3.create();
      vec3.transformMat4(intendedPosition, this._firstPersonCameraParams.intendedDisplacementFromTarget, this._cameraTarget.worldTransform);
      return intendedPosition;
    }
  }]);

  return FirstPersonCamera;
}(_camera.Camera);

exports.FirstPersonCamera = FirstPersonCamera;

},{"./camera":17}],19:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FixedCamera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;if (getter === undefined) {
      return undefined;
    }return getter.call(receiver);
  }
};

var _camera = require('./camera');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines a fixed camera.
 *
 * A fixed camera's position and orientation are updated manually and remain fixed until a later
 * update.
 */
var FixedCamera = function (_Camera) {
  _inherits(FixedCamera, _Camera);

  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {FixedCameraConfig} fixedCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  function FixedCamera(fixedCameraParams, cameraParams, oldCamera) {
    _classCallCheck(this, FixedCamera);

    var _this = _possibleConstructorReturn(this, (FixedCamera.__proto__ || Object.getPrototypeOf(FixedCamera)).call(this, cameraParams, oldCamera));

    _this._position = fixedCameraParams.position;
    _this._viewDirection = fixedCameraParams.viewDirection;
    _this._up = fixedCameraParams._up;
    _this.__target = vec3.create();
    return _this;
  }

  _createClass(FixedCamera, [{
    key: 'reset',
    value: function reset() {
      _get(FixedCamera.prototype.__proto__ || Object.getPrototypeOf(FixedCamera.prototype), 'reset', this).call(this);
      this._update();
    }

    /**
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {}
  }, {
    key: '_update',
    value: function _update() {
      vec3.normalize(this._viewDirection, this._viewDirection);
      vec3.normalize(this._up, this._up);

      // Transform "up" to align with the camera's local z-axis.
      var right = vec3.create();
      vec3.cross(right, this._viewDirection, this._up);
      vec3.cross(this._up, right, this._viewDirection);

      this._setPositionAndLookAt(this._position, this._target, this._up, this._viewDirection);
    }

    /** @param {vec3} newDirection */

  }, {
    key: '_matchOldCamera',

    /**
     * @param {Camera} oldCamera
     * @protected
     */
    value: function _matchOldCamera(oldCamera) {
      _get(FixedCamera.prototype.__proto__ || Object.getPrototypeOf(FixedCamera.prototype), '_matchOldCamera', this).call(this, oldCamera);
      if (oldCamera instanceof FixedCamera) {
        vec3.copy(this._viewDirection, oldCamera._viewDirection);
        vec3.copy(this._up, oldCamera._up);
      }
    }
  }, {
    key: 'viewDirection',
    set: function set(newDirection) {
      vec3.copy(this._viewDirection, newDirection);
      this._update();
    }

    /** @param {vec3} newUp */

    , /** @returns {vec3} */
    get: function get() {
      return this._viewDirection;
    }
    /** @returns {vec3} */

  }, {
    key: 'up',
    set: function set(newUp) {
      vec3.copy(this._up, newUp);
      this._update();
    }

    /** @param {vec3} newPosition */

    , get: function get() {
      return this._up;
    }
    /**
     * @returns {vec3}
     * @private
     */

  }, {
    key: 'position',
    set: function set(newPosition) {
      vec3.copy(this._position, newPosition);
      this._update();
    }

    /** @returns {vec3} */
    // TODO: Look into whatever bug prevents the parent-class getter from working.

    , get: function get() {
      return this._position;
    }
  }, {
    key: '_target',
    get: function get() {
      return vec3.add(this.__target, this._position, this._viewDirection);
    }
  }]);

  return FixedCamera;
}(_camera.Camera);

exports.FixedCamera = FixedCamera;

},{"./camera":17}],20:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FixedFollowCamera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _followCamera = require('./follow-camera');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines a fixed-offset follow camera.
 *
 * This camera is positioned at a relative, fixed distance and rotation from the observed target
 * and follows the target's position and orientation at this fixed distance.
 *
 * A follow camera rotates in all three dimensions; it does not have a fixed roll.
 */
var FixedFollowCamera = function (_FollowCamera) {
  _inherits(FixedFollowCamera, _FollowCamera);

  function FixedFollowCamera() {
    _classCallCheck(this, FixedFollowCamera);

    return _possibleConstructorReturn(this, (FixedFollowCamera.__proto__ || Object.getPrototypeOf(FixedFollowCamera)).apply(this, arguments));
  }

  _createClass(FixedFollowCamera, [{
    key: 'update',

    /**
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */
    value: function update(currentTime, deltaTime) {
      this._updatePosition();
      this._updateOrientation();
    }

    /**
     * @private
     */

  }, {
    key: '_updatePosition',
    value: function _updatePosition() {
      var intendedPosition = this._getIntendedPosition();
      vec3.copy(this._position, intendedPosition);
    }
  }]);

  return FixedFollowCamera;
}(_followCamera.FollowCamera);

exports.FixedFollowCamera = FixedFollowCamera;

},{"./follow-camera":21}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FollowCamera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _thirdPersonCamera = require('./third-person-camera');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines an abstract follow camera.
 *
 * This is a third-person type of camera whose roll always matches that of the target.
 */
var FollowCamera = function (_ThirdPersonCamera) {
  _inherits(FollowCamera, _ThirdPersonCamera);

  function FollowCamera() {
    _classCallCheck(this, FollowCamera);

    return _possibleConstructorReturn(this, (FollowCamera.__proto__ || Object.getPrototypeOf(FollowCamera)).apply(this, arguments));
  }

  _createClass(FollowCamera, [{
    key: '_updateOrientation',

    /**
     * Update the camera's orientation using the "look at" method according to its position and the
     * position of its target.
     *
     * @protected
     */
    value: function _updateOrientation() {
      var target = this._cameraTarget.position;

      var viewDirection = vec3.create();
      vec3.subtract(viewDirection, target, this._position);
      vec3.normalize(viewDirection, viewDirection);

      // Initialize "up" as the world z-axis.
      var up = vec3.fromValues(0, 1, 0);

      // Transform "up" to align with the camera target's local z-axis.
      vec3.transformQuat(up, up, this._cameraTarget.orientation);

      var right = vec3.create();
      vec3.cross(right, viewDirection, up);

      // Transform "up" to align with the camera's local z-axis.
      vec3.cross(up, right, viewDirection);

      this._setPositionAndLookAt(this._position, target, up, viewDirection);
    }
  }]);

  return FollowCamera;
}(_thirdPersonCamera.ThirdPersonCamera);

exports.FollowCamera = FollowCamera;

},{"./third-person-camera":23}],22:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OverheadCamera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;if (getter === undefined) {
      return undefined;
    }return getter.call(receiver);
  }
};

var _thirdPersonCamera = require('./third-person-camera');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines an overhead camera.
 *
 * An overhead camera sits above the observed character and moves relative to the character without
 * rotating.
 *
 * An overhead camera's rotation with the character includes only yaw; it has a fixed pitch and
 * roll.
 */
var OverheadCamera = function (_ThirdPersonCamera) {
  _inherits(OverheadCamera, _ThirdPersonCamera);

  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {CameraTarget} cameraTarget
   * @param {FollowCameraConfig} followCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  function OverheadCamera(cameraTarget, followCameraParams, cameraParams, oldCamera) {
    _classCallCheck(this, OverheadCamera);

    var _this = _possibleConstructorReturn(this, (OverheadCamera.__proto__ || Object.getPrototypeOf(OverheadCamera)).call(this, cameraTarget, followCameraParams, cameraParams, oldCamera));

    _this.reset();
    return _this;
  }

  _createClass(OverheadCamera, [{
    key: 'reset',
    value: function reset() {
      _get(OverheadCamera.prototype.__proto__ || Object.getPrototypeOf(OverheadCamera.prototype), 'reset', this).call(this);
    }

    // TODO: Implement this!

  }]);

  return OverheadCamera;
}(_thirdPersonCamera.ThirdPersonCamera);

exports.OverheadCamera = OverheadCamera;

},{"./third-person-camera":23}],23:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThirdPersonCamera = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _camera = require('./camera');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines an abstract third-person camera.
 *
 * A third-person camera follows a target from a distance.
 *
 * @abstract
 */
var ThirdPersonCamera = function (_Camera) {
  _inherits(ThirdPersonCamera, _Camera);

  /**
   * If oldCamera is given, then the state of the new camera will be initialized to match that of
   * the old camera. This enables a smooth transition when changing cameras.
   *
   * @param {CameraTarget} cameraTarget
   * @param {FollowCameraConfig} followCameraParams
   * @param {CameraConfig} cameraParams
   * @param {Camera} [oldCamera]
   */
  function ThirdPersonCamera(cameraTarget, followCameraParams, cameraParams, oldCamera) {
    _classCallCheck(this, ThirdPersonCamera);

    // ThirdPersonCamera is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (ThirdPersonCamera.__proto__ || Object.getPrototypeOf(ThirdPersonCamera)).call(this, cameraParams, oldCamera));

    if (new.target === ThirdPersonCamera) {
      throw new TypeError('Cannot construct ThirdPersonCamera instances directly');
    }

    _this._followCameraParams = followCameraParams;
    _this._cameraTarget = cameraTarget;
    return _this;
  }

  /**
   * The intended position for this camera to be in according to the position and orientation of the
   * camera target.
   *
   * @returns {vec3}
   * @protected
   * @abstract
   */

  _createClass(ThirdPersonCamera, [{
    key: '_getIntendedPosition',
    value: function _getIntendedPosition() {
      var intendedPosition = vec3.create();
      vec3.transformMat4(intendedPosition, this._followCameraParams._intendedTranslationFromTarget, this._cameraTarget.worldTransform);
      return intendedPosition;
    }

    /** @param {CameraTarget} cameraTarget */

  }, {
    key: 'cameraTarget',
    set: function set(cameraTarget) {
      this._cameraTarget = cameraTarget;
    }
  }]);

  return ThirdPersonCamera;
}(_camera.Camera);

exports.ThirdPersonCamera = ThirdPersonCamera;

/**
 * @typedef {Object} CameraTarget
 * @property {vec3} position In world coordinates.
 * @property {quat} orientation Relative to the world axes.
 * @property {mat4} worldTransform The model transform matrix, in world coordinates.
 */

},{"./camera":17}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cameras = require('./cameras');

Object.keys(_cameras).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cameras[key];
    }
  });
});

var _models = require('./models');

Object.keys(_models).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _models[key];
    }
  });
});

var _programWrapper = require('./program-wrapper');

Object.keys(_programWrapper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _programWrapper[key];
    }
  });
});

var _renderableShapes = require('./renderable-shapes');

Object.keys(_renderableShapes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _renderableShapes[key];
    }
  });
});

var _util = require('./util');

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

var _grafxController = require('./src/grafx-controller');

Object.keys(_grafxController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _grafxController[key];
    }
  });
});

var _light = require('./src/light');

Object.keys(_light).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _light[key];
    }
  });
});

var _scene = require('./src/scene');

Object.keys(_scene).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _scene[key];
    }
  });
});

},{"./cameras":16,"./models":25,"./program-wrapper":32,"./renderable-shapes":38,"./src/grafx-controller":47,"./src/light":48,"./src/scene":49,"./util":50}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defaultModel = require('./src/default-model');

Object.keys(_defaultModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _defaultModel[key];
    }
  });
});

var _invisibleModelController = require('./src/invisible-model-controller');

Object.keys(_invisibleModelController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _invisibleModelController[key];
    }
  });
});

var _model = require('./src/model');

Object.keys(_model).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _model[key];
    }
  });
});

var _modelController = require('./src/model-controller');

Object.keys(_modelController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _modelController[key];
    }
  });
});

var _modelGroupController = require('./src/model-group-controller');

Object.keys(_modelGroupController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _modelGroupController[key];
    }
  });
});

var _standardModelController = require('./src/standard-model-controller');

Object.keys(_standardModelController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _standardModelController[key];
    }
  });
});

},{"./src/default-model":26,"./src/invisible-model-controller":27,"./src/model":30,"./src/model-controller":28,"./src/model-group-controller":29,"./src/standard-model-controller":31}],26:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultModel = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util = require('../../util');

var _model = require('./model');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines a default implementation of the rigid model.
 *
 * This implementation accepts a RenderableShape and applies standard OpenGL binding logic on top
 * of it.
 */
var DefaultModel = function (_Model) {
  _inherits(DefaultModel, _Model);

  /**
   * @param {WebGLRenderingContext} gl
   * @param {RenderableShape} shapeConfig
   */
  function DefaultModel(gl, shapeConfig) {
    _classCallCheck(this, DefaultModel);

    var _this = _possibleConstructorReturn(this, (DefaultModel.__proto__ || Object.getPrototypeOf(DefaultModel)).call(this, gl));

    _this._shapeConfig = shapeConfig;
    _this._initializeBuffers();
    _this._initializeConfigs();
    return _this;
  }

  _createClass(DefaultModel, [{
    key: '_initializeBuffers',
    value: function _initializeBuffers() {
      // Create, bind, and move data into buffers for the vertex positions, normals, texture
      // coordinates, and element array.
      this._vertexPositionsBuffer = (0, _util.createBufferFromData)(this._gl, this._shapeConfig.vertexPositions);
      this._vertexNormalsBuffer = (0, _util.createBufferFromData)(this._gl, this._shapeConfig.vertexNormals);
      this._textureCoordinatesBuffer = (0, _util.createBufferFromData)(this._gl, this._shapeConfig.textureCoordinates);
      if (this._shapeConfig.vertexIndices) {
        this._vertexIndicesBuffer = (0, _util.createBufferFromData)(this._gl, this._shapeConfig.vertexIndices, this._gl.ELEMENT_ARRAY_BUFFER);
      }
    }
  }, {
    key: '_initializeConfigs',
    value: function _initializeConfigs() {
      this._vertexPositionsConfig = {
        buffer: this._vertexPositionsBuffer,
        size: 3,
        type: this._gl.FLOAT,
        normalized: false,
        stride: 0,
        offset: 0
      };
      this._textureCoordinatesConfig = {
        buffer: this._textureCoordinatesBuffer,
        size: 2,
        type: this._gl.FLOAT,
        normalized: false,
        stride: 0,
        offset: 0
      };
      this._vertexNormalsConfig = {
        buffer: this._vertexNormalsBuffer,
        size: 3,
        type: this._gl.FLOAT,
        normalized: false,
        stride: 0,
        offset: 0
      };
    }

    /** @returns {number} */

  }, {
    key: 'elementCount',
    get: function get() {
      return this._shapeConfig.elementCount;
    }

    /** @returns {number} */

  }, {
    key: 'mode',
    get: function get() {
      return this._gl.TRIANGLES;
      //return this._gl.LINE_STRIP;// TODO: REMOVE ME
    }
  }]);

  return DefaultModel;
}(_model.Model);

exports.DefaultModel = DefaultModel;

},{"../../util":50,"./model":30}],27:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvisibleModelController = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _modelController = require('./model-controller');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines an extension of the model-controller class that will maintain state but will
 * never render anything.
 */
var InvisibleModelController = function (_ModelController) {
  _inherits(InvisibleModelController, _ModelController);

  /**
   * @param {ModelControllerConfig} params
   */
  function InvisibleModelController(params) {
    _classCallCheck(this, InvisibleModelController);

    return _possibleConstructorReturn(this, (InvisibleModelController.__proto__ || Object.getPrototypeOf(InvisibleModelController)).call(this, params));
  }

  _createClass(InvisibleModelController, [{
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {}
  }, {
    key: 'draw',
    value: function draw() {}

    /**
     * Initializes the program variables configuration.
     *
     * @protected
     */

  }, {
    key: '_setUpProgramVariablesConfig',
    value: function _setUpProgramVariablesConfig() {
      this._programVariablesConfig = {};
    }

    /**
     * Overrides the default method to instead do nothing.
     *
     * @param {string} id
     * @returns {Promise}
     */

  }, {
    key: '_setUpProgramWrapper',
    value: function _setUpProgramWrapper(id) {
      this._programWrapperId = id;
      this._programWrapperPromise = Promise.resolve(null);
      return this._programWrapperPromise;
    }
  }]);

  return InvisibleModelController;
}(_modelController.ModelController);

exports.InvisibleModelController = InvisibleModelController;

},{"./model-controller":28}],28:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelController = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _lslAnimatex = require('lsl-animatex');

var _programWrapper = require('../../program-wrapper');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines a model-controller class.
 *
 * This should be extended by all components that handle models--i.e., anything that will be
 * rendering shapes.
 *
 * @implements {ModelControllerInterface}
 * @abstract
 */
var ModelController = function (_PersistentAnimationJ) {
  _inherits(ModelController, _PersistentAnimationJ);

  /**
   * PRECONDITION: The ProgramWrapper referenced by the given params must have already been
   * registered.
   *
   * @param {ModelControllerConfig} params
   */
  function ModelController(params) {
    _classCallCheck(this, ModelController);

    // ModelController is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (ModelController.__proto__ || Object.getPrototypeOf(ModelController)).call(this));

    if (new.target === ModelController) {
      throw new TypeError('Cannot construct ModelController instances directly');
    }

    _this._gl = params.gl;
    _this._getViewMatrix = params.getViewMatrix;
    _this._getProjectionMatrix = params.getProjectionMatrix;
    _this._getParentWorldTransform = params.getParentWorldTransform;
    _this._localTransform = mat4.create();
    _this._worldTransform = mat4.create();
    _this._texture = null;
    _this._programWrapper = null;
    _this._programWrapperId = null;
    _this._drawFrameHandler = function () {
      return _this.draw();
    };
    _this._programVariablesConfig = null;

    _this.position = vec3.create();
    _this.scale = vec3.fromValues(1, 1, 1);

    _this._setUpTexture(params.texturePath);
    _this._setUpProgramWrapper(params.programWrapperId);

    _this._isReadyPromise = Promise.all([_this._texturePromise, _this._programWrapperPromise]);
    return _this;
  }

  _createClass(ModelController, [{
    key: 'reset',
    value: function reset() {}

    /**
     * Called when this is done being used, and is being destroyed from memory.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      _programWrapper.programWrapperStore.unregisterDrawFrameHandler(this._programWrapperId, this._drawFrameHandler);
    }

    /**
     * Calls update, updateTransforms, and updateChildren.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'updateSelfAndChildren',
    value: function updateSelfAndChildren(currentTime, deltaTime) {
      this.update(currentTime, deltaTime);
      this.updateTransforms();
      this.updateChildren(currentTime, deltaTime);
    }

    /**
     * Updates relevant state for the sub-class.
     *
     * - This does not recursively update descendant model controllers; that's handled by
     *   updateChildren.
     * - This does not update the local or world-coordinate transforms; that's handled by
     *   updateTransforms.
     * - This is called before updateLocalTransform and updateChildren.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Updates the world-coordinate and local-coordinate model matrices.
     *
     * This is called after update and before updateChildren.
     *
     * NOTE: All overrides of this method should update [this._localTransform].
     */

  }, {
    key: 'updateTransforms',
    value: function updateTransforms() {
      mat4.multiply(this._worldTransform, this._getParentWorldTransform(), this._localTransform);
    }

    /**
     * Updates relevant state for any children model controllers.
     *
     * This is called after update and updateLocalTransform.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'updateChildren',
    value: function updateChildren(currentTime, deltaTime) {}

    /**
     * @abstract
     */

  }, {
    key: 'draw',
    value: function draw() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Gets the model transform matrix, in local coordinates.
     *
     * @returns {mat4}
     */

  }, {
    key: 'getIsReady',

    /**
     * Returns a promise that resolves when this model controller is ready for the app to run.
     *
     * @returns {Promise}
     */
    value: function getIsReady() {
      return this._isReadyPromise;
    }

    /** @param {string} id */

  }, {
    key: '_setUpProgramVariablesConfig',

    /**
     * Initializes the program variables configuration.
     *
     * @protected
     * @abstract
     */
    value: function _setUpProgramVariablesConfig() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * @param {string} [texturePath]
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_setUpTexture',
    value: function _setUpTexture(texturePath) {
      var _this2 = this;

      this._texturePromise = texturePath ? _programWrapper.textureStore.loadTexture(this._gl, texturePath) : Promise.resolve(null);

      // Assign the actual texture.
      this._texturePromise = this._texturePromise.then(function (texture) {
        return _this2._texture = texture;
      }).then(function () {
        return _this2._setUpProgramVariablesConfig();
      });

      return this._texturePromise;
    }

    /**
     * @param {string} id
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_setUpProgramWrapper',
    value: function _setUpProgramWrapper(id) {
      var _this3 = this;

      this._programWrapperId = id;
      this._programWrapperPromise = _programWrapper.programWrapperStore.getProgramWrapperPromise(id).then(function (programWrapper) {
        return _this3._programWrapper = programWrapper;
      });
      Promise.all([this._programWrapperPromise, this._texturePromise]).then(function () {
        return _programWrapper.programWrapperStore.registerDrawFrameHandler(id, _this3._drawFrameHandler);
      });
      return this._programWrapperPromise;
    }
  }, {
    key: 'localTransform',
    get: function get() {
      return this._localTransform;
    }

    /**
     * Gets the model transform matrix, in world coordinates.
     *
     * @returns {mat4}
     */

  }, {
    key: 'worldTransform',
    get: function get() {
      return this._worldTransform;
    }
  }, {
    key: 'programWrapperId',
    set: function set(id) {
      _programWrapper.programWrapperStore.unregisterDrawFrameHandler(this._programWrapperId, this._drawFrameHandler);
      this._setUpProgramWrapper(id);
    }

    /** @param {string} value */

  }, {
    key: 'texturePath',
    set: function set(value) {
      this._setUpTexture(value);
    }
  }]);

  return ModelController;
}(_lslAnimatex.PersistentAnimationJob);

exports.ModelController = ModelController;

/**
 * @typedef {Object} ModelControllerInterface
 * @property {Function.<Promise>} getIsReady
 * @property {Function} reset
 * @property {Function} destroy
 * @property {mat4} localTransform
 * @property {mat4} worldTransform
 * @property {vec3} position
 */

/**
 * @typedef {Object} ModelControllerConfig
 * @property {WebGLRenderingContext} gl
 * @property {Function.<mat4>} getViewMatrix
 * @property {Function.<mat4>} getProjectionMatrix
 * @property {Function.<mat4>} getParentWorldTransform
 * @property {string} programWrapperId
 * @property {string} [texturePath]
 */

/**
 * @typedef {Object} ModelGroupControllerConfig
 * @property {WebGLRenderingContext} gl
 * @property {Function.<mat4>} getViewMatrix
 * @property {Function.<mat4>} getProjectionMatrix
 * @property {Function.<mat4>} getParentWorldTransform
 */

},{"../../program-wrapper":32,"lsl-animatex":8}],29:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelGroupController = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _lslAnimatex = require('lsl-animatex');

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class controls groups of models.
 *
 * This is useful for higher-level controllers that control other models and also transform them.
 *
 * @implements {ModelControllerInterface}
 * @abstract
 */
var ModelGroupController = function (_PersistentAnimationJ) {
  _inherits(ModelGroupController, _PersistentAnimationJ);

  /**
   * If either of the shader paths are omitted, then this model controller will not create a
   * rendering program configuration.
   *
   * @param {ModelGroupControllerConfig} params
   */
  function ModelGroupController(params) {
    _classCallCheck(this, ModelGroupController);

    // ModelGroupController is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (ModelGroupController.__proto__ || Object.getPrototypeOf(ModelGroupController)).call(this));

    if (new.target === ModelGroupController) {
      throw new TypeError('Cannot construct ModelGroupController instances directly');
    }

    _this._gl = params.gl;
    _this._getViewMatrix = params.getViewMatrix;
    _this._getProjectionMatrix = params.getProjectionMatrix;
    _this._getParentWorldTransform = params.getParentWorldTransform || function () {
      return mat4.create();
    };
    _this._localTransform = mat4.create();
    _this._worldTransform = mat4.create();
    _this._modelCtrls = [];
    return _this;
  }

  _createClass(ModelGroupController, [{
    key: 'destroy',
    value: function destroy() {
      this.clearModelControllers();
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._triggerOnAllModelControllers('reset');
    }
  }, {
    key: 'clearModelControllers',
    value: function clearModelControllers() {
      this._triggerOnAllModelControllers('destroy');
      this._modelCtrls = [];
    }

    /**
     * Calls update, updateTransforms, and updateChildren.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'updateSelfAndChildren',
    value: function updateSelfAndChildren(currentTime, deltaTime) {
      this.update(currentTime, deltaTime);
      this.updateTransforms();
      this.updateChildren(currentTime, deltaTime);
    }

    /**
     * Updates relevant state for the sub-class.
     *
     * - This does not recursively update descendant model controllers; that's handled by
     *   updateChildren.
     * - This does not update the local or world-coordinate transforms; that's handled by
     *   updateTransforms.
     * - This is called before updateLocalTransform and updateChildren.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {}

    /**
     * Updates the world-coordinate and local-coordinate model matrices.
     *
     * This is called after update and before updateChildren.
     *
     * NOTE: All implementations of this method should update [this._localTransform].
     */

  }, {
    key: 'updateTransforms',
    value: function updateTransforms() {
      mat4.multiply(this._worldTransform, this._getParentWorldTransform(), this._localTransform);
    }

    /**
     * Updates relevant state for any children model controllers.
     *
     * This is called after update and updateLocalTransform.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'updateChildren',
    value: function updateChildren(currentTime, deltaTime) {
      this._triggerOnAllModelControllers('updateSelfAndChildren', [currentTime, deltaTime]);
    }
  }, {
    key: 'draw',
    value: function draw() {}
    // We don't call draw on the children model controllers, because they register themselves to be
    // drawn with their given shader program.


    /**
     * @param {ModelControllerInterface} modelCtrl
     * @returns {Promise.<ModelControllerInterface>}
     * @protected
     */

  }, {
    key: '_startModelController',
    value: function _startModelController(modelCtrl) {
      var _this2 = this;

      return modelCtrl.getIsReady().then(function () {
        modelCtrl.reset();
        _this2._modelCtrls.push(modelCtrl);
        return modelCtrl;
      });
    }

    /**
     * @param {ModelControllerInterface} modelCtrl
     * @protected
     */

  }, {
    key: '_onModelControllerDestroyed',
    value: function _onModelControllerDestroyed(modelCtrl) {
      var index = this._modelCtrls.indexOf(modelCtrl);
      this._modelCtrls.splice(index, 1);
      modelCtrl.destroy();
    }

    /**
     * @param {vec3} targetPosition
     * @param {number} maxSquaredDistance
     * @protected
     */

  }, {
    key: '_removeDistantModelControllers',
    value: function _removeDistantModelControllers(targetPosition, maxSquaredDistance) {
      var _this3 = this;

      this._modelCtrls
      // Get the ModelControllers that are too far away.
      .filter(function (modelCtrl) {
        return vec3.squaredDistance(modelCtrl.position, targetPosition) > maxSquaredDistance;
      })
      // Remove the far-away ModelControllers.
      .forEach(function (modelCtrl) {
        return _this3._onModelControllerDestroyed(modelCtrl);
      });
    }

    /**
     * Gets the model transform matrix, in local coordinates.
     *
     * @returns {mat4}
     */

  }, {
    key: 'getIsReady',

    /**
     * Returns a promise that resolves when this model controller is ready for the app to run.
     *
     * @returns {Promise}
     */
    value: function getIsReady() {
      return Promise.all(this._modelCtrls.map(function (controller) {
        return controller.getIsReady();
      }));
    }

    /**
     * @param {string} methodName
     * @param {Array.<*>} [args]
     * @protected
     */

  }, {
    key: '_triggerOnAllModelControllers',
    value: function _triggerOnAllModelControllers(methodName) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      //this._demoObject[methodName](...args);
      this._modelCtrls.forEach(function (object) {
        return object[methodName].apply(object, _toConsumableArray(args));
      });
    }
  }, {
    key: 'localTransform',
    get: function get() {
      return this._localTransform;
    }

    /**
     * Gets the model transform matrix, in world coordinates.
     *
     * @returns {mat4}
     */

  }, {
    key: 'worldTransform',
    get: function get() {
      return this._worldTransform;
    }
  }]);

  return ModelGroupController;
}(_lslAnimatex.PersistentAnimationJob);

exports.ModelGroupController = ModelGroupController;

},{"lsl-animatex":8}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class defines a top-level model.
 *
 * @abstract
 */
var Model = function () {
  /**
   * @param {WebGLRenderingContext} gl
   */
  function Model(gl) {
    _classCallCheck(this, Model);

    // Model is an abstract class. It should not be instantiated directly.
    if (new.target === Model) {
      throw new TypeError('Cannot construct Model instances directly');
    }

    this._gl = gl;
    this.bounds = null;

    this._vertexPositionsBuffer = null;
    this._vertexNormalsBuffer = null;
    this._textureCoordinatesBuffer = null;

    this._vertexPositionsConfig = null;
    this._textureCoordinatesConfig = null;
    this._vertexNormalsConfig = null;

    // If this is kept null, then gl.drawArrays will be used (with gl.ARRAY_BUFFER) instead of
    // gl.drawElements (with gl.ELEMENT_ARRAY_BUFFER).
    this._vertexIndicesBuffer = null;
  }

  /**
   * Updates the normals on this shape to either be spherical (point outwards from the center) or
   * orthogonal to the faces of their triangles.
   *
   * @param {boolean} isUsingSphericalNormals
   * @protected
   * @abstract
   */

  _createClass(Model, [{
    key: '_setNormals',
    value: function _setNormals(isUsingSphericalNormals) {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /** @returns {?AttributeConfig} */

  }, {
    key: 'vertexPositionsConfig',
    get: function get() {
      return this._vertexPositionsConfig;
    }

    /** @returns {?AttributeConfig} */

  }, {
    key: 'textureCoordinatesConfig',
    get: function get() {
      return this._textureCoordinatesConfig;
    }

    /** @returns {?AttributeConfig} */

  }, {
    key: 'vertexNormalsConfig',
    get: function get() {
      return this._vertexNormalsConfig;
    }

    /** @returns {?WebGLBuffer} */

  }, {
    key: 'vertexIndicesBuffer',
    get: function get() {
      return this._vertexIndicesBuffer;
    }

    /**
     * @returns {number}
     * @abstract
     */

  }, {
    key: 'elementCount',
    get: function get() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * @returns {number}
     * @abstract
     */

  }, {
    key: 'mode',
    get: function get() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }
  }]);

  return Model;
}();

exports.Model = Model;

},{}],31:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StandardModelController = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _renderableShapes = require('../../renderable-shapes');

var _modelController = require('./model-controller');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class defines an extension of the model-controller class that uses a common set of program
 * variables and transformation matrices.
 */
var StandardModelController = function (_ModelController) {
  _inherits(StandardModelController, _ModelController);

  /**
   * @param {ModelControllerConfig} params
   * @param {RenderableShapeConfig} shapeParams
   */
  function StandardModelController(params, shapeParams) {
    _classCallCheck(this, StandardModelController);

    var _this = _possibleConstructorReturn(this, (StandardModelController.__proto__ || Object.getPrototypeOf(StandardModelController)).call(this, params));

    _this.scale = shapeParams.scale || vec3.fromValues(1, 1, 1);
    _this._mvMatrix = mat4.create();
    _this._normalMatrix = mat4.create();
    _this._model = _renderableShapes.renderableShapeFactory.createModel(_this._gl, shapeParams);
    return _this;
  }

  _createClass(StandardModelController, [{
    key: 'update',
    value: function update(currentTime, deltaTime) {}
  }, {
    key: 'draw',
    value: function draw() {
      // Update the model-view matrix.
      mat4.multiply(this._mvMatrix, this._getViewMatrix(), this._worldTransform);

      // Update the normal matrix.
      mat4.invert(this._normalMatrix, this._mvMatrix);
      mat4.transpose(this._normalMatrix, this._normalMatrix);

      // Update the uniform variables.
      this._programVariablesConfig.uniforms['uPMatrix'] = this._getProjectionMatrix();
      this._programVariablesConfig.uniforms['uMVMatrix'] = this._mvMatrix;
      this._programVariablesConfig.uniforms['uNormalMatrix'] = this._normalMatrix;

      // Draw shapes using the current variables configuration.
      this._programWrapper.draw(this._gl, this._programVariablesConfig, 0, this._model.elementCount);
    }

    /**
     * Initializes the program variables configuration.
     *
     * @protected
     */

  }, {
    key: '_setUpProgramVariablesConfig',
    value: function _setUpProgramVariablesConfig() {
      this._programVariablesConfig = {
        attributes: {
          aVertexPosition: this._model.vertexPositionsConfig,
          aTextureCoord: this._model.textureCoordinatesConfig,
          aVertexNormal: this._model.vertexNormalsConfig
        },
        uniforms: {
          uPMatrix: this._getProjectionMatrix(),
          uMVMatrix: this._mvMatrix,
          uNormalMatrix: this._normalMatrix,
          uSampler: this._texture
        },
        mode: this._model.mode,
        vertexIndices: this._model.vertexIndicesBuffer,
        elementCount: this._model.elementCount
      };
    }
  }]);

  return StandardModelController;
}(_modelController.ModelController);

exports.StandardModelController = StandardModelController;

},{"../../renderable-shapes":38,"./model-controller":28}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _programWrapper = require('./src/program-wrapper');

Object.keys(_programWrapper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _programWrapper[key];
    }
  });
});

var _programWrapperStore = require('./src/program-wrapper-store');

Object.keys(_programWrapperStore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _programWrapperStore[key];
    }
  });
});

var _textureStore = require('./src/texture-store');

Object.keys(_textureStore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _textureStore[key];
    }
  });
});

var _uniformSetter = require('./src/uniform-setter');

Object.keys(_uniformSetter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _uniformSetter[key];
    }
  });
});

},{"./src/program-wrapper":35,"./src/program-wrapper-store":34,"./src/texture-store":36,"./src/uniform-setter":37}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupProgramWrapper = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util = require('../../util');

var _programWrapperStore = require('./program-wrapper-store');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class wraps a collection of ProgramWrappers and supports drawing them as a group.
 */
var GroupProgramWrapper = function () {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} config
   */
  function GroupProgramWrapper(gl, config) {
    _classCallCheck(this, GroupProgramWrapper);

    this.config = config;
    this._childrenProgramWrappers = [];
    this._isReady = null;

    this._loadChildren(gl, config).then(function () {
      if (config.initialize) config.initialize(gl);
      if (config.isAPostProcessor) {
        _createChildrenFramebuffersAndTextures(gl, config);
      }
    });
  }

  /** @returns {string} */

  _createClass(GroupProgramWrapper, [{
    key: 'getIsReady',

    /** @returns {Promise} */
    value: function getIsReady() {
      return this._isReady;
    }

    /**
     * Renders shapes using this program.
     *
     * @param {WebGLRenderingContext} gl
     */

  }, {
    key: 'draw',
    value: function draw(gl) {
      if (this.config.webGLStateSetter) this.config.webGLStateSetter(gl);
      this.config.childrenFramebufferIds.forEach(_clearFramebuffer.bind(this, gl));
      this.config.childrenProgramsToDraw.forEach(_drawChildProgramWrapper.bind(this, gl));
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {ProgramWrapperConfig} config
     * @private
     */

  }, {
    key: '_loadChildren',
    value: function _loadChildren(gl, config) {
      var _this = this;

      this._isReady = Promise.all(config.childrenProgramConfigs.map(function (config) {
        return _programWrapperStore.programWrapperStore.loadProgramWrapper(gl, config).then(function (programWrapper) {
          return _this._childrenProgramWrappers.push(programWrapper);
        });
      }));
      return this._isReady;
    }
  }, {
    key: 'programId',
    get: function get() {
      return this.config.id;
    }
  }]);

  return GroupProgramWrapper;
}();

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} id
 * @private
 */

function _clearFramebuffer(gl, id) {
  var framebuffer = _programWrapperStore.programWrapperStore.getFramebuffer(id);
  (0, _util.bindFramebuffer)(gl, framebuffer);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {ProgramWrapperConfig} config
 * @private
 */
function _createChildrenFramebuffersAndTextures(gl, config) {
  config.childrenFramebufferIds.forEach(function (id) {
    return _programWrapperStore.programWrapperStore.createNewFramebufferAndTexture(gl, id, false);
  });
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {ChildProgramAndFramebufferIds} childProgramAndFramebufferIds
 * @private
 */
function _drawChildProgramWrapper(gl, childProgramAndFramebufferIds) {
  var programId = childProgramAndFramebufferIds.programId,
      inputFramebufferIds = childProgramAndFramebufferIds.inputFramebufferIds,
      outputFramebufferId = childProgramAndFramebufferIds.outputFramebufferId;

  var framebuffer = outputFramebufferId ? _programWrapperStore.programWrapperStore.getFramebuffer(outputFramebufferId) : null;
  var programWrapper = _programWrapperStore.programWrapperStore.getProgramWrapper(programId);
  var programVariablesConfig = programWrapper.config.getProgramVariablesConfig(gl, inputFramebufferIds);

  (0, _util.bindFramebuffer)(gl, framebuffer);
  programWrapper.setProgram(gl);
  programWrapper.draw(gl, programVariablesConfig);
}

exports.GroupProgramWrapper = GroupProgramWrapper;

},{"../../util":50,"./program-wrapper-store":34}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.programWrapperStore = exports.MODELS_FRAMEBUFFER_ID = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util = require('../../util');

var _groupProgramWrapper = require('./group-program-wrapper');

var _programWrapper = require('./program-wrapper');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class loads, compiles, and stores WebGL rendering programs.
 *
 * Also, this stores draw-frame handlers for a given program. This makes it easy for a top-level
 * controller to group together draw calls for a given program and therefore minimize program
 * switches.
 *
 * Also, this distinguishes between rendering programs that are used for rendering individual models
 * and post-processing programs that are used for manipulating the entire frame after all the models
 * have rendered.
 *
 * This also allows for grouping programs, which consist of multiple child programs that are all
 * rendered in sequence for a related purpose.
 */
var ProgramWrapperStore = function () {
  function ProgramWrapperStore() {
    _classCallCheck(this, ProgramWrapperStore);

    this._modelProgramCache = {};
    this._sortedModelPrograms = [];
    this._postProcessingProgramCache = {};
    this._sortedPostProcessingPrograms = [];
    this._frambuffers = {};
    this._textures = {};
    this._renderBuffers = {};
  }

  /**
   * Loads and caches a program wrapper using the given configuration.
   *
   * This method is idempotent; a given program will only be cached once.
   *
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} params
   * @returns {Promise.<ProgramWrapper|GroupProgramWrapper, Error>}
   * @private
   */

  _createClass(ProgramWrapperStore, [{
    key: 'loadProgramWrapper',
    value: function loadProgramWrapper(gl, params) {
      var cache = void 0;
      var sortedList = void 0;
      if (params.isAPostProcessor) {
        cache = this._postProcessingProgramCache;
        sortedList = this._sortedPostProcessingPrograms;
      } else {
        cache = this._modelProgramCache;
        sortedList = this._sortedModelPrograms;
      }
      var cacheInfo = cache[params.id];

      // Cache the program if it has not been previously registered.
      if (!cacheInfo) {
        cacheInfo = {};

        cacheInfo.params = params;
        cacheInfo.renderPriority = params.renderPriority;

        var programWrapper = params.childrenProgramConfigs ? new _groupProgramWrapper.GroupProgramWrapper(gl, params) : new _programWrapper.ProgramWrapper(gl, params);

        cacheInfo.programWrapper = programWrapper;
        cacheInfo.promise = programWrapper.getIsReady().then(function () {
          return cacheInfo.programWrapper;
        });

        if (params.isAPostProcessor) {
          // As soon as we know we'll use a post-processing program, make sure we create the default
          // framebuffer/texture for rendering models into.
          if (!this.modelsFramebuffer) {
            this.createNewFramebufferAndTexture(gl, MODELS_FRAMEBUFFER_ID, true);
          }
        } else {
          // Post-processing programs are not used for rendering individual models.
          cacheInfo.drawFrameHandlers = new Set();
        }

        // Store the program cache info in both a map and a list that is sorted by render priority.
        cache[params.id] = cacheInfo;
        sortedList.push(cacheInfo);
        sortedList.sort(_compareProgramCacheInfo);
      }

      return cacheInfo.promise;
    }

    /**
     * Registers the given draw-frame event handler for the given program.
     *
     * This method is idempotent; draw-frame handlers are stored in a set, so duplicate additions will
     * overwrite previous additions.
     *
     * @param {string} id
     * @param {Function} drawFrameHandler
     */

  }, {
    key: 'registerDrawFrameHandler',
    value: function registerDrawFrameHandler(id, drawFrameHandler) {
      var programCacheInfo = this._modelProgramCache[id];

      if (!programCacheInfo) {
        if (this._postProcessingProgramCache[id]) {
          // The program is not set up for rendering individual models.
          throw new Error('Cannot register a draw-frame handler for a program that is not set up for \n                         rendering individual models registered: ' + id);
        } else {
          // The program has not been registered.
          throw new Error('Cannot register a draw-frame handler for a program that has not yet been \n                         registered: ' + id);
        }
      }

      // Store the draw-frame handler.
      programCacheInfo.drawFrameHandlers.add(drawFrameHandler);
    }

    /**
     * WARNING: This will remove the program from the store even if there are still other components
     * depending on this program or its draw-frame handlers.
     *
     * @param {string} id
     */

  }, {
    key: 'deleteProgramWrapper',
    value: function deleteProgramWrapper(id) {
      // Determine which collections we're removing the program from.
      var sortedPrograms = void 0;
      var programCache = void 0;
      if (this._modelProgramCache[id]) {
        sortedPrograms = this._sortedModelPrograms;
        programCache = this._modelProgramCache;
      } else {
        sortedPrograms = this._sortedPostProcessingPrograms;
        programCache = this._postProcessingProgramCache;
      }
      var programCacheInfo = programCache[id];

      // Remove the program.
      sortedPrograms.splice(sortedPrograms.indexOf(programCacheInfo), 1);
      delete programCache[id];
    }

    // TODO: Don't forget to unregister draw-frame handlers when destroying models (asteroids, UFOs,
    // etc.)
    /**
     * @param {string} id
     * @param {Function} drawFrameHandler
     */

  }, {
    key: 'unregisterDrawFrameHandler',
    value: function unregisterDrawFrameHandler(id, drawFrameHandler) {
      this._modelProgramCache[id].drawFrameHandlers.delete(drawFrameHandler);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     * @throws If there is no program registered with the given ID.
     */

  }, {
    key: 'getProgramWrapperPromise',
    value: function getProgramWrapperPromise(id) {
      var cacheInfo = this._modelProgramCache[id] || this._postProcessingProgramCache[id];
      return cacheInfo.promise;
    }

    /**
     * @param {string} id
     * @returns {ProgramWrapper}
     * @throws If there is no program registered with the given ID.
     */

  }, {
    key: 'getProgramWrapper',
    value: function getProgramWrapper(id) {
      var cacheInfo = this._modelProgramCache[id] || this._postProcessingProgramCache[id];
      return cacheInfo.programWrapper;
    }

    /**
     * Calls the given callback once for each registered per-model program wrapper.
     *
     * The callback is passed two arguments: the program wrapper and the registered draw-frame
     * handlers.
     *
     * @param {Function} callback
     */

  }, {
    key: 'forEachModelProgram',
    value: function forEachModelProgram(callback) {
      this._sortedModelPrograms.forEach(function (programCacheInfo) {
        return callback(programCacheInfo.programWrapper, programCacheInfo.drawFrameHandlers);
      });
    }

    /**
     * Calls the given callback once for each registered post-processing program wrapper.
     *
     * @param {Function} callback
     */

  }, {
    key: 'forEachPostProcessingProgram',
    value: function forEachPostProcessingProgram(callback) {
      this._sortedPostProcessingPrograms.forEach(function (programCacheInfo) {
        return callback(programCacheInfo.programWrapper);
      });
    }

    /** @returns {boolean} */

  }, {
    key: 'createNewFramebufferAndTexture',

    /**
     * Creates and stores a framebuffer with a texture.
     *
     * Both the framebuffer and texture can be accessed later using the given ID.
     *
     * @param {WebGLRenderingContext} gl
     * @param {string} id
     * @param {boolean} [shouldStoreDepthInfo=false]
     */
    value: function createNewFramebufferAndTexture(gl, id) {
      var shouldStoreDepthInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var renderBuffer = void 0;
      if (shouldStoreDepthInfo) {
        renderBuffer = (0, _util.createRenderBuffer)(gl);
        this._renderBuffers[id] = renderBuffer;
      }

      var texture = (0, _util.createTextureForRendering)(gl);
      this._textures[id] = texture;

      var framebuffer = (0, _util.createFramebuffer)(gl, texture, renderBuffer);
      this._frambuffers[id] = framebuffer;
    }

    /**
     * @param {string} id
     * @returns {?WebGLFramebuffer}
     */

  }, {
    key: 'getFramebuffer',
    value: function getFramebuffer(id) {
      return this._frambuffers[id];
    }

    /**
     * @param {string} id
     * @returns {?WebGLTexture}
     */

  }, {
    key: 'getTexture',
    value: function getTexture(id) {
      return this._textures[id];
    }

    /**
     * If we are using a post-processing program, then this is the default framebuffer for rendering
     * models into.
     *
     * @returns {?WebGLFramebuffer}
     */

  }, {
    key: 'isUsingPostProcessingPrograms',
    get: function get() {
      return this._sortedPostProcessingPrograms.length > 0;
    }
  }, {
    key: 'modelsFramebuffer',
    get: function get() {
      return this._frambuffers[MODELS_FRAMEBUFFER_ID];
    }

    /**
     * If we are using a post-processing program, then this is the default texture for rendering
     * models into.
     *
     * @returns {?WebGLTexture}
     */

  }, {
    key: 'modelsTexture',
    get: function get() {
      return this._textures[MODELS_FRAMEBUFFER_ID];
    }

    /**
     * If we are using a post-processing program, then this is the default depth render buffer for
     * rendering models.
     *
     * @returns {?WebGLRenderBuffer}
     */

  }, {
    key: 'modelsRenderBuffer',
    get: function get() {
      return this._renderBuffers[MODELS_FRAMEBUFFER_ID];
    }
  }]);

  return ProgramWrapperStore;
}();

function _compareProgramCacheInfo(a, b) {
  return a.renderPriority - b.renderPriority;
}

var MODELS_FRAMEBUFFER_ID = exports.MODELS_FRAMEBUFFER_ID = 'models';

var programWrapperStore = exports.programWrapperStore = new ProgramWrapperStore();

/**
 * @typedef {Object} ProgramCacheInfo
 * @property {ProgramWrapperConfig} params
 * @property {ProgramWrapper|GroupProgramWrapper} [programWrapper]
 * @property {Set.<Function>} [drawFrameHandlers]
 * @property {Array.<ProgramWrapper>} [childrenProgramWrappers]
 */

},{"../../util":50,"./group-program-wrapper":33,"./program-wrapper":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgramWrapper = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util = require('../../util');

var _uniformSetter = require('./uniform-setter');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class wraps a native WebGLProgram object and provides convenience methods for:
 * - setting the wrapped program for use on the WebGL rendering context,
 * - enabling the attribute variables for the program,
 * - setting the attribute and uniform variables for the program,
 * - drawing shapes with the program and its current configuration.
 */
var ProgramWrapper = function () {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {ProgramWrapperConfig} config
   */
  function ProgramWrapper(gl, config) {
    _classCallCheck(this, ProgramWrapper);

    this.config = config;
    this._program = null;
    this._uniformSetters = null;
    this._attributeEnablers = null;
    this._attributeSetters = null;

    // This is used for assigning different textures to different texture units.
    this.baseTextureUnitIndex = 0;

    this._buildWebGLProgramPromise = this._buildWebGLProgram(gl, config);

    // TODO: Freeze this object after initializing
  }

  /** @returns {string} */

  _createClass(ProgramWrapper, [{
    key: 'getIsReady',

    /** @returns {Promise} */
    value: function getIsReady() {
      return this._buildWebGLProgramPromise;
    }

    /**
     * Sets this program to use for rendering on the given WebGL context.
     *
     * This also enables all relevant attribute variables for this program.
     *
     * @param {WebGLRenderingContext} gl
     */

  }, {
    key: 'setProgram',
    value: function setProgram(gl) {
      gl.useProgram(this._program);
      this._enableAttributes();
      if (this.config.webGLStateSetter) this.config.webGLStateSetter(gl);
    }

    /**
     * Renders shapes using this program with the given variables configuration.
     *
     * @param {WebGLRenderingContext} gl
     * @param {ProgramVariablesConfig} [programVariablesConfig]
     * @param {number} [offset=0] Offset into the element array buffer to render from.
     * @param {number} [count=programVariablesConfig.elementCount] The number of elements to render.
     */

  }, {
    key: 'draw',
    value: function draw(gl, programVariablesConfig, offset, count) {
      programVariablesConfig = programVariablesConfig || this.config.getProgramVariablesConfig(gl);
      this._setVariables(gl, programVariablesConfig);
      this._draw(gl, programVariablesConfig, offset, count);
    }

    /**
     * Sets up this WebGL rendering program to draw shapes with the given program variables
     * configuration and the attribute/uniform setters that have been set up for this program.
     *
     * @param {WebGLRenderingContext} gl
     * @param {ProgramVariablesConfig} programVariablesConfig
     * @private
     */

  }, {
    key: '_setVariables',
    value: function _setVariables(gl, programVariablesConfig) {
      this._setAttributes(programVariablesConfig.attributes);
      this._setUniforms(programVariablesConfig.uniforms);

      // Check whether we are set up to draw using gl.drawElements rather than gl.drawArrays.
      if (programVariablesConfig.vertexIndices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programVariablesConfig.vertexIndices);
      }
    }

    /**
     * Renders shapes according to this program's current configuration.
     *
     * @param {WebGLRenderingContext} gl
     * @param {ProgramVariablesConfig} programVariablesConfig
     * @param {number} [offset=0] Offset into the element array buffer to render from.
     * @param {number} [count=programVariablesConfig.elementCount] The number of elements to render.
     * @private
     */

  }, {
    key: '_draw',
    value: function _draw(gl, programVariablesConfig, offset, count) {
      offset = typeof offset === 'number' ? offset : 0;
      count = typeof count === 'number' ? count : programVariablesConfig.elementCount;

      if (_util.isInDevMode) {
        this._checkThatGivenVariablesMatchProgram(programVariablesConfig);
      }

      // Check whether we are set up to draw using gl.drawElements or gl.drawArrays.
      if (programVariablesConfig.vertexIndices) {
        gl.drawElements(programVariablesConfig.mode, count, gl.UNSIGNED_SHORT, offset);
      } else {
        gl.drawArrays(programVariablesConfig.mode, offset, count);
      }
    }

    /**
     * Checks whether the attribute and uniform variables specified in the given config match those
     * defined in this program.
     *
     * @param {ProgramVariablesConfig} programVariablesConfig
     * @private
     */

  }, {
    key: '_checkThatGivenVariablesMatchProgram',
    value: function _checkThatGivenVariablesMatchProgram(programVariablesConfig) {
      if (Object.keys(programVariablesConfig.attributes).length !== Object.keys(this._attributeSetters).length || Object.keys(programVariablesConfig.uniforms).length !== Object.keys(this._uniformSetters).length) {
        console.warn('The attribute/uniform variables in the ProgramVariablesConfig do not match ' + 'those specified in the shaders.', programVariablesConfig, this);
      }
    }

    /**
     * Sets the uniform values for this program.
     *
     * Specifically, this calls `gl.uniform<...>(location, value)` for each
     * variable-name/variable-value key-value pair in the given map. As part of the setup process, the
     * uniform variable locations are stored in a map from their corresponding variable names. So only
     * the variable names are needed in order to call this function at render time.
     *
     * @param {Object.<String, UniformData>} uniformValues
     */

  }, {
    key: '_setUniforms',
    value: function _setUniforms(uniformValues) {
      var _this = this;

      Object.keys(uniformValues).forEach(function (uniformName) {
        var uniformSetter = _this._uniformSetters[uniformName];
        var uniformValue = uniformValues[uniformName];
        uniformSetter.setUniform(uniformValue);
      });
    }

    /**
     * Sets the attribute buffers for this program.
     *
     * Specifically, this calls `gl.bindBuffer(...)` and `gl.vertexAttribPointer(...)` for each
     * variable-name/variable-value pair in the given attribute-info map. As part of the setup
     * process, the uniform variable locations are stored in a map from their corresponding variable
     * names. So only the variable names are needed in order to call this function at render time.
     *
     * @param {Object.<String, AttributeConfig>} attributeConfigs
     */

  }, {
    key: '_setAttributes',
    value: function _setAttributes(attributeConfigs) {
      var _this2 = this;

      Object.keys(attributeConfigs).forEach(function (attributeName) {
        var attributeSetter = _this2._attributeSetters[attributeName];
        var attributeConfig = attributeConfigs[attributeName];
        attributeSetter(attributeConfig);
      });
    }

    /**
     * @private
     */

  }, {
    key: '_enableAttributes',
    value: function _enableAttributes() {
      this._attributeEnablers.forEach(function (attributeEnabler) {
        return attributeEnabler();
      });
    }

    /**
     * Creates uniform setters for this program and saves them in the _uniformSetters property.
     *
     * @param {WebGLRenderingContext} gl
     * @private
     */

  }, {
    key: '_createUniformSetters',
    value: function _createUniformSetters(gl) {
      var uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);

      this._uniformSetters = {};

      for (var index = 0; index < uniformCount; index++) {
        var uniformInfo = gl.getActiveUniform(this._program, index);
        var uniformName = uniformInfo.name;

        // Remove any array suffix.
        // TODO: Is this removal redundant with the isArray check below??
        if (uniformName.substr(-3) === '[0]') {
          uniformName = uniformName.substr(0, uniformName.length - 3);
        }

        this._uniformSetters[uniformName] = new _uniformSetter.UniformSetter(gl, this._program, uniformInfo, this);
      }
    }

    /**
     * Creates attribute enablers and setters for this program and saves them in the
     * _attributeEnablers and _attributeSetters properties, respectively.
     *
     * @param {WebGLRenderingContext} gl
     * @private
     */

  }, {
    key: '_createAttributeEnablersAndSetters',
    value: function _createAttributeEnablersAndSetters(gl) {
      this._attributeEnablers = [];
      this._attributeSetters = {};

      var attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);

      for (var index = 0; index < attributeCount; index++) {
        var attributeName = gl.getActiveAttrib(this._program, index).name;
        var location = gl.getAttribLocation(this._program, attributeName);

        this._attributeEnablers.push(ProgramWrapper._createAttributeEnabler(gl, location));
        this._attributeSetters[attributeName] = ProgramWrapper._createAttributeSetter(gl, location);
      }
    }

    /**
     * Loads the shader source code from the given URLs, compiles the shader source code, and creates
     * a program from the resulting shaders.
     *
     * @param {WebGLRenderingContext} gl
     * @param {ProgramWrapperConfig} config
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_buildWebGLProgram',
    value: function _buildWebGLProgram(gl, config) {
      var _this3 = this;

      return (0, _util.loadProgram)(gl, config.vertexShaderPath, config.fragmentShaderPath).then(function (webGLProgram) {
        _this3._program = webGLProgram;
        _this3._createUniformSetters(gl);
        _this3._createAttributeEnablersAndSetters(gl);
        if (config.initialize) config.initialize(gl);
      }).then(function () {
        return console.info('Program loaded: ' + config.id);
      });
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {number} location
     * @returns {Function}
     * @private
     */

  }, {
    key: 'programId',
    get: function get() {
      return this.config.id;
    }
  }], [{
    key: '_createAttributeEnabler',
    value: function _createAttributeEnabler(gl, location) {
      return function () {
        return gl.enableVertexAttribArray(location);
      };
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {number} location
     * @returns {Function.<AttributeConfig>}
     * @private
     */

  }, {
    key: '_createAttributeSetter',
    value: function _createAttributeSetter(gl, location) {
      return function (attributeConfig) {
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeConfig.buffer);
        gl.vertexAttribPointer(location, attributeConfig.size, typeof attributeConfig.type !== 'undefined' ? attributeConfig.type : gl.FLOAT, typeof attributeConfig.normalized !== 'undefined' ? attributeConfig.normalized : false, typeof attributeConfig.stride !== 'undefined' ? attributeConfig.stride : 0, typeof attributeConfig.offset !== 'undefined' ? attributeConfig.offset : 0);
      };
    }
  }]);

  return ProgramWrapper;
}();

exports.ProgramWrapper = ProgramWrapper;

/**
 * @typedef {Object} ProgramWrapperConfig
 * @property {string} id
 * @property {Function} [initialize] A method for one-time initialization of the GL state for this
 * program.
 * @property {Function} [webGLStateSetter] A method for setting up the GL state for this program
 * wrapper in preparation for the current draw call.
 * @property {number} [renderPriority] Programs with lower priority will render first. This does not
 * need to be present for ProgramWrappers that are children of a GroupProgramWrapper.
 * @property {string} [vertexShaderPath] This will be present on configs for non-group
 * ProgramWrappers.
 * @property {string} [fragmentShaderPath] This will be present on configs for non-group
 * ProgramWrappers.
 * @property {boolean} [isAPostProcessor=false] A post-processing program is used for manipulating
 * the entire frame after all the models have rendered.
 * @property {boolean} [childrenProgramConfigs] A grouping program consists of multiple child
 * programs that are all rendered in sequence for a related purpose.
 * @property {Array.<ChildProgramAndFramebufferIds>} [childrenProgramsToDraw] The IDs for the
 * sequence of children ProgramWrappers to draw, as well as the IDs for the input and output
 * framebuffers/textures to use. This will be present on configs for GroupProgramWrappers.
 * @property {Array.<string>} [childrenFramebufferIds] The IDs of all the framebuffers/textures that
 * will need to be created for this program. This will be present on configs for
 * GroupProgramWrappers.
 * @property {Function} [getProgramVariablesConfig] A method for getting the variables needed for
 * drawing this program. This will be present on configs of programs that are children of a
 * GroupProgramWrapper.
 */

/**
 * @typedef {Object} ChildProgramAndFramebufferIds
 * @property {string} programId The ID of the program to draw with.
 * @property {Array.<string>} inputFramebufferIds The IDs of framebuffers whose textures will be
 * used as inputs for this program's shaders.
 * @property {string} outputFramebufferId Provide null in order to render to the canvas.
 */

/**
 * @typedef {Object} ProgramVariablesConfig
 * @property {Object.<String, AttributeConfig>} attributes A mapping from attribute names to
 * attribute info.
 * @property {Object.<String, UniformData>} uniforms A mapping from uniform names to uniform info.
 * @property {number} mode Specifies the type of primitives to render; one of:
 *   - gl.POINTS,
 *   - gl.LINES,
 *   - gl.LINE_STRIP,
 *   - gl.LINE_LOOP,
 *   - gl.TRIANGLES,
 *   - gl.TRIANGLE_STRIP,
 *   - gl.TRIANGLE_FAN.
 * @property {WebGLBuffer} [vertexIndices] The indices to use for retrieving the vertex info from
 * each of the other attribute variable buffers. If this property is present, then the rendering
 * pipeline will be set up to use gl.drawElements (with gl.ELEMENT_ARRAY_BUFFER) instead of
 * gl.drawArrays.
 * @property {number} elementCount The number of elements/vertices to render for this variables
 * configuration.
 */

/**
 * @typedef {Object} AttributeConfig
 * @property {WebGLBuffer} buffer The buffer containing this attribute's data.
 * @property {number} index Index of target attribute in the buffer bound to gl.ARRAY_BUFFER.
 * @property {number} size The number of components per attribute. Must be 1,2,3,or 4.
 * @property {number} type Specifies the data type of each component in the array. Use either
 * gl.FLOAT or gl.FIXED.
 * @property {boolean} normalized If true, then values will be normalized to a range of -1 or 0 to
 * 1.
 * @property {number} stride Specifies the offset in bytes between the beginning of consecutive
 * vertex attributes. Default value is 0, maximum is 255. Must be a multiple of type.
 * @property {number} offset Specifies an offset in bytes of the first component of the first
 * vertex attribute in the array. Default is 0 which means that vertex attributes are tightly
 * packed. Must be a multiple of type.
 */

/** @typedef {*} UniformData */

},{"../../util":50,"./uniform-setter":37}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textureStore = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util = require('../../util');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class loads, sets up, and stores WebGL texture objects.
 *
 * NOTE: Only textures whose side lengths are powers of two are supported.
 */
var TextureStore = function () {
  function TextureStore() {
    _classCallCheck(this, TextureStore);

    this.textureCache = {};
  }

  /**
   * @param {string} texturePath
   * @returns {WebGLTexture}
   */

  _createClass(TextureStore, [{
    key: 'getTexture',
    value: function getTexture(texturePath) {
      return this.textureCache[texturePath].texture;
    }

    /**
     * Loads the texture image at the given path, creates a texture object from it, caches the
     * texture, and returns a promise for the texture.
     *
     * This method is idempotent; a given texture will only be loaded once.
     *
     * @param {WebGLRenderingContext} gl
     * @param {string} texturePath
     * @returns {Promise.<WebGLTexture, Error>}
     */

  }, {
    key: 'loadTexture',
    value: function loadTexture(gl, texturePath) {
      var _this = this;

      var textureCacheInfo = this.textureCache[texturePath];

      // Load, create, and cache the texture if it has not been previously registered.
      if (!textureCacheInfo) {
        textureCacheInfo = {
          texturePromise: null,
          texture: null,
          image: new Image()
        };
        this.textureCache[texturePath] = textureCacheInfo;
        textureCacheInfo.texturePromise = (0, _util.loadImageSrc)(textureCacheInfo.image, texturePath).then(function (_) {
          return _this._createTexture(gl, textureCacheInfo);
        });
      }

      return textureCacheInfo.texturePromise;
    }

    // TODO: Make this more general/configurable by creating a new TextureConfig typedef with most of
    // the gl.xxx params included below (like the AttributeConfig typedef}, passing a textureConfig in
    // the register method, and saving it on the textureCacheInfo object.
    /**
     * @param {WebGLRenderingContext} gl
     * @param {TextureCacheInfo} textureCacheInfo
     * @returns {WebGLTexture}
     * @private
     */

  }, {
    key: '_createTexture',
    value: function _createTexture(gl, textureCacheInfo) {
      console.info('Texture loaded: ' + textureCacheInfo.image.src);

      textureCacheInfo.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, textureCacheInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCacheInfo.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);

      return textureCacheInfo.texture;
    }

    /**
     * WARNING: This will remove the texture from the store even if there are still other components
     * depending on this texture.
     *
     * @param {string} texturePath
     */

  }, {
    key: 'deleteTexture',
    value: function deleteTexture(texturePath) {
      delete this.textureCache[texturePath];
    }
  }]);

  return TextureStore;
}();

var textureStore = exports.textureStore = new TextureStore();

/**
 * @typedef {Object} TextureCacheInfo
 * @property {Promise.<WebGLTexture, Error>} texturePromise
 * @property {WebGLTexture} [texture]
 * @property {HTMLImageElement} [image]
 */

},{"../../util":50}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class stores a function for setting a value to a WebGL uniform variable.
 *
 * This is intended for use as a helper for the ProgramWrapper class.
 */
// TODO: Write tests for this class.
var UniformSetter = function () {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLProgram} program
   * @param {WebGLActiveInfo} uniformInfo
   * @param {ProgramWrapper} programWrapper
   * @throws If the given uniformInfo specifies an unexpected uniform-value type.
   */
  function UniformSetter(gl, program, uniformInfo, programWrapper) {
    _classCallCheck(this, UniformSetter);

    this._location = gl.getUniformLocation(program, uniformInfo.name);
    this._setter = this._getSetter(gl, uniformInfo, programWrapper);

    // TODO: Freeze this object after initializing
  }

  /**
   * @param {UniformData} uniformValue
   */

  _createClass(UniformSetter, [{
    key: 'setUniform',
    value: function setUniform(uniformValue) {
      uniformValue = uniformValue instanceof Array ? new Float32Array(uniformValue) : uniformValue;
      this._setter(uniformValue);
    }

    /** @returns {WebGLUniformLocation} */

  }, {
    key: '_getSetter',

    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLActiveInfo} uniformInfo
     * @param {ProgramWrapper} programWrapper
     * @returns {Function.<*>}
     * @throws If the given uniformInfo specifies an unexpected uniform-value type.
     * @private
     */
    value: function _getSetter(gl, uniformInfo, programWrapper) {
      var _this = this,
          _ref,
          _ref2;

      var isArray = uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]';
      var setterMap = isArray ? (_ref = {}, _defineProperty(_ref, gl.FLOAT, function (value) {
        return gl.uniform1fv(_this._location, value);
      }), _defineProperty(_ref, gl.INT, function (value) {
        return gl.uniform1iv(_this._location, value);
      }), _defineProperty(_ref, gl.SAMPLER_2D, this._getUniformTextureArraySetter(gl, gl.TEXTURE_2D, uniformInfo.size, programWrapper)), _defineProperty(_ref, gl.SAMPLER_CUBE, this._getUniformTextureArraySetter(gl, gl.TEXTURE_CUBE_MAP, uniformInfo.size, programWrapper)), _ref) : (_ref2 = {}, _defineProperty(_ref2, gl.FLOAT, function (value) {
        return gl.uniform1f(_this._location, value);
      }), _defineProperty(_ref2, gl.FLOAT_VEC2, function (value) {
        return gl.uniform2fv(_this._location, value);
      }), _defineProperty(_ref2, gl.FLOAT_VEC3, function (value) {
        return gl.uniform3fv(_this._location, value);
      }), _defineProperty(_ref2, gl.FLOAT_VEC4, function (value) {
        return gl.uniform4fv(_this._location, value);
      }), _defineProperty(_ref2, gl.INT, function (value) {
        return gl.uniform1i(_this._location, value);
      }), _defineProperty(_ref2, gl.INT_VEC2, function (value) {
        return gl.uniform2iv(_this._location, value);
      }), _defineProperty(_ref2, gl.INT_VEC3, function (value) {
        return gl.uniform3iv(_this._location, value);
      }), _defineProperty(_ref2, gl.INT_VEC4, function (value) {
        return gl.uniform4iv(_this._location, value);
      }), _defineProperty(_ref2, gl.BOOL, function (value) {
        return gl.uniform1i(_this._location, value);
      }), _defineProperty(_ref2, gl.BOOL_VEC2, function (value) {
        return gl.uniform2iv(_this._location, value);
      }), _defineProperty(_ref2, gl.BOOL_VEC3, function (value) {
        return gl.uniform3iv(_this._location, value);
      }), _defineProperty(_ref2, gl.BOOL_VEC4, function (value) {
        return gl.uniform4iv(_this._location, value);
      }), _defineProperty(_ref2, gl.FLOAT_MAT2, function (value) {
        return gl.uniformMatrix2fv(_this._location, false, value);
      }), _defineProperty(_ref2, gl.FLOAT_MAT3, function (value) {
        return gl.uniformMatrix3fv(_this._location, false, value);
      }), _defineProperty(_ref2, gl.FLOAT_MAT4, function (value) {
        return gl.uniformMatrix4fv(_this._location, false, value);
      }), _defineProperty(_ref2, gl.SAMPLER_2D, this._getUniformTextureSetter(gl, gl.TEXTURE_2D, programWrapper.baseTextureUnitIndex++)), _defineProperty(_ref2, gl.SAMPLER_CUBE, this._getUniformTextureSetter(gl, gl.TEXTURE_CUBE_MAP, programWrapper.baseTextureUnitIndex++)), _ref2);
      return setterMap[uniformInfo.type];
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {number} target An enum describing the type of this buffer; one of:
     *   - gl.TEXTURE_2D,
     *   - gl.TEXTURE_CUBE_MAP.
     * @param {number} uniformSize
     * @param {ProgramWrapper} programWrapper
     * @returns {Function.<*>}
     * @private
     */

  }, {
    key: '_getUniformTextureArraySetter',
    value: function _getUniformTextureArraySetter(gl, target, uniformSize, programWrapper) {
      var _this2 = this;

      var textureUnitIndices = Array.from({ length: uniformSize }, function (_) {
        return programWrapper.baseTextureUnitIndex++;
      });

      return function (textures) {
        textures.forEach(function (texture, index) {
          gl.activeTexture(gl.TEXTURE0 + textureUnitIndices[index]);
          gl.bindTexture(target, texture);
        });
        gl.uniform1iv(_this2._location, textureUnitIndices);
      };
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {number} target An enum describing the type of this buffer; one of:
     *   - gl.TEXTURE_2D,
     *   - gl.TEXTURE_CUBE_MAP.
     * @param {number} textureUnitIndex
     * @returns {Function.<*>}
     * @private
     */

  }, {
    key: '_getUniformTextureSetter',
    value: function _getUniformTextureSetter(gl, target, textureUnitIndex) {
      var _this3 = this;

      return function (texture) {
        gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);
        gl.bindTexture(target, texture);
        gl.uniform1i(_this3._location, textureUnitIndex);
      };
    }
  }, {
    key: 'location',
    get: function get() {
      return this._location;
    }
  }]);

  return UniformSetter;
}();

exports.UniformSetter = UniformSetter;

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _capsuleRenderableShape = require('./src/shape-configs/capsule-renderable-shape');

Object.keys(_capsuleRenderableShape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _capsuleRenderableShape[key];
    }
  });
});

var _cubeRenderableShape = require('./src/shape-configs/cube-renderable-shape');

Object.keys(_cubeRenderableShape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cubeRenderableShape[key];
    }
  });
});

var _icosahedronRenderableShape = require('./src/shape-configs/icosahedron-renderable-shape');

Object.keys(_icosahedronRenderableShape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _icosahedronRenderableShape[key];
    }
  });
});

var _icosphereRenderableShape = require('./src/shape-configs/icosphere-renderable-shape');

Object.keys(_icosphereRenderableShape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _icosphereRenderableShape[key];
    }
  });
});

var _latLongSphereRenderableShape = require('./src/shape-configs/lat-long-sphere-renderable-shape');

Object.keys(_latLongSphereRenderableShape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _latLongSphereRenderableShape[key];
    }
  });
});

var _tetrahedronRenderableShape = require('./src/shape-configs/tetrahedron-renderable-shape');

Object.keys(_tetrahedronRenderableShape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tetrahedronRenderableShape[key];
    }
  });
});

var _renderableShapeFactory = require('./src/renderable-shape-factory');

Object.keys(_renderableShapeFactory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _renderableShapeFactory[key];
    }
  });
});

var _renderableShapeStore = require('./src/renderable-shape-store');

Object.keys(_renderableShapeStore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _renderableShapeStore[key];
    }
  });
});

[_capsuleRenderableShape.capsuleRenderableShapeFactory, _cubeRenderableShape.cubeRenderableShapeFactory, _icosahedronRenderableShape.icosahedronRenderableShapeFactory, _icosphereRenderableShape.icosphereRenderableShapeFactory, _latLongSphereRenderableShape.latLongSphereRenderableShapeFactory, _tetrahedronRenderableShape.tetrahedronRenderableShapeFactory].forEach(_renderableShapeFactory.renderableShapeFactory.registerRenderableShapeFactory);

},{"./src/renderable-shape-factory":39,"./src/renderable-shape-store":40,"./src/shape-configs/capsule-renderable-shape":41,"./src/shape-configs/cube-renderable-shape":42,"./src/shape-configs/icosahedron-renderable-shape":43,"./src/shape-configs/icosphere-renderable-shape":44,"./src/shape-configs/lat-long-sphere-renderable-shape":45,"./src/shape-configs/tetrahedron-renderable-shape":46}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderableShapeFactory = undefined;

var _models = require('../../models');

var _renderableShapeStore = require('./renderable-shape-store');

/**
 * This module defines a factory for DefaultRigidModal instances that are based on the various
 * pre-defined renderable shapes in this directory.
 */

var renderableShapeFactory = {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {RenderableShapeConfig} params
   * @returns {DefaultModel}
   */
  createModel: function createModel(gl, params) {
    var shapeConfig = renderableShapeFactory.getRenderableShape(params);
    return new _models.DefaultModel(gl, shapeConfig);
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    params.isUsingSphericalNormals = params.isUsingSphericalNormals || false;
    params.divisionsCount = typeof params.divisionsCount === 'number' ? params.divisionsCount : 0;

    var shapeConfig = _renderableShapeStore.renderableShapeStore.getShape(params);
    if (!shapeConfig) {
      shapeConfig = _shapeIdsToRenderableShapeFactories[params.shapeId].getRenderableShape(params);
      _updateTextureCoordinatesSpan(shapeConfig, params.textureSpan);
      _renderableShapeStore.renderableShapeStore.registerShape(shapeConfig, params);
    }
    return shapeConfig;
  },

  /**
   * @param {RenderableShapeFactory} shapeConfigFactory
   */
  registerRenderableShapeFactory: function registerRenderableShapeFactory(shapeConfigFactory) {
    _shapeIdsToRenderableShapeFactories[shapeConfigFactory.shapeId] = shapeConfigFactory;
    _renderableShapeStore.renderableShapeStore.registerRenderableShapeFactory(shapeConfigFactory);
  }
};

var _shapeIdsToRenderableShapeFactories = {};

/**
 * @param {RenderableShape} shapeConfig
 * @param {TextureSpan} textureSpan
 * @private
 */
function _updateTextureCoordinatesSpan(shapeConfig, textureSpan) {
  if (!textureSpan) return;

  var minX = textureSpan.minX;
  var minY = textureSpan.minY;
  var rangeX = textureSpan.maxX - textureSpan.minX;
  var rangeY = textureSpan.maxY - textureSpan.minY;

  var textureCoordinates = shapeConfig.textureCoordinates.slice();
  shapeConfig.textureCoordinates = textureCoordinates;

  for (var i = 0, count = textureCoordinates.length; i < count; i += 2) {
    textureCoordinates[i] = minX + rangeX * textureCoordinates[i];
    textureCoordinates[i + 1] = minY + rangeY * textureCoordinates[i + 1];
  }
}

exports.renderableShapeFactory = renderableShapeFactory;

/**
 * @typedef {Object} RenderableShapeFactory
 * @property {string} shapeId
 * @property {Function.<RenderableShape>} getRenderableShape
 * @property {Function.<String>} getCacheId
 */

/**
 * @typedef {Object} RenderableShape
 * @property {Array.<Number>} vertexPositions
 * @property {Array.<Number>} vertexNormals
 * @property {Array.<Number>} textureCoordinates
 * @property {Array.<Number>} [vertexIndices]
 * @property {number} elementCount
 */

/**
 * @typedef {Object} TextureSpan
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 */

/**
 * @typedef {Object} RenderableShapeConfig
 * @property {string} shapeId The ID of the type of renderable shape.
 * @property {boolean} [isUsingSphericalNormals=false] Whether light reflections should show sharp
 * edges.
 * @property {TextureSpan} [textureSpan] For indicating how much a texture should repeat in both axes.
 * A range of 0-0.5 should show half the texture. A range of 0-2 would show the texture twice. The
 * default is 0-1 in both directions.
 * @property {vec3} [scale]
 */

/**
 * @typedef {RenderableShapeConfig} SphericalRenderableShapeParams
 * @property {number} divisionsCount How many times to sub-divide the sphere.
 */

},{"../../models":25,"./renderable-shape-store":40}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class caches renderable shape data.
 */
var RenderableShapeStore = function () {
  function RenderableShapeStore() {
    _classCallCheck(this, RenderableShapeStore);

    this._shapeCache = new Map();
  }

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */

  _createClass(RenderableShapeStore, [{
    key: 'getShape',
    value: function getShape(params) {
      var key = _shapeIdsToCacheKeyCalculators[params.shapeId](params);
      return this._shapeCache.get(key);
    }

    /**
     * Caches the given shape info.
     *
     * @param {RenderableShape} shapeConfig
     * @param {RenderableShapeConfig} params
     */

  }, {
    key: 'registerShape',
    value: function registerShape(shapeConfig, params) {
      var key = _shapeIdsToCacheKeyCalculators[params.shapeId](params);
      this._shapeCache.set(key, shapeConfig);
    }

    /**
     * @param {RenderableShapeFactory} shapeConfigFactory
     */

  }, {
    key: 'registerRenderableShapeFactory',
    value: function registerRenderableShapeFactory(shapeConfigFactory) {
      _shapeIdsToCacheKeyCalculators[shapeConfigFactory.shapeId] = shapeConfigFactory.getCacheId;
    }

    // TODO: Add support for un-registering shapes.

  }]);

  return RenderableShapeStore;
}();

/**
 * @param {RenderableShapeConfig} params
 * @returns {string}
 */

function getCacheKey(params) {
  var textureSpanStr = params.textureSpan ? ':' + params.textureSpan.minX + ',' + params.textureSpan.minY + ',' + params.textureSpan.maxX + ',' + ('' + params.textureSpan.maxY) : '';

  return params.shapeId + ':' + params.isUsingSphericalNormals + textureSpanStr;
}

var _shapeIdsToCacheKeyCalculators = {};

var renderableShapeStore = new RenderableShapeStore();
exports.renderableShapeStore = renderableShapeStore;
exports.getCacheKey = getCacheKey;

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capsuleRenderableShapeFactory = undefined;

var _util = require('../../../util');

var _renderableShapeStore = require('../renderable-shape-store');

// TODO: Once I have a better camera in place, test that these texture coordinate calculations are
// correct.

/**
 * @param {CapsuleRenderableShapeParams} params
 * @returns {RenderableShape}
 */
/**
 * This module defines a configuration factory for a capsule shape.
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 */

function _calculateCapsuleTopShape(params) {
  // Calculate the positions.
  // TODO: This uses lat-long spheres for the ends of the capsule. Use icospheres instead.
  var individualVertexPositions = (0, _util.calculateSphericalSection)(0, params.divisionsCount / 2, Math.PI / params.divisionsCount, 0, params.divisionsCount, _util.TWO_PI / params.divisionsCount);

  // Calculate the indices and normals.
  var vertexPositions = void 0;
  var vertexIndices = void 0;
  var vertexNormals = void 0;
  if (!params.isUsingSphericalNormals) {
    // If we use orthogonal normals, then we cannot use vertexIndices.
    vertexPositions = individualVertexPositions;
    vertexIndices = null;
    vertexNormals = (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);
  } else {
    var _dedupVertexArrayWith = (0, _util.dedupVertexArrayWithPositionsAndIndicesArrays)(individualVertexPositions);

    vertexPositions = _dedupVertexArrayWith.vertexPositions;
    vertexIndices = _dedupVertexArrayWith.vertexIndices;

    vertexNormals = vertexPositions;
  }

  var textureCoordinates = (0, _util.calculateLatLongTextureCoordinates)(vertexPositions);

  var scale = void 0;
  var translation = void 0;

  // Scale and translate the positions.
  scale = params.radius;
  translation = params.capsuleEndPointsDistance / 2;
  for (var i = 0, count = vertexPositions.length; i < count; i += 3) {
    vertexPositions[i] *= scale;
    vertexPositions[i + 1] *= scale;
    vertexPositions[i + 2] = vertexPositions[i + 2] * scale + translation;
  }

  // Scale and translate the texture coordinates.
  scale = params.radius / (params.radius + params.capsuleEndPointsDistance);
  translation = 1 - scale;
  for (var _i = 1, _count = textureCoordinates.length; _i < _count; _i += 2) {
    textureCoordinates[_i] = textureCoordinates[_i] * scale + translation;
  }

  var elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    textureCoordinates: textureCoordinates,
    vertexIndices: vertexIndices,
    elementCount: elementCount
  };
}

/**
 * @param {CapsuleRenderableShapeParams} params
 * @returns {RenderableShape}
 */
function _calculateCapsuleBottomShape(params) {
  // Calculate the positions.
  // TODO: This uses lat-long spheres for the ends of the capsule. Use icospheres instead.
  var individualVertexPositions = (0, _util.calculateSphericalSection)(params.divisionsCount / 2, params.divisionsCount, Math.PI / params.divisionsCount, 0, params.divisionsCount, _util.TWO_PI / params.divisionsCount);

  // Calculate the indices and normals.
  var vertexPositions = void 0;
  var vertexIndices = void 0;
  var vertexNormals = void 0;
  if (!params.isUsingSphericalNormals) {
    // If we use orthogonal normals, then we cannot use vertexIndices.
    vertexPositions = individualVertexPositions;
    vertexIndices = null;
    vertexNormals = (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);
  } else {
    var positionsAndIndices = (0, _util.dedupVertexArrayWithPositionsAndIndicesArrays)(individualVertexPositions);
    vertexPositions = positionsAndIndices.vertexPositions;
    vertexIndices = positionsAndIndices.vertexIndices;
    vertexNormals = vertexPositions;
  }

  var textureCoordinates = (0, _util.calculateLatLongTextureCoordinates)(vertexPositions);

  var scale = void 0;
  var translation = void 0;

  // Scale and translate the positions.
  scale = params.radius;
  translation = -params.capsuleEndPointsDistance / 2;
  for (var i = 0, count = vertexPositions.length; i < count; i += 3) {
    vertexPositions[i] *= scale;
    vertexPositions[i + 1] *= scale;
    vertexPositions[i + 2] = vertexPositions[i + 2] * scale + translation;
  }

  // Scale and translate the texture coordinates.
  scale = params.radius / (params.radius + params.capsuleEndPointsDistance);
  translation = 0;
  for (var _i2 = 1, _count2 = textureCoordinates.length; _i2 < _count2; _i2 += 2) {
    textureCoordinates[_i2] = textureCoordinates[_i2] * scale + translation;
  }

  var elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    textureCoordinates: textureCoordinates,
    vertexIndices: vertexIndices,
    elementCount: elementCount
  };
}

/**
 * @param {CapsuleRenderableShapeParams} params
 * @returns {RenderableShape}
 */
function _calculateCapsuleMiddleShape(params) {
  var scale = void 0;
  var translation = void 0;

  // Calculate the positions.
  translation = params.capsuleEndPointsDistance / 2;
  var individualVertexPositions = (0, _util.calculateCylindricalSection)(-translation, translation, 0, params.divisionsCount, _util.TWO_PI / params.divisionsCount);

  var vertexPositions = void 0;
  var vertexIndices = void 0;
  var vertexNormals = void 0;

  // Calculate the vertex indices and normals.
  if (!params.isUsingSphericalNormals) {
    // If we use orthogonal normals, then we cannot use vertexIndices.
    vertexPositions = individualVertexPositions;
    vertexIndices = null;
    vertexNormals = (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);
  } else {
    var positionsAndIndices = (0, _util.dedupVertexArrayWithPositionsAndIndicesArrays)(individualVertexPositions);
    vertexPositions = positionsAndIndices.vertexPositions;
    vertexIndices = positionsAndIndices.vertexIndices;

    // Calculate the vertex normals.
    vertexNormals = vertexPositions.map(function (coord, index) {
      return index % 3 === 2 ? 0 : coord;
    });
  }

  // Calculate the texture coordinates.
  var textureCoordinates = (0, _util.calculateCylindricalTextureCoordinates)(vertexPositions);

  // Scale the x and y position coordinates.
  scale = params.radius;
  for (var i = 0, count = vertexPositions.length; i < count; i += 3) {
    vertexPositions[i] *= scale;
    vertexPositions[i + 1] *= scale;
  }

  // Scale and translate the texture coordinates.
  scale = params.capsuleEndPointsDistance / (params.radius + params.capsuleEndPointsDistance);
  translation = (1 - scale) / 2;
  for (var _i3 = 1, _count3 = textureCoordinates.length; _i3 < _count3; _i3 += 2) {
    textureCoordinates[_i3] = textureCoordinates[_i3] * scale + translation;
  }

  var elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    textureCoordinates: textureCoordinates,
    vertexIndices: vertexIndices,
    elementCount: elementCount
  };
}

var capsuleRenderableShapeFactory = {
  shapeId: 'CAPSULE',

  /**
   * @param {CapsuleRenderableShapeParams} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    // Ensure the divisions count is even.
    if (params.divisionsCount % 2 === 1) {
      params.divisionsCount++;
    }

    // The capsule's sub-shapes.
    var topShape = _calculateCapsuleTopShape(params);
    var bottomShape = _calculateCapsuleBottomShape(params);
    var middleShape = _calculateCapsuleMiddleShape(params);

    // Concatenate positions, normals, texture coordinates, and indices.
    var vertexPositions = topShape.vertexPositions.concat(middleShape.vertexPositions, bottomShape.vertexPositions);
    var vertexNormals = topShape.vertexNormals.concat(middleShape.vertexNormals, bottomShape.vertexNormals);
    var textureCoordinates = topShape.textureCoordinates.concat(middleShape.textureCoordinates, bottomShape.textureCoordinates);
    var vertexIndices = topShape.vertexIndices ? topShape.vertexIndices.concat(middleShape.vertexIndices, bottomShape.vertexIndices) : null;
    var elementCount = topShape.elementCount + middleShape.elementCount + bottomShape.elementCount;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: elementCount
    };
  },

  /**
   * @param {CapsuleRenderableShapeParams} params
   * @returns {string}
   */
  getCacheId: function getCacheId(params) {
    return (0, _renderableShapeStore.getCacheKey)(params) + ':' + params.divisionsCount;
  }
};

exports.capsuleRenderableShapeFactory = capsuleRenderableShapeFactory;

/**
 * @typedef {SphericalRenderableShapeParams} CapsuleRenderableShapeParams
 * @property {number} radius
 * @property {number} capsuleEndPointsDistance The distance between the centers of the spheres on
 * either end of the capsule.
 */

},{"../../../util":50,"../renderable-shape-store":40}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubeRenderableShapeFactory = undefined;

var _renderableShapeStore = require('../renderable-shape-store');

var VERTEX_COORDINATE = 0.5; /**
                              * This model defines a shape configuration factory for a cube.
                              *
                              * This cube is one unit long on each side.
                              */

var vertexPositions = [
// Front face
-VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE,
// Back face
-VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE,
// Top face
-VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE,
// Bottom face
-VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
// Right face
VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,
// Left face
-VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE];

var orthogonalVertexNormals = [
// Front face
0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
// Back face
0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
// Top face
0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
// Bottom face
0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
// Right face
1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
// Left face
-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];

var textureCoordinates = [
// Front face
1, 0, 0, 0, 0, 1, 1, 1,
// Back face
1, 0, 0, 0, 0, 1, 1, 1,
// Top face
1, 0, 0, 0, 0, 1, 1, 1,
// Bottom face
1, 0, 0, 0, 0, 1, 1, 1,
// Right face
1, 0, 0, 0, 0, 1, 1, 1,
// Left face
1, 0, 0, 0, 0, 1, 1, 1];

// This array defines each face as two triangles, using the indices into the vertex array
// to specify each triangle's position.
var vertexIndices = [
// Front face
0, 1, 2, 0, 2, 3,
// Back face
4, 5, 6, 4, 6, 7,
// Top face
8, 9, 10, 8, 10, 11,
// Bottom face
12, 13, 14, 12, 14, 15,
// Right face
16, 17, 18, 16, 18, 19,
// Left face
20, 21, 22, 20, 22, 23];

var cubeRenderableShapeFactory = {
  shapeId: 'CUBE',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    var vertexNormals = params.isUsingSphericalNormals ? vertexPositions : orthogonalVertexNormals;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: vertexIndices.length
    };
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {string}
   */
  getCacheId: function getCacheId(params) {
    return (0, _renderableShapeStore.getCacheKey)(params);
  }
};

exports.cubeRenderableShapeFactory = cubeRenderableShapeFactory;

},{"../renderable-shape-store":40}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.icosahedronRenderableShapeFactory = undefined;

var _util = require('../../../util');

var _renderableShapeStore = require('../renderable-shape-store');

// The corners of a unit icosahedron with vertices aligned with the y-axis.
/**
 * This model defines a shape configuration factory for a regular icosahedron.
 *
 * The shape is centered around the origin.
 */

var individualVertexPositions = [-0.525731086730957, -0.7236068248748779, 0.4472135901451111, 0.525731086730957, -0.7236068248748779, 0.4472135901451111, -0.525731086730957, 0.7236068248748779, -0.4472135901451111, 0.525731086730957, 0.7236068248748779, -0.4472135901451111, 0, 0, 1, 0, 0.8944271802902222, 0.44721361994743347, 0, -0.8944271802902222, -0.44721361994743347, 0, 0, -1, 0.8506508469581604, 0.27639320492744446, 0.4472135901451111, -0.8506508469581604, 0.27639320492744446, 0.4472135901451111, 0.8506508469581604, -0.27639320492744446, -0.4472135901451111, -0.8506508469581604, -0.27639320492744446, -0.4472135901451111];

var individualVertexIndices = [1, 4, 0, 4, 9, 0, 4, 5, 9, 8, 5, 4, 1, 8, 4, 1, 10, 8, 10, 3, 8, 8, 3, 5, 3, 2, 5, 3, 7, 2, 3, 10, 7, 10, 6, 7, 6, 11, 7, 6, 0, 11, 6, 1, 0, 10, 1, 6, 11, 0, 9, 2, 11, 9, 5, 2, 9, 11, 2, 7];

var vertexPositionsExpandedAroundSeam = null;
var vertexIndicesExpandedAroundSeam = null;
var textureCoordinates = null;

var icosahedronRenderableShapeFactory = {
  shapeId: 'ICOSAHEDRON',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    var vertexPositions = void 0;
    var vertexIndices = void 0;

    if (!vertexPositionsExpandedAroundSeam) {
      // Calculate the modified positions and indices.
      var positionsAndIndices = (0, _util.expandVertexIndicesAroundLongitudeSeam)(individualVertexPositions, individualVertexIndices);
      vertexPositionsExpandedAroundSeam = positionsAndIndices.vertexPositions;
      vertexIndicesExpandedAroundSeam = positionsAndIndices.vertexIndices;
    }

    vertexPositions = vertexPositionsExpandedAroundSeam;
    vertexIndices = vertexIndicesExpandedAroundSeam;

    var vertexNormals = void 0;
    // If we use orthogonal normals, then we cannot use vertexIndices.
    if (!params.isUsingSphericalNormals) {
      vertexPositions = (0, _util.expandVertexIndicesToDuplicatePositions)(vertexPositions, vertexIndices);
      vertexIndices = null;
      vertexNormals = (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);
    } else {
      vertexNormals = vertexPositions;
    }

    textureCoordinates = textureCoordinates ? textureCoordinates : (0, _util.calculateLatLongTextureCoordinates)(vertexPositions);

    var elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: elementCount
    };
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {string}
   */
  getCacheId: function getCacheId(params) {
    return (0, _renderableShapeStore.getCacheKey)(params);
  }
};

exports.icosahedronRenderableShapeFactory = icosahedronRenderableShapeFactory;

},{"../../../util":50,"../renderable-shape-store":40}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.icosphereRenderableShapeFactory = undefined;

var _util = require('../../../util');

var _renderableShapeStore = require('../renderable-shape-store');

var _renderableShapeFactory = require('../renderable-shape-factory');

var icosphereRenderableShapeFactory = {
  shapeId: 'ICOSPHERE',

  /**
   * @param {IcosphereRenderableShapeParams} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    params.divisionsCount = Math.max(params.divisionsCount, 1);

    var copyParams = (0, _util.deepCopy)(params);
    copyParams.shapeId = params.baseShapeId || 'ICOSAHEDRON';
    var baseRenderableShape = _renderableShapeFactory.renderableShapeFactory.getRenderableShape(copyParams);

    // Calculate the positions and indices.

    var _tesselateSphere = (0, _util.tesselateSphere)(params.divisionsCount, baseRenderableShape.vertexPositions, baseRenderableShape.vertexIndices),
        vertexPositions = _tesselateSphere.vertexPositions,
        vertexIndices = _tesselateSphere.vertexIndices;

    var _expandVertexIndicesA = (0, _util.expandVertexIndicesAroundLongitudeSeam)(vertexPositions, vertexIndices);

    vertexPositions = _expandVertexIndicesA.vertexPositions;
    vertexIndices = _expandVertexIndicesA.vertexIndices;

    var vertexNormals = void 0;
    // If we use orthogonal normals, then we cannot use vertexIndices.
    if (!params.isUsingSphericalNormals) {
      vertexPositions = (0, _util.expandVertexIndicesToDuplicatePositions)(vertexPositions, vertexIndices);
      vertexIndices = null;
      vertexNormals = (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);
    } else {
      vertexNormals = vertexPositions;
    }

    var textureCoordinates = (0, _util.calculateLatLongTextureCoordinates)(vertexPositions);

    var elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: elementCount
    };
  },

  /**
   * @param {IcosphereRenderableShapeParams} params
   * @returns {string}
   */
  getCacheId: function getCacheId(params) {
    return (0, _renderableShapeStore.getCacheKey)(params) + ':' + params.divisionsCount;
  }
}; /**
    * This module defines logic that creates a spherical shape configuration by taking a shape,
    * sub-dividing each of its triangles, and projecting each new vertex onto the edge of a sphere.
    *
    * This is technically only an "icosphere" if the starting shape is an icosahedron.
    *
    * This shape also is known as a "geosphere".
    *
    * The shape is centered around the origin.
    */

exports.icosphereRenderableShapeFactory = icosphereRenderableShapeFactory;

/**
 * @typedef {SphericalRenderableShapeParams} IcosphereRenderableShapeParams
 * @property {string} baseShapeId The ID of the base renderable shape that will be sub-divided to
 * create this icosphere shape.
 */

},{"../../../util":50,"../renderable-shape-factory":39,"../renderable-shape-store":40}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.latLongSphereRenderableShapeFactory = undefined;

var _util = require('../../../util');

var _renderableShapeStore = require('../renderable-shape-store');

/**
 * This module defines a configuration factory for a spherical shape whose vertices lie along
 * latitude and longitude lines.
 *
 * This shape also is known as a "UV sphere".
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 */

/**
 * @param {number} divisionsCount
 * @returns {Array.<Number>}
 * @private
 */
function _calculateLatLongSpherePositions(divisionsCount) {
  var deltaPitch = Math.PI / divisionsCount;
  var deltaAzimuth = _util.TWO_PI / divisionsCount;

  return (0, _util.calculateSphericalSection)(0, divisionsCount, deltaPitch, 0, divisionsCount, deltaAzimuth);
}

var latLongSphereRenderableShapeFactory = {
  shapeId: 'LAT_LONG_SPHERE',

  /**
   * @param {SphericalRenderableShapeParams} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    // Calculate the positions.
    var individualVertexPositions = _calculateLatLongSpherePositions(params.divisionsCount);

    // Calculate the indices and normals.
    var vertexPositions = void 0;
    var vertexIndices = void 0;
    var vertexNormals = void 0;
    if (!params.isUsingSphericalNormals) {
      // If we use orthogonal normals, then we cannot use vertexIndices.
      vertexPositions = individualVertexPositions;
      vertexIndices = null;
      vertexNormals = (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);
    } else {
      var _dedupVertexArrayWith = (0, _util.dedupVertexArrayWithPositionsAndIndicesArrays)(individualVertexPositions);

      vertexPositions = _dedupVertexArrayWith.vertexPositions;
      vertexIndices = _dedupVertexArrayWith.vertexIndices;

      vertexNormals = vertexPositions;
    }

    var textureCoordinates = (0, _util.calculateLatLongTextureCoordinates)(vertexPositions);

    var elementCount = vertexIndices ? vertexIndices.length : vertexPositions.length / 3;

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: vertexIndices,
      elementCount: elementCount
    };
  },

  /**
   * @param {SphericalRenderableShapeParams} params
   * @returns {string}
   */
  getCacheId: function getCacheId(params) {
    return (0, _renderableShapeStore.getCacheKey)(params) + ':' + params.divisionsCount;
  }
};

exports.latLongSphereRenderableShapeFactory = latLongSphereRenderableShapeFactory;

},{"../../../util":50,"../renderable-shape-store":40}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tetrahedronRenderableShapeFactory = undefined;

var _util = require('../../../util');

var _renderableShapeStore = require('../renderable-shape-store');

/**
 * This model defines a shape configuration factory for a regular tetrahedron.
 *
 * The shape is centered around the origin.
 */

// ||(VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE)|| = 1
var VERTEX_COORDINATE = 0.5773502588272095;

var vertexPositions = [
// Left-top-near face
VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE,

// Right-top-far face
VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE,

// Right-bottom-near face
VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE,

// Left-bottom-far face
-VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, -VERTEX_COORDINATE, VERTEX_COORDINATE, -VERTEX_COORDINATE];

// 1 - Math.sqrt(3) / 2
var TEXTURE_BASE_COORDINATE = 0.13397459621;

var textureCoordinates = [
// Left-top-near face
0, TEXTURE_BASE_COORDINATE, 0.5, 1, 1, TEXTURE_BASE_COORDINATE,

// Right-top-far face
0, TEXTURE_BASE_COORDINATE, 0.5, 1, 1, TEXTURE_BASE_COORDINATE,

// Right-bottom-near face
0, TEXTURE_BASE_COORDINATE, 0.5, 1, 1, TEXTURE_BASE_COORDINATE,

// Left-bottom-far face
0, TEXTURE_BASE_COORDINATE, 0.5, 1, 1, TEXTURE_BASE_COORDINATE];

var tetrahedronRenderableShapeFactory = {
  shapeId: 'TETRAHEDRON',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: function getRenderableShape(params) {
    var vertexNormals = params.isUsingSphericalNormals ? vertexPositions : (0, _util.calculateOrthogonalVertexNormals)(vertexPositions);

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: null,
      elementCount: vertexPositions.length / 3
    };
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {string}
   */
  getCacheId: function getCacheId(params) {
    return (0, _renderableShapeStore.getCacheKey)(params);
  }
};

exports.tetrahedronRenderableShapeFactory = tetrahedronRenderableShapeFactory;

},{"../../../util":50,"../renderable-shape-store":40}],47:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrafxController = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _animatex = require('../../../animatex');

var _lslPhysx = require('lsl-physx');

var _programWrapper = require('../program-wrapper');

var _util = require('../util');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This top-level Controller class initializes and runs the rest of the app.
 */
var GrafxController = function (_PersistentAnimationJ) {
  _inherits(GrafxController, _PersistentAnimationJ);

  function GrafxController() {
    _classCallCheck(this, GrafxController);

    var _this = _possibleConstructorReturn(this, (GrafxController.__proto__ || Object.getPrototypeOf(GrafxController)).call(this));

    _this._canvas = null;
    _this._gl = null;
    _this._scene = null;
    _this._currentProgramWrapper = null;
    return _this;
  }

  /**
   * Initializes the app. After this completes successfully, call run to actually start the app.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Array.<ProgramWrapperConfig>} programConfigs Configurations for program wrappers that
   * should be pre-cached before starting the rest of the app.
   * @param {Array.<String>} texturePaths Texture images that should be pre-cached before
   * starting the rest of the app.
   * @param {Function.<Scene>} sceneFactory
   * @returns {Promise}
   */

  _createClass(GrafxController, [{
    key: 'initialize',
    value: function initialize(canvas, programConfigs, texturePaths, sceneFactory) {
      var _this2 = this;

      this._canvas = canvas;

      return Promise.resolve().then(function () {
        return _this2._setUpWebGLContext();
      }).then(function () {
        return Promise.all([_this2._preCachePrograms(programConfigs), _this2._preCacheTextures(texturePaths)]);
      }).then(function () {
        return _this2._setUpScene(sceneFactory);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'reset',
    value: function reset() {
      // FIXME: Will it be easier to replace this with initialize?
      this._scene.reset();
    }

    /**
     * Runs the app. This should be called after initialize.
     *
     * A few things happen if this is run in dev mode:
     * - The draw and update steps of each frame are wrapped in a try/catch block.
     * - This method returns a Promise that rejects if an error is throw during any update or draw
     *   step and resolves when this controller has finished (currently never)
     */

  }, {
    key: 'run',
    value: function run() {
      this._startAnimator();
    }
  }, {
    key: '_startAnimator',
    value: function _startAnimator() {
      // FIXME: Decouple physx
      _animatex.animator.startJob(_lslPhysx.PhysicsEngine.instance);
      _animatex.animator.startJob(this);
    }

    /**
     * Updates the scene.
     *
     * This updates all of the current parameters for each component in the scene for the current
     * frame. However, this does not render anything. Rendering is done by a following call to the
     * draw function.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {
      this._scene.updateSelfAndChildren(currentTime, deltaTime);
    }

    /**
     * Draws the scene.
     *
     * This renders the current frame for all components in the scene. This assumes that all relevant
     * parameter updates for this frame have already been computed by a previous call to _updateScene.
     */

  }, {
    key: 'draw',
    value: function draw() {
      var _this3 = this;

      // Clear the canvas before we start drawing on it.
      this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

      // If we are using a post-processing program, then we need to render models to a framebuffer
      // rather than directly to the canvas.
      if (_programWrapper.programWrapperStore.isUsingPostProcessingPrograms) {
        (0, _util.bindFramebuffer)(this._gl, _programWrapper.programWrapperStore.modelsFramebuffer);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
      }

      // Draw each program separately. This minimizes how many times we need to switch programs by
      // grouping all of the draw calls for models that use the same program/shaders.
      _programWrapper.programWrapperStore.forEachModelProgram(function (programWrapper, drawFrameHandlers) {
        return _this3._drawModelProgram(programWrapper, drawFrameHandlers);
      });
      _programWrapper.programWrapperStore.forEachPostProcessingProgram(function (programWrapper) {
        return _this3._drawPostProcessingProgram(programWrapper);
      });
    }

    /**
     * For the given program key, this binds the registered shader program to the GL rendering context
     * and calls each of the registered draw-frame handlers.
     *
     * @param {ProgramWrapper|GroupProgramWrapper} programWrapper
     * @param {Set.<Function>} [drawFrameHandlers]
     * @private
     */

  }, {
    key: '_drawModelProgram',
    value: function _drawModelProgram(programWrapper, drawFrameHandlers) {
      // Check whether we need to switch programs (always true if there is more than one program
      // registered).
      if (this._currentProgramWrapper !== programWrapper) {
        programWrapper.setProgram(this._gl);
        this._currentProgramWrapper = programWrapper;
      }

      // Call each of the draw-frame handlers that use the current rendering program.
      drawFrameHandlers.forEach(function (drawFrameHandler) {
        return drawFrameHandler();
      });
    }

    /**
     * For the given program key, this binds the registered shader program to the GL rendering context
     * and calls each of the registered draw-frame handlers.
     *
     * @param {ProgramWrapper|GroupProgramWrapper} programWrapper
     * @private
     */

  }, {
    key: '_drawPostProcessingProgram',
    value: function _drawPostProcessingProgram(programWrapper) {
      this._currentProgramWrapper = programWrapper;
      programWrapper.draw(this._gl);
    }

    /**
     * Initializes the WebGL rendering context.
     *
     * @private
     */

  }, {
    key: '_setUpWebGLContext',
    value: function _setUpWebGLContext() {
      var _this4 = this;

      // Get the WebGL rendering context.
      try {
        this._gl = (0, _util.getWebGLContext)(this._canvas);
      } catch (e) {
        alert('WebGL is not supported by your browser! :(');
        throw e;
      }

      // Have the canvas context match the resolution of the window's viewport.
      (0, _util.bindGLContextToViewportDimensions)(this._canvas, this._gl, function () {
        return _this4._updateAspectRatio();
      });

      // Clear everything to black.
      this._gl.clearColor(0, 0, 0, 1);
      this._gl.clearDepth(1);

      // Enable depth testing.
      this._gl.enable(this._gl.DEPTH_TEST);
      this._gl.depthFunc(this._gl.LEQUAL);
    }

    /**
     * Loads, compiles, caches, and initializes some rendering programs.
     *
     * @param {Array.<ProgramWrapperConfig>} programConfigs
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_preCachePrograms',
    value: function _preCachePrograms(programConfigs) {
      var _this5 = this;

      var promises = programConfigs.map(function (config) {
        return _programWrapper.programWrapperStore.loadProgramWrapper(_this5._gl, config);
      });
      return Promise.all(promises);
    }

    /**
     * Loads, compiles, and caches some textures.
     *
     * @param {Array.<String>} texturePaths
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_preCacheTextures',
    value: function _preCacheTextures(texturePaths) {
      var _this6 = this;

      return Promise.all(texturePaths.map(function (texturePath) {
        return _programWrapper.textureStore.loadTexture(_this6._gl, texturePath);
      }));
    }

    /**
     * Initializes the scene.
     *
     * @param {Function.<Scene>} sceneFactory
     * @returns {Promise}
     * @abstract
     * @protected
     */

  }, {
    key: '_setUpScene',
    value: function _setUpScene(sceneFactory) {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * @protected
     */

  }, {
    key: '_updateAspectRatio',
    value: function _updateAspectRatio() {
      this._scene.camera.aspectRatio = (0, _util.getViewportWidth)() / (0, _util.getViewportHeight)();
      _resizeFramebuffersToMatchViewportSize(this._gl);
    }

    /**
     * @returns {mat4}
     * @protected
     */

  }, {
    key: '_getViewMatrix',
    value: function _getViewMatrix() {
      return this._scene.camera.viewMatrix;
    }

    /**
     * @returns {mat4}
     * @protected
     */

  }, {
    key: '_getProjectionMatrix',
    value: function _getProjectionMatrix() {
      return this._scene.camera.projectionMatrix;
    }
  }]);

  return GrafxController;
}(_animatex.PersistentAnimationJob);

/**
 * @param {WebGLRenderingContext} gl
 * @private
 */

function _resizeFramebuffersToMatchViewportSize(gl) {
  if (_programWrapper.programWrapperStore.isUsingPostProcessingPrograms) {
    var width = (0, _util.getViewportWidth)();
    var height = (0, _util.getViewportHeight)();

    // Update the per-model framebuffer texture.
    var texture = _programWrapper.programWrapperStore.modelsTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Update the per-model framebuffer depth render buffer.
    var renderBuffer = _programWrapper.programWrapperStore.modelsRenderBuffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // Update the post-processing framebuffer textures.
    _programWrapper.programWrapperStore.forEachPostProcessingProgram(function (programWrapper) {
      programWrapper.config.childrenFramebufferIds.forEach(function (id) {
        var texture = _programWrapper.programWrapperStore.getTexture(id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      });
    });
  }
}

exports.GrafxController = GrafxController;

},{"../../../animatex":1,"../program-wrapper":32,"../util":50,"lsl-physx":15}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class defines a light source.
 */
var Light = function Light() {
  _classCallCheck(this, Light);
}
// TODO


// TODO: Implement this.
;

exports.Light = Light;

},{}],49:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;if (getter === undefined) {
      return undefined;
    }return getter.call(receiver);
  }
};

var _models = require('../models');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * This class handles the overall scene.
 */
var Scene = function (_ModelGroupController) {
  _inherits(Scene, _ModelGroupController);

  /**
   * @param {ModelGroupControllerConfig} modelControllerParams
   */
  function Scene(modelControllerParams) {
    _classCallCheck(this, Scene);

    // Scene is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this, modelControllerParams));

    if (new.target === Scene) {
      throw new TypeError('Cannot construct Scene instances directly');
    }

    _this._getWorldTransform = function () {
      return _this.worldTransform;
    };
    _this._lights = [];
    _this._camera = null;
    return _this;
  }

  _createClass(Scene, [{
    key: 'reset',
    value: function reset() {
      _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), 'reset', this).call(this);
      this._lights.forEach(function (light) {
        return light.reset();
      });
      this._camera.reset();
    }

    /**
     * @param {DOMHighResTimeStamp} currentTime
     * @param {DOMHighResTimeStamp} deltaTime
     */

  }, {
    key: 'updateChildren',
    value: function updateChildren(currentTime, deltaTime) {
      _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), 'updateChildren', this).call(this, currentTime, deltaTime);
      this._camera.update(currentTime, deltaTime);
    }

    /** @returns {Camera} */

  }, {
    key: 'camera',
    get: function get() {
      return this._camera;
    }
  }]);

  return Scene;
}(_models.ModelGroupController);

exports.Scene = Scene;

},{"../models":25}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _geometry = require('./src/geometry');

Object.keys(_geometry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _geometry[key];
    }
  });
});

var _glUtil = require('./src/gl-util');

Object.keys(_glUtil).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _glUtil[key];
    }
  });
});

var _hashMap = require('./src/hash-map');

Object.keys(_hashMap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _hashMap[key];
    }
  });
});

var _util = require('./src/util');

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

},{"./src/geometry":51,"./src/gl-util":52,"./src/hash-map":53,"./src/util":54}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxVec3Dimension = exports.scaleAndAddQuat = exports.addRandomRotationToVector = exports.randomVec3InRange = exports.setRandomOrthogonalVec3 = exports.createRandomOrthogonalVec3 = exports.setRandomVec3 = exports.createRandomVec3 = exports.vec3ToString = exports.areVec3sEqual = exports.areClose = exports.radToDeg = exports.degToRad = exports.TWO_PI = exports.HALF_PI = exports.EPSILON = undefined;

var _util = require('./util');

var EPSILON = 0.0000001; /**
                          * This module defines a collection of static geometry utility functions.
                          */

var DEG_TO_RAD_RATIO = Math.PI / 180;
var RAD_TO_DEG_RATIO = 180 / Math.PI;
var HALF_PI = Math.PI / 2;
var TWO_PI = Math.PI * 2;

/**
 * @param {number} deg
 * @returns {number}
 */
function degToRad(deg) {
  return deg * DEG_TO_RAD_RATIO;
}

/**
 * @param {number} rad
 * @returns {number}
 */
function radToDeg(rad) {
  return rad * RAD_TO_DEG_RATIO;
}

/**
 * This checks whether two floating-point numbers are close enough that they could be equal if not
 * for round-off errors.
 *
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
function areClose(a, b) {
  var diff = a - b;
  return (diff > 0 ? diff : -diff) < EPSILON;
}

/**
 * @param {vec3} a
 * @param {vec3} b
 * @returns {boolean}
 */
function areVec3sEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * @param {vec3} v
 * @returns {string}
 */
function vec3ToString(v) {
  return '(' + v[0] + ',' + v[1] + ',' + v[2] + ')';
}

/**
 * TODO: This finds a random point with uniform probability within a cubic area, which biases the resulting vector toward the corners of this cubic area. Re-write this to produce an unbiased vector.
 *
 * @param {number} [scale=1]
 * @returns {vec3}
 */
function createRandomVec3() {
  var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  var v = vec3.create();
  return setRandomVec3(v, scale);
}

/**
 * TODO: This finds a random point with uniform probability within a cubic area, which biases the resulting vector toward the corners of this cubic area. Re-write this to produce an unbiased vector.
 *
 * @param {vec3} v
 * @param {number} [scale=1]
 * @returns {vec3}
 */
function setRandomVec3(v) {
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  vec3.set(v, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
  vec3.normalize(v, v);
  vec3.scale(v, v, scale);
  return v;
}

/**
 * Calculates a vector that is orthogonal to the given vector.
 *
 * TODO: This finds a random point with uniform probability within a cubic area, which biases the resulting vector toward the corners of this cubic area. Re-write this to produce an unbiased vector.
 *
 * @param {vec3} basis
 * @param {number} [scale=1]
 * @returns {vec3}
 */
function createRandomOrthogonalVec3(basis) {
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var result = vec3.create();
  return setRandomOrthogonalVec3(result, basis, scale);
}

/**
 * Calculates a vector that is orthogonal to the given vector.
 *
 * TODO: This finds a random point with uniform probability within a cubic area, which biases the resulting vector toward the corners of this cubic area. Re-write this to produce an unbiased vector.
 *
 * @param {vec3} result
 * @param {vec3} basis
 * @param {number} [scale=1]
 * @returns {vec3}
 */
function setRandomOrthogonalVec3(result, basis) {
  var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  setRandomVec3(result);
  // This is based on the dot and cross products and the fact that the dot product for two
  // orthogonal vectors is zero.
  result[2] = -(basis[0] * result[0] + basis[1] * result[1]) / basis[2];
  vec3.normalize(result, result);
  vec3.scale(result, result, scale);
  return result;
}

/**
 * @param {vec3} avg
 * @param {vec3} range
 * @returns {vec3}
 * @private
 */
function randomVec3InRange(avg, range) {
  var position = vec3.create();
  for (var i = 0; i < 3; i++) {
    var min = avg[i] - range[i] / 2;
    var max = avg[i] + range[i] / 2;
    position[i] = (0, _util.randomFloatInRange)(min, max);
  }
  return position;
}

/**
 * Rotates the given vector around a random orthogonal axis by a random angle within the given angle
 * bounds.
 *
 * @param {vec3} v
 * @param {number} minRotationAngle
 * @param {number} maxRotationAngle
 */
function addRandomRotationToVector(v, minRotationAngle, maxRotationAngle) {
  // Create a random orthogonal axis.
  var rotationAxis = createRandomVec3();
  vec3.cross(rotationAxis, rotationAxis, v);
  vec3.normalize(rotationAxis, rotationAxis);

  // Create a random angle.
  var rotationAngle = (0, _util.randomFloatInRange)(minRotationAngle, maxRotationAngle);

  // Create a rotation quaternion.
  var rotation = quat.create();
  quat.setAxisAngle(rotation, rotationAxis, rotationAngle);

  // Apply the rotation to the vector.
  vec3.transformQuat(v, v, rotation);
}

/**
 * @param {quat} out
 * @param {quat} a
 * @param {quat} b
 * @param {number} scale
 * @returns {quat}
 */
function scaleAndAddQuat(out, a, b, scale) {
  return quat.set(out, a[0] + b[0] * scale, a[1] + b[1] * scale, a[2] + b[2] * scale, a[3] + b[3] * scale);
}

/**
 * @param {vec3} v
 * @returns {number}
 */
function getMaxVec3Dimension(v) {
  var max = v[0] > v[1] ? v[0] : v[1];
  max = max > v[2] ? max : v[2];
  return max;
}

exports.EPSILON = EPSILON;
exports.HALF_PI = HALF_PI;
exports.TWO_PI = TWO_PI;
exports.degToRad = degToRad;
exports.radToDeg = radToDeg;
exports.areClose = areClose;
exports.areVec3sEqual = areVec3sEqual;
exports.vec3ToString = vec3ToString;
exports.createRandomVec3 = createRandomVec3;
exports.setRandomVec3 = setRandomVec3;
exports.createRandomOrthogonalVec3 = createRandomOrthogonalVec3;
exports.setRandomOrthogonalVec3 = setRandomOrthogonalVec3;
exports.randomVec3InRange = randomVec3InRange;
exports.addRandomRotationToVector = addRandomRotationToVector;
exports.scaleAndAddQuat = scaleAndAddQuat;
exports.getMaxVec3Dimension = getMaxVec3Dimension;

},{"./util":54}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scaleThenTranslatePositions = exports.calculateCylindricalSection = exports.calculateSphericalSection = exports.dedupVertexArrayWithPositionsAndIndicesArrays = exports.tesselateSphere = exports.expandVertexIndicesAroundLongitudeSeam = exports.calculateCylindricalTextureCoordinates = exports.calculateLatLongTextureCoordinates = exports.calculateOrthogonalVertexNormals = exports.expandVertexIndicesToDuplicatePositions = exports.create2DSquarePositionsConfig = exports.createRenderBuffer = exports.createTextureForRendering = exports.createFramebuffer = exports.bindFramebuffer = exports.bindGLContextToViewportDimensions = exports.createBufferFromData = exports.loadProgram = exports.loadShader = exports.buildShader = exports.buildProgram = exports.getAttribLocation = exports.createBuffer = exports.getWebGLContext = exports.getViewportHeight = exports.getViewportWidth = undefined;

var _hashMap = require('./hash-map');

var _geometry = require('./geometry');

var _util = require('./util');

var _programWrapperStore = require('../../program-wrapper/src/program-wrapper-store');

/**
 * This module defines a collection of static general utility functions for WebGL.
 */

var viewportWidth = 10;
var viewportHeight = 10;

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {?WebGLRenderingContext}
 * @throws If unable to get a WebGL context.
 */
function getWebGLContext(canvas) {
  var params = { alpha: false };
  // Try to grab the standard context. If it fails, fallback to the experimental context.
  return canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {?WebGLBuffer}
 * @throws If unable to create a buffer object.
 */
function createBuffer(gl) {
  var buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('An error occurred creating the buffer object');
  }
  return buffer;
}
// TODO: use all this helper stuff in the programWrapper logic?
/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {string} locationName
 * @returns {number}
 * @throws If unable to get an attribute location for the given name.
 */
function getAttribLocation(gl, program, locationName) {
  var attribLocation = gl.getAttribLocation(program, locationName);
  if (attribLocation < 0) {
    throw new Error('An error occurred getting the attribute location: ' + locationName);
  }
  return attribLocation;
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns {WebGLProgram}
 * @throws If unable to link the program.
 */
function buildProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var infoLog = gl.getProgramInfoLog(program);
    console.error('An error occurred linking the shader program', infoLog);
    throw new Error('An error occurred linking the shader program');
  }

  return program;
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} shaderSource
 * @param {boolean} isFragmentShader
 * @returns {WebGLShader}
 * @throws If unable to compile the shader.
 */
function buildShader(gl, shaderSource, isFragmentShader) {
  var shaderType = isFragmentShader ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER;
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var infoLog = gl.getShaderInfoLog(shader);
    console.error('An error occurred compiling the shader', infoLog);
    throw new Error('An error occurred compiling the shader');
  }

  return shader;
}

/**
 * Loads a shader program by scouring the current document, looking for a script with the specified
 * ID.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} url
 * @returns {Promise.<WebGLShader, Error>}
 */
function loadShader(gl, url) {
  return (0, _util.loadText)(url).then(function (shaderSource) {
    return buildShader(gl, shaderSource, url.endsWith('.frag'));
  });
}

/**
 * Loads the shader source code from the given URLs, compiles the shader source code, and creates
 * a program from the resulting shaders.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderUrl
 * @param {string} fragmentShaderUrl
 * @returns {Promise.<WebGLProgram, Error>}
 * @throws If any error occurs while loading and building the shaders and program.
 */
function loadProgram(gl, vertexShaderUrl, fragmentShaderUrl) {
  return Promise.all([vertexShaderUrl, fragmentShaderUrl].map(function (url) {
    return loadShader(gl, url);
  })).then(function (shaders) {
    var vertexShader = shaders[0];
    var fragmentShader = shaders[1];

    return buildProgram(gl, vertexShader, fragmentShader);
  });
}

/**
 * Create, bind, and move the given raw data into a WebGL buffer.
 *
 * @param {WebGLRenderingContext} gl
 * @param {Array.<Number>} rawData A plain, flat array containing the data to bind to a buffer.
 * @param {number} [target=gl.ARRAY_BUFFER] An enum describing the type of this buffer; one of:
 *   - gl.ARRAY_BUFFER,
 *   - gl.ELEMENT_ARRAY_BUFFER.
 * @param {number} [usage=gl.STATIC_DRAW] An enum describing how this buffer is going to be used;
 * one of:
 *   - gl.STATIC_DRAW,
 *   - gl.DYNAMIC_DRAW,
 *   - gl.STREAM_DRAW.
 * @returns {WebGLBuffer}
 */
function createBufferFromData(gl, rawData, target, usage) {
  target = target || gl.ARRAY_BUFFER;
  usage = usage || gl.STATIC_DRAW;
  var typedArray = target === gl.ARRAY_BUFFER ? new Float32Array(rawData) : new Uint16Array(rawData);

  var buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, typedArray, usage);

  // Making the original data visible on the buffer object is helpful for debugging.
  if (_util.isInDevMode) {
    buffer.rawData = typedArray;
  }

  return buffer;
}

/**
 * Adjusts the dimensions of the given element to match those of the viewport. Also, when the
 * viewport is resized, the given element will also be resized to match.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {WebGLRenderingContext} gl
 * @param {Function} onGLResized
 * @param {?Number} [updateInterval=150]
 */
function bindGLContextToViewportDimensions(canvas, gl, onGLResized) {
  var updateInterval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 150;

  _resizeGLContextToMatchViewportDimensions(canvas, gl);
  var debouncedResize = (0, _util.debounce)(function (_) {
    _resizeGLContextToMatchViewportDimensions(canvas, gl);
    onGLResized();
  }, updateInterval);
  window.addEventListener('resize', debouncedResize);
}

/**
 * Resizes the given element to match the dimensions of the viewport components.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {WebGLRenderingContext} gl
 * @private
 */
function _resizeGLContextToMatchViewportDimensions(canvas, gl) {
  // Account for high-definition DPI displays.
  var devicePixelToCssPixelRatio = window.devicePixelRatio || 1;
  viewportWidth = Math.floor(canvas.clientWidth * devicePixelToCssPixelRatio);
  viewportHeight = Math.floor(canvas.clientHeight * devicePixelToCssPixelRatio);
  canvas.width = viewportWidth;
  canvas.height = viewportHeight;
  gl.viewport(0, 0, viewportWidth, viewportHeight);
}

/**
 * @returns {number}
 */
function getViewportWidth() {
  return viewportWidth;
}

/**
 * @returns {number}
 */
function getViewportHeight() {
  return viewportHeight;
}

/**
 * Binds a framebuffer to the GL context.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLFramebuffer} framebuffer
 */
function bindFramebuffer(gl, framebuffer, width, height) {
  // FIXME: Remove or add back in?
  // width = width || getViewportWidth();
  // height = height || getViewportHeight();

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  // FIXME: Remove or add back in?
  // gl.viewport(0, 0, width, height);
}

/**
 * Creates a framebuffer and attaches a texture to the framebuffer.
 *
 * This means that when we bind to the framebuffer, draw calls will render to the given texture.
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLTexture} texture
 * @param {WebGLRenderBuffer} [renderBuffer]
 * @returns {WebGLFramebuffer}
 */
function createFramebuffer(gl, texture, renderBuffer) {
  var framebuffer = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (renderBuffer) {
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
  }

  return framebuffer;
}

/**
 * Creates a texture for rendering to.
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} [width] Defaults to the viewport width stored in gl-util.
 * @param {number} [height] Defaults to the viewport height stored in gl-util.
 * @returns {WebGLTexture}
 */
function createTextureForRendering(gl, width, height) {
  width = width || getViewportWidth();
  height = height || getViewportHeight();

  // TODO: Double-check these params
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  return texture;
}

/**
 * Creates a render buffer.
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} [width] Defaults to the viewport width stored in gl-util.
 * @param {number} [height] Defaults to the viewport height stored in gl-util.
 * @returns {WebGLRenderBuffer}
 */
function createRenderBuffer(gl, width, height) {
  width = width || getViewportWidth();
  height = height || getViewportHeight();

  var renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

  return renderBuffer;
}

var _SQUARE_COORDINATES_2D = [0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1];

/**
 * @param {WebGLRenderingContext} gl
 * @returns {AttributeConfig}
 */
function create2DSquarePositionsConfig(gl) {
  var positionsBuffer = createBufferFromData(gl, _SQUARE_COORDINATES_2D);
  return {
    buffer: positionsBuffer,
    size: 2,
    type: gl.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0
  };
}

//
// Geometrical calculations.
//

/**
 * Given an array of individual vertex positions and an array of vertex indices, creates an expanded
 * array of the positions grouped by the triangles they form.
 *
 * @param {Array.<Number>} individualVertexPositions
 * @param {Array.<Number>} vertexIndices
 * @returns {Array.<Number>}
 */
function expandVertexIndicesToDuplicatePositions(individualVertexPositions, vertexIndices) {
  var expandedVertexPositions = [];

  for (var i = 0, j = 0, k = 0, count = vertexIndices.length; i < count; i++, k += 3) {
    j = vertexIndices[i] * 3;

    expandedVertexPositions[k] = individualVertexPositions[j];
    expandedVertexPositions[k + 1] = individualVertexPositions[j + 1];
    expandedVertexPositions[k + 2] = individualVertexPositions[j + 2];
  }

  return expandedVertexPositions;
}

/**
 * Computes normal vectors that are each orthogonal to the triangles they are a part of.
 *
 * The given vertices should represent individual triangles whose vertices are defined in clockwise
 * order (as seen when looking at the exterior side).
 *
 * @param {Array.<Number>} vertices
 * @returns {Array.<Number>}
 */
function calculateOrthogonalVertexNormals(vertices) {
  var vertex1 = vec3.create();
  var vertex2 = vec3.create();
  var vertex3 = vec3.create();
  var vectorA = vec3.create();
  var vectorB = vec3.create();
  var normal1 = vec3.create();
  var normal2 = vec3.create();
  var normal3 = vec3.create();

  var normals = [];

  // Loop over each triangle in the flattened vertex array.
  for (var i = 0, count = vertices.length; i < count; i += 9) {
    // Get the vertices of the current triangle from the flattened array.
    vec3.set(vertex1, vertices[i + 0], vertices[i + 1], vertices[i + 2]);
    vec3.set(vertex2, vertices[i + 3], vertices[i + 4], vertices[i + 5]);
    vec3.set(vertex3, vertices[i + 6], vertices[i + 7], vertices[i + 8]);

    // Compute the normals.
    vec3.subtract(vectorA, vertex3, vertex1);
    vec3.subtract(vectorB, vertex2, vertex1);
    vec3.cross(normal1, vectorA, vectorB);
    vec3.normalize(normal1, normal1);

    vec3.subtract(vectorA, vertex1, vertex2);
    vec3.subtract(vectorB, vertex3, vertex2);
    vec3.cross(normal2, vectorA, vectorB);
    vec3.normalize(normal2, normal2);

    vec3.subtract(vectorA, vertex2, vertex3);
    vec3.subtract(vectorB, vertex1, vertex3);
    vec3.cross(normal3, vectorA, vectorB);
    vec3.normalize(normal3, normal3);

    // Save the normal vectors in a flattened array.
    normals[i + 0] = normal1[0];
    normals[i + 1] = normal1[1];
    normals[i + 2] = normal1[2];
    normals[i + 3] = normal2[0];
    normals[i + 4] = normal2[1];
    normals[i + 5] = normal2[2];
    normals[i + 6] = normal3[0];
    normals[i + 7] = normal3[1];
    normals[i + 8] = normal3[2];
  }

  return normals;
}

var MAX_TEXTURE_V_COORDINATE_DELTA = 0.5;

/**
 * Calculates lat-long texture coordinates for the given vertex positions.
 *
 * @param {Array.<Number>} vertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function calculateLatLongTextureCoordinates(vertexPositions) {
  var currentVertexPosition = vec3.create();
  var currentTextureCoordinates = vec2.create();
  var textureCoordinates = [];

  // Calculate the texture coordinates of each vertex.
  for (var i = 0, j = 0, count = vertexPositions.length; i < count; i += 3, j += 2) {
    vec3.set(currentVertexPosition, vertexPositions[i], vertexPositions[i + 1], vertexPositions[i + 2]);
    _getTextureCoordinatesOfLatLongPosition(currentTextureCoordinates, currentVertexPosition);
    textureCoordinates[j] = currentTextureCoordinates[0];
    textureCoordinates[j + 1] = currentTextureCoordinates[1];
  }

  _correctTextureForTrianglesAroundSeam(textureCoordinates);

  return textureCoordinates;
}

/**
 * Calculates cylindrical texture coordinates for the given vertex positions.
 *
 * This assumes the cylinder is aligned with the z-axis and centered at the origin.
 *
 * @param {Array.<Number>} vertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function calculateCylindricalTextureCoordinates(vertexPositions) {
  var currentVertexPosition = vec3.create();
  var currentTextureCoordinates = vec2.create();
  var textureCoordinates = [];

  // Calculate the texture coordinates of each vertex.
  for (var i = 0, j = 0, count = vertexPositions.length; i < count; i += 3, j += 2) {
    vec3.set(currentVertexPosition, vertexPositions[i], vertexPositions[i + 1], vertexPositions[i + 2]);
    _getTextureCoordinatesOfCylindricalPosition(currentTextureCoordinates, currentVertexPosition);
    textureCoordinates[j] = currentTextureCoordinates[0];
    textureCoordinates[j + 1] = currentTextureCoordinates[1];
  }

  _correctTextureForTrianglesAroundSeam(textureCoordinates);

  return textureCoordinates;
}

/**
 * @param {Array.<Number>} textureCoordinates
 */
function _correctTextureForTrianglesAroundSeam(textureCoordinates) {
  var v1 = void 0;
  var v2 = void 0;
  var v3 = void 0;

  // Determine which triangles span the seam across 0/2PI, and correct their textures.
  for (var i = 0, count = textureCoordinates.length; i < count; i += 6) {
    v1 = textureCoordinates[i];
    v2 = textureCoordinates[i + 2];
    v3 = textureCoordinates[i + 4];

    if (v3 - v1 > MAX_TEXTURE_V_COORDINATE_DELTA || v2 - v1 > MAX_TEXTURE_V_COORDINATE_DELTA) {
      textureCoordinates[i]++;
    }
    if (v3 - v2 > MAX_TEXTURE_V_COORDINATE_DELTA || v1 - v2 > MAX_TEXTURE_V_COORDINATE_DELTA) {
      textureCoordinates[i + 2]++;
    }
    if (v2 - v3 > MAX_TEXTURE_V_COORDINATE_DELTA || v1 - v3 > MAX_TEXTURE_V_COORDINATE_DELTA) {
      textureCoordinates[i + 4]++;
    }
  }
}

/**
 * Calculate the texture coordinates for a normalized point on a globe.
 *
 * @param {vec2} textureCoordinates Output parameter.
 * @param {vec3} vertexPosition Input parameter.
 * @private
 */
function _getTextureCoordinatesOfLatLongPosition(textureCoordinates, vertexPosition) {
  var x = vertexPosition[0];
  var y = vertexPosition[1];
  var z = vertexPosition[2];

  var longitude = void 0;
  if (y !== 0) {
    longitude = Math.atan2(x, y);
  } else if (x > 0) {
    longitude = _geometry.HALF_PI;
  } else {
    longitude = -_geometry.HALF_PI;
  }

  var u = (longitude + Math.PI) / _geometry.TWO_PI;

  // TODO: Should I instead be calculating the v value from wrapping the texture around the globe
  // curvature rather than simply projecting it directly?

  // This assumes that the texture has been vertically distorted so that it can be directly
  // projected onto the curvature of the globe.
  var v = (z + 1) * 0.5;

  textureCoordinates[0] = u;
  textureCoordinates[1] = v;
}

/**
 * Calculate the texture coordinates for a normalized point on a cylinder.
 *
 * This assumes the cylinder is aligned with the z-axis and centered at the origin.
 *
 * @param {vec2} textureCoordinates Output parameter.
 * @param {vec3} vertexPosition Input parameter.
 * @private
 */
function _getTextureCoordinatesOfCylindricalPosition(textureCoordinates, vertexPosition) {
  var x = vertexPosition[0];
  var y = vertexPosition[1];
  var z = vertexPosition[2];

  var longitude = void 0;
  if (y !== 0) {
    longitude = Math.atan2(x, y);
  } else if (x > 0) {
    longitude = _geometry.HALF_PI;
  } else {
    longitude = -_geometry.HALF_PI;
  }

  var u = (longitude + Math.PI) / _geometry.TWO_PI;

  var v = z > 0 ? 1 : 0;

  textureCoordinates[0] = u;
  textureCoordinates[1] = v;
}

/**
 * Expands the given vertices around the seam where longitude switches from 0 to 2PI.
 *
 * This is useful because, when applying a spherical texture using lat-long coordinates, any
 * triangle that spans the seam (from longitude 2PI to 0) would otherwise show the wrong result.
 *
 * @param {Array.<Number>} oldVertexPositions
 * @param {Array.<Number>} oldVertexIndices
 * @returns {{vertexPositions: Array.<Number>, vertexIndices: Array.<Number>}}
 */
function expandVertexIndicesAroundLongitudeSeam(oldVertexPositions, oldVertexIndices) {
  // const newVertexPositions = [];
  // const newVertexIndices = [];
  //
  // ****
  // // TODO: loop over triangles, use _getTextureCoordinatesOfLatLongPosition on each vertex,
  // // check if two vertices in a triangle span the seam; to check the span, just check if both are
  // // within a distance from the seam, but on opposite ends;
  //
  // return {
  //   vertexPositions: newVertexPositions,
  //   vertexIndices: newVertexIndices
  // };

  return {
    vertexPositions: oldVertexPositions,
    vertexIndices: oldVertexIndices
  };
}

/**
 * Subdivides the triangles of a shape and projects all resulting vertices to a radius of one.
 *
 * @param {number} divisionFactor
 * @param {Array.<Number>} oldPositions
 * @param {Array.<Number>} [oldIndices]
 * @returns {{vertexPositions: Array.<Number>, vertexIndices: Array.<Number>}}
 */
function tesselateSphere(divisionFactor, oldPositions, oldIndices) {
  var newPositions = _expandAndTesselateTriangles(divisionFactor, oldPositions, oldIndices);

  // Convert the expanded positions array into a unique positions array with a corresponding indices
  // array.
  var positionsAndIndices = dedupVertexArrayWithPositionsAndIndicesArrays(newPositions);

  // Project the given positions to a distance of one.
  _normalizePositions(positionsAndIndices.vertexPositions, positionsAndIndices.vertexPositions);

  return positionsAndIndices;
}

/**
 * Subdivides triangles.
 *
 * This has the side-effect of flattening the given vertices into an expanded list that can contain
 * duplicate positions.
 *
 * @param {number} divisionFactor
 * @param {Array.<Number>} oldPositions
 * @param {Array.<Number>} [oldIndices]
 * @returns {Array.<Number>}
 * @private
 */
function _expandAndTesselateTriangles(divisionFactor, oldPositions, oldIndices) {
  var expandedOldPositions = oldIndices ? expandVertexIndicesToDuplicatePositions(oldPositions, oldIndices) : oldPositions;

  var newPositions = [];
  var a = vec3.create();
  var b = vec3.create();
  var c = vec3.create();
  var aToB = vec3.create();
  var aToC = vec3.create();
  var bToC = vec3.create();
  var rowDelta = vec3.create();
  var columnDelta = vec3.create();
  var backwardsDelta = vec3.create();
  var rowStartPoint = vec3.create();
  var rowColumnStartPoint = vec3.create();
  var tempVec = vec3.create();

  var oldIndex = void 0;
  var count = void 0;
  var newIndex = void 0;
  var rowIndex = void 0;
  var columnIndex = void 0;

  //
  // The basic tesselation algorithm:
  // - Iterate across the original triangles that we are sub-dividing.
  // - A, B, and C are the vertices of the current, original triangle.
  // - Consider "rows" to iterate across the a-to-b direction and "columns" to iterate across the
  //   a-to-c direction.
  // - First calculate the distance between one row and one column.
  // - Then loop over the rows and columns and create a the new triangle for each "cell".
  //
  //                   /\
  //                 B   \--- A "column"
  //                 o    \
  //                / \   /
  //               /   \             rowDelta:      columnDelta:     backwardsDelta:
  //              o-----o                 o             o
  //             / \   / \               /               \              o-----o
  //            /   \ /   \             /                 \
  //           o-----o-----o           o                   o
  //          / \   / \   / \
  //         /   \ /   \ /   \
  //        o-----o-----o-----o
  //       / \   / \   / \   / \
  //      /   \ /   \ /   \ /   \
  //  A  o-----o-----o-----o-----o  C
  //
  //       \_____\
  //           \
  //         A "row"
  //

  // Loop over the old triangles.
  for (oldIndex = 0, newIndex = 0, count = expandedOldPositions.length; oldIndex < count; oldIndex += 9) {
    // Pull out the three vertices of the current triangle.
    vec3.set(a, expandedOldPositions[oldIndex], expandedOldPositions[oldIndex + 1], expandedOldPositions[oldIndex + 2]);
    vec3.set(b, expandedOldPositions[oldIndex + 3], expandedOldPositions[oldIndex + 4], expandedOldPositions[oldIndex + 5]);
    vec3.set(c, expandedOldPositions[oldIndex + 6], expandedOldPositions[oldIndex + 7], expandedOldPositions[oldIndex + 8]);

    vec3.subtract(aToB, b, a);
    vec3.subtract(bToC, c, b);
    vec3.subtract(aToC, c, a);

    vec3.scale(rowDelta, aToB, 1 / divisionFactor);
    vec3.scale(columnDelta, bToC, 1 / divisionFactor);
    vec3.scale(backwardsDelta, aToC, 1 / divisionFactor);

    // Loop over each new division (row) for the current triangle.
    for (rowIndex = 0; rowIndex < divisionFactor; rowIndex++) {
      vec3.scaleAndAdd(rowStartPoint, a, rowDelta, rowIndex);

      // Create the first triangle in the row (address the fence-post problem).
      newPositions[newIndex++] = rowStartPoint[0];
      newPositions[newIndex++] = rowStartPoint[1];
      newPositions[newIndex++] = rowStartPoint[2];
      vec3.add(tempVec, rowStartPoint, rowDelta);
      newPositions[newIndex++] = tempVec[0];
      newPositions[newIndex++] = tempVec[1];
      newPositions[newIndex++] = tempVec[2];
      vec3.add(tempVec, rowStartPoint, backwardsDelta);
      newPositions[newIndex++] = tempVec[0];
      newPositions[newIndex++] = tempVec[1];
      newPositions[newIndex++] = tempVec[2];

      // Loop over the new triangles in the current division.
      for (columnIndex = 1; columnIndex <= rowIndex; columnIndex++) {
        vec3.scaleAndAdd(rowColumnStartPoint, rowStartPoint, columnDelta, columnIndex);

        newPositions[newIndex++] = rowColumnStartPoint[0];
        newPositions[newIndex++] = rowColumnStartPoint[1];
        newPositions[newIndex++] = rowColumnStartPoint[2];
        vec3.subtract(tempVec, rowColumnStartPoint, columnDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];
        vec3.add(tempVec, rowColumnStartPoint, rowDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];

        newPositions[newIndex++] = rowColumnStartPoint[0];
        newPositions[newIndex++] = rowColumnStartPoint[1];
        newPositions[newIndex++] = rowColumnStartPoint[2];
        vec3.add(tempVec, rowColumnStartPoint, rowDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];
        vec3.add(tempVec, rowColumnStartPoint, backwardsDelta);
        newPositions[newIndex++] = tempVec[0];
        newPositions[newIndex++] = tempVec[1];
        newPositions[newIndex++] = tempVec[2];
      }
    }
  }

  return newPositions;
}

/**
 * Projects the given positions to a distance of one.
 *
 * @param {Array.<Number>} out
 * @param {Array.<Number>} positions
 * @private
 */
function _normalizePositions(out, positions) {
  var tempVec = vec3.create();

  for (var i = 0, count = positions.length; i < count; i += 3) {
    vec3.set(tempVec, positions[i], positions[i + 1], positions[i + 2]);

    vec3.normalize(tempVec, tempVec);

    out[i] = tempVec[0];
    out[i + 1] = tempVec[1];
    out[i + 2] = tempVec[2];
  }
}

/**
 * Given a collection of vertices that possibly contains duplicates, creates an array of the unique
 * vertex positions and an array of the indices of the original, duplicated vertices in the unique
 * array.
 *
 * This is useful for rendering using gl.drawElements (with gl.ELEMENT_ARRAY_BUFFER) instead of
 * gl.drawArrays.
 *
 * NOTE: Although this function does partially address floating-point round-off errors within the
 * given positions, it does not guarantee correctness.
 *
 * @param {Array.<Number>} oldVertexPositions
 * @returns {{vertexPositions: Array.<Number>, vertexIndices: Array.<Number>}}
 */
function dedupVertexArrayWithPositionsAndIndicesArrays(oldVertexPositions) {
  var vertexPositions = [];
  var vertexIndices = [];

  var vertexToIndexMap = new _hashMap.HashMap(_vertexHashFunction);
  var vertex = vec3.create();
  var oldCoordinateIndex = void 0;
  var oldCoordinateCount = void 0;
  var newVertexIndex = void 0;

  // Loop over the original, duplicated vertex positions.
  for (oldCoordinateIndex = 0, oldCoordinateCount = oldVertexPositions.length; oldCoordinateIndex < oldCoordinateCount; oldCoordinateIndex += 3) {
    vec3.set(vertex, oldVertexPositions[oldCoordinateIndex], oldVertexPositions[oldCoordinateIndex + 1], oldVertexPositions[oldCoordinateIndex + 2]);

    // Has this position already been recorded?
    if (!vertexToIndexMap.has(vertex)) {
      // Record the index of the unique vertex position.
      newVertexIndex = vertexPositions.length / 3;
      vertexToIndexMap.set(vertex, newVertexIndex);

      // Record the unique vertex position.
      vertexPositions.push(vertex[0]);
      vertexPositions.push(vertex[1]);
      vertexPositions.push(vertex[2]);
    }

    newVertexIndex = vertexToIndexMap.get(vertex);

    // Record the index of the unique position.
    vertexIndices.push(newVertexIndex);
  }

  return {
    vertexPositions: vertexPositions,
    vertexIndices: vertexIndices
  };
}

var _VERTEX_COORDINATE_BUCKET_SIZE_DIGITS = 4;

// This offset is important for preventing bucket-aligned numbers from being placed in inconsistent
// buckets. For example, whole integer values could easily be placed in lower or higher buckets
// depending on round-off error.
var _OFFSET = Math.random();

/**
 * Calculates a hash code for the given vertex.
 *
 * NOTE: This does not guarantee correct results. Due to round-off error, "equal" coordinates could
 * be calculated is being in different buckets. Larger bucket sizes might reduce the rate of false
 * negatives, but with the trade-off of potentially introducing false positives.
 *
 * @param {vec3} vertex
 * @returns {string}
 * @private
 */
function _vertexHashFunction(vertex) {
  return (vertex[0] + _OFFSET).toFixed(_VERTEX_COORDINATE_BUCKET_SIZE_DIGITS) + ',' + ((vertex[1] + _OFFSET).toFixed(_VERTEX_COORDINATE_BUCKET_SIZE_DIGITS) + ',') + ('' + (vertex[2] + _OFFSET).toFixed(_VERTEX_COORDINATE_BUCKET_SIZE_DIGITS));
}

/**
 * Calculate the vertex positions for a section of a sphere.
 *
 * - These points will lie along latitude-longitude lines.
 * - The shape is centered around the origin with the poles aligned with the z-axis.
 * - The radius of the circle will be one.
 *
 * @param {number} startPitchIndex
 * @param {number} endPitchIndex
 * @param {number} deltaPitch
 * @param {number} startAzimuthIndex
 * @param {number} endAzimuthIndex
 * @param {number} deltaAzimuth
 * @return {Array.<Number>}
 * @private
 */
function calculateSphericalSection(startPitchIndex, endPitchIndex, deltaPitch, startAzimuthIndex, endAzimuthIndex, deltaAzimuth) {
  var vertexPositions = [];
  var vertexPositionsIndex = 0;

  var pitchIndex = void 0;
  var azimuthIndex = void 0;
  var lowerPitch = void 0;
  var upperPitch = void 0;
  var lowerAzimuth = void 0;
  var upperAzimuth = void 0;
  var x1 = void 0;
  var y1 = void 0;
  var z1 = void 0;
  var x2 = void 0;
  var y2 = void 0;
  var z2 = void 0;
  var x3 = void 0;
  var y3 = void 0;
  var z3 = void 0;
  var x4 = void 0;
  var y4 = void 0;
  var z4 = void 0;

  // TODO: This implementation calculates all coordinates multiple times. Refactor it to be more
  // efficient.

  // Loop over each latitudinal strip.
  for (pitchIndex = startPitchIndex; pitchIndex < endPitchIndex; pitchIndex++) {
    lowerPitch = deltaPitch * pitchIndex;
    upperPitch = deltaPitch + lowerPitch;

    // Create the triangles for the strip at the current pitch.
    for (azimuthIndex = startAzimuthIndex; azimuthIndex < endAzimuthIndex; azimuthIndex++) {
      lowerAzimuth = deltaAzimuth * azimuthIndex;
      upperAzimuth = deltaAzimuth + lowerAzimuth;

      // The corners of the current square.

      x1 = Math.sin(lowerPitch) * Math.cos(lowerAzimuth);
      y1 = Math.sin(lowerPitch) * Math.sin(lowerAzimuth);
      z1 = Math.cos(lowerPitch);

      x2 = Math.sin(upperPitch) * Math.cos(lowerAzimuth);
      y2 = Math.sin(upperPitch) * Math.sin(lowerAzimuth);
      z2 = Math.cos(upperPitch);

      x3 = Math.sin(lowerPitch) * Math.cos(upperAzimuth);
      y3 = Math.sin(lowerPitch) * Math.sin(upperAzimuth);
      z3 = Math.cos(lowerPitch);

      x4 = Math.sin(upperPitch) * Math.cos(upperAzimuth);
      y4 = Math.sin(upperPitch) * Math.sin(upperAzimuth);
      z4 = Math.cos(upperPitch);

      // The first triangle.

      vertexPositions[vertexPositionsIndex] = x1;
      vertexPositions[vertexPositionsIndex + 1] = y1;
      vertexPositions[vertexPositionsIndex + 2] = z1;
      vertexPositions[vertexPositionsIndex + 3] = x2;
      vertexPositions[vertexPositionsIndex + 4] = y2;
      vertexPositions[vertexPositionsIndex + 5] = z2;
      vertexPositions[vertexPositionsIndex + 6] = x3;
      vertexPositions[vertexPositionsIndex + 7] = y3;
      vertexPositions[vertexPositionsIndex + 8] = z3;

      // The second triangle.

      vertexPositions[vertexPositionsIndex + 9] = x4;
      vertexPositions[vertexPositionsIndex + 10] = y4;
      vertexPositions[vertexPositionsIndex + 11] = z4;
      vertexPositions[vertexPositionsIndex + 12] = x3;
      vertexPositions[vertexPositionsIndex + 13] = y3;
      vertexPositions[vertexPositionsIndex + 14] = z3;
      vertexPositions[vertexPositionsIndex + 15] = x2;
      vertexPositions[vertexPositionsIndex + 16] = y2;
      vertexPositions[vertexPositionsIndex + 17] = z2;

      vertexPositionsIndex += 18;
    }
  }

  return vertexPositions;
}

/**
 * Calculate the vertex positions for a section of a cylinder.
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 *
 * @param {number} cylinderBottom
 * @param {number} cylinderTop
 * @param {number} startIndex
 * @param {number} endIndex
 * @param {number} delta
 * @returns {Array.<Number>}
 * @private
 */
function calculateCylindricalSection(cylinderBottom, cylinderTop, startIndex, endIndex, delta) {
  var vertexPositions = [];
  var vertexPositionsIndex = 0;

  var index = void 0;
  var lowerAzimuth = void 0;
  var upperAzimuth = void 0;
  var x1 = void 0;
  var y1 = void 0;
  var z1 = void 0;
  var x2 = void 0;
  var y2 = void 0;
  var z2 = void 0;
  var x3 = void 0;
  var y3 = void 0;
  var z3 = void 0;
  var x4 = void 0;
  var y4 = void 0;
  var z4 = void 0;

  // Create the triangles for the cylindrical strip.
  for (index = startIndex; index < endIndex; index++) {
    lowerAzimuth = delta * index;
    upperAzimuth = delta + lowerAzimuth;

    // The corners of the current square.

    x1 = Math.cos(lowerAzimuth);
    y1 = Math.sin(lowerAzimuth);
    z1 = cylinderBottom;

    x2 = Math.cos(lowerAzimuth);
    y2 = Math.sin(lowerAzimuth);
    z2 = cylinderTop;

    x3 = Math.cos(upperAzimuth);
    y3 = Math.sin(upperAzimuth);
    z3 = cylinderBottom;

    x4 = Math.cos(upperAzimuth);
    y4 = Math.sin(upperAzimuth);
    z4 = cylinderTop;

    // The first triangle.

    vertexPositions[vertexPositionsIndex] = x1;
    vertexPositions[vertexPositionsIndex + 1] = y1;
    vertexPositions[vertexPositionsIndex + 2] = z1;
    vertexPositions[vertexPositionsIndex + 3] = x2;
    vertexPositions[vertexPositionsIndex + 4] = y2;
    vertexPositions[vertexPositionsIndex + 5] = z2;
    vertexPositions[vertexPositionsIndex + 6] = x3;
    vertexPositions[vertexPositionsIndex + 7] = y3;
    vertexPositions[vertexPositionsIndex + 8] = z3;

    // The second triangle.

    vertexPositions[vertexPositionsIndex + 9] = x4;
    vertexPositions[vertexPositionsIndex + 10] = y4;
    vertexPositions[vertexPositionsIndex + 11] = z4;
    vertexPositions[vertexPositionsIndex + 12] = x3;
    vertexPositions[vertexPositionsIndex + 13] = y3;
    vertexPositions[vertexPositionsIndex + 14] = z3;
    vertexPositions[vertexPositionsIndex + 15] = x2;
    vertexPositions[vertexPositionsIndex + 16] = y2;
    vertexPositions[vertexPositionsIndex + 17] = z2;

    vertexPositionsIndex += 18;
  }

  return vertexPositions;
}

/**
 * Scale and then translate the 3-dimensional positions in the given flattened array.
 *
 * The shape is centered around the origin with the poles aligned with the z-axis.
 *
 * @param {Array.<Number>} vertexPositions Output.
 * @param {number} startIndex
 * @param {number} endIndex
 * @param {vec3} scale
 * @param {vec3} translate
 * @private
 */
function scaleThenTranslatePositions(vertexPositions, startIndex, endIndex, scale, translate) {
  var scaleX = scale[0];
  var scaleY = scale[1];
  var scaleZ = scale[2];
  var translateX = translate[0];
  var translateY = translate[1];
  var translateZ = translate[2];

  for (var i = startIndex; i < endIndex; i += 3) {
    vertexPositions[i] = vertexPositions[i] * scaleX + translateX;
    vertexPositions[i + 1] = vertexPositions[i + 1] * scaleY + translateY;
    vertexPositions[i + 2] = vertexPositions[i + 2] * scaleZ + translateZ;
  }
}

// Export this module's logic

exports.getViewportWidth = getViewportWidth;
exports.getViewportHeight = getViewportHeight;
exports.getWebGLContext = getWebGLContext;
exports.createBuffer = createBuffer;
exports.getAttribLocation = getAttribLocation;
exports.buildProgram = buildProgram;
exports.buildShader = buildShader;
exports.loadShader = loadShader;
exports.loadProgram = loadProgram;
exports.createBufferFromData = createBufferFromData;
exports.bindGLContextToViewportDimensions = bindGLContextToViewportDimensions;
exports.bindFramebuffer = bindFramebuffer;
exports.createFramebuffer = createFramebuffer;
exports.createTextureForRendering = createTextureForRendering;
exports.createRenderBuffer = createRenderBuffer;
exports.create2DSquarePositionsConfig = create2DSquarePositionsConfig;
exports.expandVertexIndicesToDuplicatePositions = expandVertexIndicesToDuplicatePositions;
exports.calculateOrthogonalVertexNormals = calculateOrthogonalVertexNormals;
exports.calculateLatLongTextureCoordinates = calculateLatLongTextureCoordinates;
exports.calculateCylindricalTextureCoordinates = calculateCylindricalTextureCoordinates;
exports.expandVertexIndicesAroundLongitudeSeam = expandVertexIndicesAroundLongitudeSeam;
exports.tesselateSphere = tesselateSphere;
exports.dedupVertexArrayWithPositionsAndIndicesArrays = dedupVertexArrayWithPositionsAndIndicesArrays;
exports.calculateSphericalSection = calculateSphericalSection;
exports.calculateCylindricalSection = calculateCylindricalSection;
exports.scaleThenTranslatePositions = scaleThenTranslatePositions;

// Some type defs to make my editor's auto-complete happy.

/** @typedef {Object} WebGLProgram */
/** @typedef {Object} WebGLShader */
/** @typedef {Object} WebGLBuffer */
/** @typedef {Object} WebGLTexture */
/** @typedef {Float32Array|Array.<Number>} mat3 */
/** @typedef {Float32Array|Array.<Number>} mat4 */
/** @typedef {Float32Array|Array.<Number>} quat */
/** @typedef {Float32Array|Array.<Number>} vec2 */
/** @typedef {Float32Array|Array.<Number>} vec3 */
/** @typedef {Float32Array|Array.<Number>} vec4 */

},{"../../program-wrapper/src/program-wrapper-store":34,"./geometry":51,"./hash-map":53,"./util":54}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * A hash map that uses a custom hash function.
 */
var HashMap = function () {
  /**
   * @param {Function} hashFunction
   */
  function HashMap(hashFunction) {
    _classCallCheck(this, HashMap);

    this._hashFunction = hashFunction;
    this._map = new Map();
  }

  /**
   * @param {Object} key
   * @param {Object} value
   */

  _createClass(HashMap, [{
    key: "set",
    value: function set(key, value) {
      var hashCode = this._hashFunction(key);
      this._map.set(hashCode, value);
    }

    /**
     * @param {Object} key
     * @returns {Object}
     */

  }, {
    key: "get",
    value: function get(key) {
      var hashCode = this._hashFunction(key);
      return this._map.get(hashCode);
    }

    /**
     * @param {Object} key
     * @returns {boolean}
     */

  }, {
    key: "has",
    value: function has(key) {
      var hashCode = this._hashFunction(key);
      return this._map.has(hashCode);
    }

    /**
     * @param {Object} item
     * @returns {boolean}
     */

  }, {
    key: "remove",
    value: function remove(item) {
      return this._map.delete(item);
    }

    /**
     * @param {Function} callback
     */

  }, {
    key: "forEach",
    value: function forEach(callback) {
      this._map.forEach(callback);
    }
  }, {
    key: "clear",
    value: function clear() {
      this._map.clear();
    }

    /**
     * @returns {number}
     */

  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return HashMap;
}();

exports.HashMap = HashMap;

},{}],54:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

/**
 * This module defines a collection of static general utility functions.
 */

// TODO: This should be set from somewhere else (probably as a param to controller like before; but then I need to make this updatable)
var isInDevMode = true;

/**
 * Adds an event listener for each of the given events to each of the given elements.
 *
 * @param {Array.<HTMLElement>} elements The elements to add event listeners to.
 * @param {Array.<String>} events The event listeners to add to the elements.
 * @param {Function} callback The single callback for handling the events.
 */
function listenToMultipleForMultiple(elements, events, callback) {
  elements.forEach(function (element) {
    events.forEach(function (event) {
      element.addEventListener(event, callback, false);
    });
  });
}

/**
 * Creates a DOM element with the given tag name, appends it to the given parent element, and
 * gives it the given id and classes.
 *
 * @param {string} tagName The tag name to give the new element.
 * @param {HTMLElement} [parent] The parent element to append the new element to.
 * @param {string} [id] The id to give the new element.
 * @param {Array.<String>} [classes] The classes to give the new element.
 * @returns {HTMLElement} The new element.
 */
function createElement(tagName, parent, id, classes) {
  var element = document.createElement(tagName);
  if (parent) {
    parent.appendChild(element);
  }
  if (id) {
    element.id = id;
  }
  if (classes) {
    classes.forEach(function (className) {
      return addClass(element, className);
    });
  }
  return element;
}

/**
 * Determines whether the given element contains the given class.
 *
 * @param {HTMLElement} element The element to check.
 * @param {string} className The class to check for.
 * @returns {boolean} True if the element does contain the class.
 */
function containsClass(element, className) {
  var startIndex = void 0;
  var indexAfterEnd = void 0;
  startIndex = element.className.indexOf(className);
  if (startIndex >= 0) {
    if (startIndex === 0 || element.className[startIndex - 1] === ' ') {
      indexAfterEnd = startIndex + className.length;
      if (indexAfterEnd === element.className.length || element.className[indexAfterEnd] === ' ') {
        return true;
      }
    }
  }
  return false;
}

/**
 * Toggles whether the given element has the given class. If the enabled argument is given, then
 * the inclusion of the class will be forced. That is, if enabled=true, then this will ensure the
 * element has the class; if enabled=false, then this will ensure the element does NOT have the
 * class; if enabled=undefined, then this will simply toggle whether the element has the class.
 *
 * @param {HTMLElement} element The element to add the class to or remove the class from.
 * @param {string} className The class to add or remove.
 * @param {boolean} [enabled] If given, then the inclusion of the class will be forced.
 */
function toggleClass(element, className, enabled) {
  if (typeof enabled === 'undefined') {
    if (containsClass(element, className)) {
      removeClass(element, className);
    } else {
      addClass(element, className);
    }
  } else if (enabled) {
    addClass(element, className);
  } else {
    removeClass(element, className);
  }
}

/**
 * Gets the coordinates of the element relative to the top-left corner of the page.
 *
 * @param {HTMLElement} element The element to get the coordinates of.
 * @returns {{x: Number, y: Number}} The coordinates of the element relative to the top-left
 * corner of the page.
 */
function getPageOffset(element) {
  var x = 0;
  var y = 0;
  while (element) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  }
  x -= document.documentElement.scrollLeft;
  y -= document.documentElement.scrollTop;
  return { x: x, y: y };
}

/**
 * Gets the dimensions of the viewport.
 *
 * @returns {{w: Number, h: Number}} The dimensions of the viewport.
 */
function getViewportSize() {
  var w = void 0;
  var h = void 0;
  if (typeof window.innerWidth !== 'undefined') {
    // Good browsers
    w = window.innerWidth;
    h = window.innerHeight;
  } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
    // IE6 in standards compliant mode
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;
  } else {
    // Older versions of IE
    w = document.getElementsByTagName('body')[0].clientWidth;
    h = document.getElementsByTagName('body')[0].clientHeight;
  }
  return { w: w, h: h };
}

/**
 * Removes the given child element from the given parent element if the child does indeed belong
 * to the parent.
 *
 * @param {HTMLElement} parent The parent to remove the child from.
 * @param {HTMLElement} child The child to remove.
 * @returns {boolean} True if the child did indeed belong to the parent.
 */
function removeChildIfPresent(parent, child) {
  if (child && child.parentNode === parent) {
    parent.removeChild(child);
    return true;
  }
  return false;
}

/**
 * Adds the given class to the given element.
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
function addClass(element, className) {
  element.setAttribute('class', element.className + ' ' + className);
}

/**
 * Removes the given class from the given element.
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
function removeClass(element, className) {
  element.setAttribute('class', element.className.split(' ').filter(function (value) {
    return value !== className;
  }).join(' '));
}

/**
 * Removes all classes from the given element.
 *
 * @param {HTMLElement} element The element to remove all classes from.
 */
function clearClasses(element) {
  element.className = '';
}

/**
 * Calculates the width that the DOM would give to a div with the given text. The given tag
 * name, parent, id, and classes allow the width to be affected by various CSS rules.
 *
 * @param {string} text The text to determine the width of.
 * @param {string} tagName The tag name this text would supposedly have.
 * @param {HTMLElement} [parent] The parent this text would supposedly be a child of; defaults
 * to the document body.
 * @param {string} [id] The id this text would supposedly have.
 * @param {Array.<String>} [classes] The classes this text would supposedly have.
 * @returns {number} The width of the text under these conditions.
 */
function getTextWidth(text, tagName, parent, id, classes) {
  var tmpElement = void 0;
  var width = void 0;
  parent = parent || document.getElementsByTagName('body')[0];
  tmpElement = createElement(tagName, null, id, classes);
  tmpElement.style.position = 'absolute';
  tmpElement.style.visibility = 'hidden';
  tmpElement.style.whiteSpace = 'nowrap';
  parent.appendChild(tmpElement);
  tmpElement.innerHTML = text;
  width = tmpElement.clientWidth;
  parent.removeChild(tmpElement);
  return width;
}

/**
 * Encodes and concatenates the given URL parameters into a single query string.
 *
 * @param {Object} rawParams An object whose properties represent the URL query string
 * parameters.
 * @returns {string} The query string.
 */
function encodeQueryString(rawParams) {
  var parameter = void 0;
  var encodedParams = void 0;
  encodedParams = [];
  for (parameter in rawParams) {
    if (rawParams.hasOwnProperty(parameter)) {
      encodedParams.push(encodeURIComponent(parameter) + '=' + encodeURIComponent(rawParams[parameter]));
    }
  }
  return '?' + encodedParams.join('&');
}

/**
 * Retrieves the value corresponding to the given name from the given query string.
 *
 * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
 *
 * @param {string} queryString The query string containing the parameter.
 * @param {string} name The (non-encoded) name of the parameter value to retrieve.
 * @returns {string} The query string parameter value, or null if the parameter was not found.
 */
function getQueryStringParameterValue(queryString, name) {
  var regex = void 0;
  var results = void 0;
  name = encodeURIComponent(name);
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
  results = regex.exec(queryString);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Sets the CSS transition style of the given element.
 *
 * @param {HTMLElement} element The element.
 * @param {number} value The transition string.
 */
function setTransition(element, value) {
  element.style.transition = value;
  element.style.WebkitTransition = value;
  element.style.MozTransition = value;
  element.style.msTransition = value;
  element.style.OTransition = value;
}

/**
 * Sets the CSS transition duration style of the given element.
 *
 * @param {HTMLElement} element The element.
 * @param {number} value The duration.
 */
function setTransitionDurationSeconds(element, value) {
  element.style.transitionDuration = value + 's';
  element.style.WebkitTransitionDuration = value + 's';
  element.style.MozTransitionDuration = value + 's';
  element.style.msTransitionDuration = value + 's';
  element.style.OTransitionDuration = value + 's';
}

/**
 * Sets the CSS transition delay style of the given element.
 *
 * @param {HTMLElement} element The element.
 * @param {number} value The delay.
 */
function setTransitionDelaySeconds(element, value) {
  element.style.transitionDelay = value + 's';
  element.style.WebkitTransitionDelay = value + 's';
  element.style.MozTransitionDelay = value + 's';
  element.style.msTransitionDelay = value + 's';
  element.style.OTransitionDelay = value + 's';
}

/**
 * Sets the userSelect style of the given element to 'none'.
 *
 * @param {HTMLElement} element
 */
function setUserSelectNone(element) {
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';
  element.style.MozUserSelect = 'none';
  element.style.msUserSelect = 'none';
}

/**
 * Removes any children elements from the given parent that have the given class.
 *
 * @param {HTMLElement} parent The parent to remove children from.
 * @param {string} className The class to match.
 */
function removeChildrenWithClass(parent, className) {
  var matchingChildren = parent.querySelectorAll('.' + className);

  for (var i = 0, count = matchingChildren.length; i < count; i++) {
    parent.removeChild(matchingChildren[i]);
  }
}

/**
 * Sets the CSS transition-timing-function style of the given element with the given cubic-
 * bezier points.
 *
 * @param {HTMLElement} element The element.
 * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
 * points to use for this timing function.
 */
function setTransitionCubicBezierTimingFunction(element, bezierPts) {
  var value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' + bezierPts.p2y + ')';
  element.style.transitionTimingFunction = value;
  element.style.WebkitTransitionTimingFunction = value;
  element.style.MozTransitionTimingFunction = value;
  element.style.msTransitionTimingFunction = value;
  element.style.OTransitionTimingFunction = value;
}

// A collection of different types of easing functions.
var easingFunctions = {
  linear: function linear(t) {
    return t;
  },
  easeInQuad: function easeInQuad(t) {
    return t * t;
  },
  easeOutQuad: function easeOutQuad(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic: function easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic: function easeOutCubic(t) {
    return 1 + --t * t * t;
  },
  easeInOutCubic: function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart: function easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart: function easeOutQuart(t) {
    return 1 - --t * t * t * t;
  },
  easeInOutQuart: function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  easeInQuint: function easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function easeOutQuint(t) {
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint: function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

// A collection of the inverses of different types of easing functions.
var inverseEasingFunctions = {
  linear: function linear(t) {
    return t;
  },
  easeInQuad: function easeInQuad(t) {
    return Math.sqrt(t);
  },
  easeOutQuad: function easeOutQuad(t) {
    return 1 - Math.sqrt(1 - t);
  },
  easeInOutQuad: function easeInOutQuad(t) {
    return t < 0.5 ? Math.sqrt(t * 0.5) : 1 - 0.70710678 * Math.sqrt(1 - t);
  }
};

/**
 * Calculates the x and y coordinates represented by the given Bezier curve at the given
 * percentage.
 *
 * @param {number} percent Expressed as a number between 0 and 1.
 * @param {Array.<{x:Number,y:Number}>} controlPoints
 * @returns {{x:Number,y:Number}}
 */
function getXYFromPercentWithBezier(percent, controlPoints) {
  var x = void 0;
  var y = void 0;
  var oneMinusPercent = void 0;
  var tmp1 = void 0;
  var tmp2 = void 0;
  var tmp3 = void 0;
  var tmp4 = void 0;

  oneMinusPercent = 1 - percent;
  tmp1 = oneMinusPercent * oneMinusPercent * oneMinusPercent;
  tmp2 = 3 * percent * oneMinusPercent * oneMinusPercent;
  tmp3 = 3 * percent * percent * oneMinusPercent;
  tmp4 = percent * percent * percent;

  x = controlPoints[0].x * tmp1 + controlPoints[1].x * tmp2 + controlPoints[2].x * tmp3 + controlPoints[3].x * tmp4;
  y = controlPoints[0].y * tmp1 + controlPoints[1].y * tmp2 + controlPoints[2].y * tmp3 + controlPoints[3].y * tmp4;

  return { x: x, y: y };
}

/**
 * Applies the given transform to the given element as a CSS style in a cross-browser compatible
 * manner.
 *
 * @param {HTMLElement} element
 * @param {string} transform
 */
function setTransform(element, transform) {
  element.style.webkitTransform = transform;
  element.style.MozTransform = transform;
  element.style.msTransform = transform;
  element.style.OTransform = transform;
  element.style.transform = transform;
}

/**
 * Returns a copy of the given array with its contents re-arranged in a random order.
 *
 * The original array is left in its original order.
 *
 * @param {Array} array
 * @returns {Array}
 */
function shuffle(array) {
  var i = void 0;
  var j = void 0;
  var count = void 0;
  var temp = void 0;

  for (i = 0, count = array.length; i < count; i++) {
    j = parseInt(Math.random() * count);
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
}

/**
 * Performs a shallow copy of the given object.
 *
 * This only copies enumerable properties.
 *
 * @param {Object} object
 * @returns {Object}
 */
function shallowCopy(object) {
  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    var cloneObject = {};

    Object.keys(object).forEach(function (key) {
      return cloneObject[key] = object[key];
    });

    return cloneObject;
  } else {
    return object;
  }
}

/**
 * Performs a deep copy of the given object.
 *
 * This only copies enumerable properties.
 *
 * @param {Object} object
 * @returns {Object}
 */
function deepCopy(object) {
  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    // Hack: Not a robust copy policy
    var cloneObject = void 0;
    if (object instanceof Array) {
      cloneObject = [];
    } else {
      cloneObject = {};
    }

    Object.keys(object).forEach(function (key) {
      return cloneObject[key] = deepCopy(object[key]);
    });

    return cloneObject;
  } else {
    return object;
  }
}

/**
 * Converts the given HSL color values to HSV color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * @param {HslColor} hsl
 * @returns {{h:Number,s:Number,v:Number}}
 */
function hslToHsv(hsl) {
  var temp = hsl.s * (hsl.l < 0.5 ? hsl.l : 1 - hsl.l);
  return {
    h: hsl.h,
    s: 2 * temp / (hsl.l + temp),
    v: hsl.l + temp
  };
}

/**
 * Converts the given HSV color values to HSL color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * @param {{h:Number,s:Number,v:Number}} hsv
 * @returns {HslColor}
 */
function hsvToHsl(hsv) {
  var temp = (2 - hsv.s) * hsv.v;
  return {
    h: hsv.h,
    s: hsv.s * hsv.v / (temp < 1 ? temp : 2.00000001 - temp),
    l: temp * 0.5
  };
}

/**
 * Converts the given HSL color values to RGB color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * Originally adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *
 * @param {HslColor} hsl
 * @returns {RgbColor} rgb
 */
function hslToRgb(hsl) {
  var r = void 0;
  var g = void 0;
  var b = void 0;

  if (hsl.s === 0) {
    // Achromatic.
    r = hsl.l;
    g = hsl.l;
    b = hsl.l;
  } else {
    var q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s;
    var p = 2 * hsl.l - q;

    r = _hue2Rgb(p, q, hsl.h + 1 / 3);
    g = _hue2Rgb(p, q, hsl.h);
    b = _hue2Rgb(p, q, hsl.h - 1 / 3);
  }

  return {
    r: r,
    g: g,
    b: b
  };
}

function _hue2Rgb(p, q, t) {
  if (t < 0) {
    t++;
  } else if (t > 1) {
    t--;
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  } else if (t < 1 / 2) {
    return q;
  } else if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  } else {
    return p;
  }
}

/**
 * Converts the given RGB color values to HSL color values.
 *
 * Given and returned values will be in the range of [0, 1].
 *
 * Originally adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *
 * @param {{r:Number,g:Number,b:Number}} rgb
 * @returns {HslColor} hsl
 */
function rgbToHsl(rgb) {
  var max = Math.max(rgb.r, rgb.g, rgb.b);
  var min = Math.min(rgb.r, rgb.g, rgb.b);
  var h = void 0;
  var s = void 0;
  var l = (max + min) / 2;

  if (max === min) {
    // Achromatic.
    h = 0;
    s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rgb.r:
        h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
        break;
      case rgb.g:
        h = (rgb.b - rgb.r) / d + 2;
        break;
      case rgb.b:
        h = (rgb.r - rgb.g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l
  };
}

/**
 * Creates a valid color string to assign to a CSS property from the given h/s/l color values.
 *
 * Given values should be in the range of [0,1].
 *
 * @param {HslColor} hsl
 * @returns {string}
 */
function createHslColorString(hsl) {
  return typeof hsl.a !== 'undefined' ? 'hsla(' + hsl.h * 360 + ',' + hsl.s * 100 + '%,' + hsl.l * 100 + '%,' + hsl.a + ')' : 'hsl(' + hsl.h * 360 + ',' + hsl.s * 100 + '%,' + hsl.l * 100 + '%)';
}

/**
 * Checks the given element and all of its ancestors, and returns the first that contains the
 * given class.
 *
 * @param {?HTMLElement} element
 * @param {string} className
 * @returns {?HTMLElement}
 */
function findClassInSelfOrAncestors(element, className) {
  while (element) {
    if (containsClass(element, className)) {
      return element;
    }
  }

  return null;
}

var utilStyleSheet = void 0;

/**
 * Adds the given style rule to a style sheet for the current document.
 *
 * @param {string} styleRule
 */
function addRuleToStyleSheet(styleRule) {
  // Create the custom style sheet if it doesn't already exist
  if (!utilStyleSheet) {
    utilStyleSheet = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(utilStyleSheet);
  }

  // Add the given rule to the custom style sheet
  if (utilStyleSheet.styleSheet) {
    utilStyleSheet.styleSheet.cssText = styleRule;
  } else {
    utilStyleSheet.appendChild(document.createTextNode(styleRule));
  }
}

function checkForSafari() {
  return (/Safari/i.test(window.navigator.userAgent) && !/Chrome/i.test(window.navigator.userAgent)
  );
}

function checkForIos() {
  return (/iPhone|iPod|iPad/i.test(window.navigator.userAgent)
  );
}

/**
 * Returns a debounced version of the given function.
 *
 * Even if the debounced function is invoked many times, the wrapped function will only be invoked
 * after the given delay has ellapsed since the last invocation.
 *
 * If isInvokedImmediately is true, then the wrapped function will be triggered at the start of the
 * invocation group rather than at the end.
 *
 * @param {Function} wrappedFunction
 * @param {number} delay In milliseconds.
 * @param {boolean} [isInvokedImmediately=false]
 * @returns {Function}
 */
function debounce(wrappedFunction, delay) {
  var _this = this,
      _arguments = arguments;

  var isInvokedImmediately = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var timeoutId = void 0;

  return function () {
    // Save the context and arguments passed from the client (this will use the values from the
    // first invocation of the invocation group.
    var context = _this;
    var args = _arguments;

    // Invoke immediately only if this is the first invocation of a group.
    if (isInvokedImmediately && !timeoutId) {
      wrappedFunction.apply(context, args);
    }

    // Reset the delay.
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      // The invocation group has ended.
      timeoutId = null;
      if (!isInvokedImmediately) {
        wrappedFunction.apply(context, args);
      }
    }, delay);
  };
}

/**
 * Returns a throttled version of the given function.
 *
 * Even if the throttled function is invoked many times, the wrapped function will only be invoked
 * at each interval of the given delay. After the throttled function stops being invoked, then
 * wrapped function will also stop being invoked.
 *
 * If isInvokedImmediately is true, then the wrapped function will be triggered at the start of the
 * invocation delay rather than at the end.
 *
 * @param {Function} wrappedFunction
 * @param {number} delay In milliseconds.
 * @param {boolean} [isInvokedImmediately=false]
 * @returns {Function}
 */
function throttle(wrappedFunction, delay) {
  var _this2 = this,
      _arguments2 = arguments;

  var isInvokedImmediately = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var timeoutId = void 0;

  return function () {
    // Save the context and arguments passed from the client (this will use the values from the
    // first invocation of the invocation group.
    var context = _this2;
    var args = _arguments2;

    // Only trigger a new invocation group if we are not already/still waiting on the delay from a
    // previous invocation.
    if (!timeoutId) {
      if (isInvokedImmediately) {
        wrappedFunction.apply(context, args);
      }

      // Start the delay.
      timeoutId = setTimeout(function () {
        // The invocation group has ended.
        timeoutId = null;
        if (!isInvokedImmediately) {
          wrappedFunction.apply(context, args);
        }
      }, delay);
    }
  };
}

/**
 * @param {Array.<*>|String} array
 * @param {*} delimiter
 * @returns {Array.<*>}
 * @private
 */
function _interleave(array, delimiter) {
  var result = new Array(array.length * 2 - 1);
  if (array.length) {
    result.push(array[0]);
  }
  for (var i = 1, count = array.length; i < count; i++) {
    result.push(delimiter);
    result.push(array[i]);
  }
  return result;
}

/**
 * Loads the given src for the given image.
 *
 * @param {HTMLImageElement} image
 * @param {string} src
 * @returns {Promise.<HTMLImageElement, Error>}
 */
function loadImageSrc(image, src) {
  return new Promise(function (resolve, reject) {
    console.debug('Loading image: ' + src);

    image.addEventListener('load', function (_) {
      return resolve(image);
    });
    image.addEventListener('error', reject);
    image.addEventListener('abort', reject);

    image.src = src;
  });
}

/**
 * Loads text from the given URL.
 *
 * @param {string} url
 * @returns {Promise.<String, Error>}
 */
function loadText(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function (_) {
      return resolve(xhr.response);
    });
    xhr.addEventListener('error', reject);
    xhr.addEventListener('abort', reject);

    console.debug('Loading text: ' + url);

    xhr.open('GET', url);
    xhr.send();
  });
}

/**
 * Loads a JSON object from the given URL.
 *
 * @param {string} url
 * @returns {Promise.<Object, Error>}
 */
function loadJson(url) {
  return loadText(url).then(function (jsonText) {
    return JSON.parse(jsonText);
  });
}

/**
 * Gets the current stack trace.
 *
 * @returns {string}
 */
function getStackTrace() {
  return new Error().stack;
}

/**
 * Freezes the given object and recursively freezes all of its properties.
 *
 * @param {Object} object
 */
function deepFreeze(object) {
  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    Object.freeze(object);
    Object.keys(object).forEach(function (key) {
      return deepFreeze(object[key]);
    });
  }
}

/**
 * Creates a GUID.
 *
 * GUID specification: http://www.ietf.org/rfc/rfc4122.txt
 *
 * Logic adopted from http://stackoverflow.com/a/2117523/489568.
 *
 * @returns {string}
 */
function createGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/**
 * -11 % 3 === -2
 * mod(-11, 3) === 1
 *
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function mod(n, m) {
  return (n % m + m) % m;
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomFloatInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * @param {number} min Inclusive
 * @param {number} max Exclusive
 * @returns {number}
 */
function randomIntInRange(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

/**
 * @param {Array} list
 * @returns {*}
 */
function pickRandom(list) {
  return list[randomIntInRange(0, list.length)];
}

/**
 * Triggers the given callback when either the current tab or the browser window loses/gains focus.
 *
 * @param {Function} focusChangeHandler
 */
function handlePageFocusChange(focusChangeHandler) {
  // Pause/unpause the app when the tab loses/gains focus.
  document.addEventListener('visibilitychange', function () {
    return focusChangeHandler(!document.hidden);
  });
  // Pause/unpause the app when the browser window loses/gains focus.
  window.addEventListener('blur', function () {
    return focusChangeHandler(false);
  });
  window.addEventListener('focus', function () {
    return focusChangeHandler(true);
  });
}

/**
 * Creates an array with all the consecutive numbers from start (inclusive) to end (exclusive).
 *
 * @param {number} start
 * @param {number} end
 * @returns {Array.<Number>}
 */
function range(start, end) {
  var r = [];
  for (var i = 0, j = start; j < end; i++, j++) {
    r[i] = j;
  }
  return r;
}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isInt(value) {
  return typeof value === 'number' && isFinite(value) && parseInt(value) === value;
}

/**
 * Find the first value in a list that satisfies a predicate.
 *
 * @param {Array} list
 * @param {Function} predicate
 * @returns {*}
 */
function find(list, predicate) {
  for (var i = 0, count = list.length; i < count; i++) {
    var value = list[i];
    if (predicate.call(null, value, i, list)) {
      return value;
    }
  }
  return null;
}

var keyCodes = {
  'a': 65,
  'b': 66,
  'c': 67,
  'd': 68,
  'e': 69,
  'f': 70,
  'g': 71,
  'h': 72,
  'i': 73,
  'j': 74,
  'k': 75,
  'l': 76,
  'm': 77,
  'n': 78,
  'o': 79,
  'p': 80,
  'q': 81,
  'r': 82,
  's': 83,
  't': 84,
  'u': 85,
  'v': 86,
  'w': 87,
  'x': 88,
  'y': 89,
  'z': 90,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'SPACE': 32,
  'ENTER': 13,
  'ESCAPE': 27,
  'LEFT': 37,
  'UP': 38,
  'RIGHT': 39,
  'DOWN': 40
};

var svgNamespace = 'http://www.w3.org/2000/svg';
var xlinkNamespace = 'http://www.w3.org/1999/xlink';

exports.isInDevMode = isInDevMode;
exports.listenToMultipleForMultiple = listenToMultipleForMultiple;
exports.createElement = createElement;
exports.containsClass = containsClass;
exports.toggleClass = toggleClass;
exports.getPageOffset = getPageOffset;
exports.getViewportSize = getViewportSize;
exports.removeChildIfPresent = removeChildIfPresent;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.clearClasses = clearClasses;
exports.getTextWidth = getTextWidth;
exports.encodeQueryString = encodeQueryString;
exports.getQueryStringParameterValue = getQueryStringParameterValue;
exports.setTransition = setTransition;
exports.setTransitionDurationSeconds = setTransitionDurationSeconds;
exports.setTransitionDelaySeconds = setTransitionDelaySeconds;
exports.setUserSelectNone = setUserSelectNone;
exports.removeChildrenWithClass = removeChildrenWithClass;
exports.setTransitionCubicBezierTimingFunction = setTransitionCubicBezierTimingFunction;
exports.easingFunctions = easingFunctions;
exports.inverseEasingFunctions = inverseEasingFunctions;
exports.getXYFromPercentWithBezier = getXYFromPercentWithBezier;
exports.setTransform = setTransform;
exports.shuffle = shuffle;
exports.shallowCopy = shallowCopy;
exports.deepCopy = deepCopy;
exports.hsvToHsl = hsvToHsl;
exports.hslToHsv = hslToHsv;
exports.hslToRgb = hslToRgb;
exports.rgbToHsl = rgbToHsl;
exports.createHslColorString = createHslColorString;
exports.findClassInSelfOrAncestors = findClassInSelfOrAncestors;
exports.addRuleToStyleSheet = addRuleToStyleSheet;
exports.checkForSafari = checkForSafari;
exports.checkForIos = checkForIos;
exports.debounce = debounce;
exports.throttle = throttle;
exports.loadImageSrc = loadImageSrc;
exports.loadText = loadText;
exports.loadJson = loadJson;
exports.getStackTrace = getStackTrace;
exports.deepFreeze = deepFreeze;
exports.createGuid = createGuid;
exports.mod = mod;
exports.randomFloatInRange = randomFloatInRange;
exports.randomIntInRange = randomIntInRange;
exports.pickRandom = pickRandom;
exports.handlePageFocusChange = handlePageFocusChange;
exports.range = range;
exports.isInt = isInt;
exports.find = find;
exports.keyCodes = keyCodes;
exports.svgNamespace = svgNamespace;
exports.xlinkNamespace = xlinkNamespace;

/**
 * @typedef {Object} HslColor
 * @property {Number} h In the range of [0, 1].
 * @property {Number} s In the range of [0, 1].
 * @property {Number} l In the range of [0, 1].
 * @property {Number} [a] In the range of [0, 1].
 */

/**
 * @typedef {Object} RgbColor
 * @property {Number} r In the range of [0, 1].
 * @property {Number} g In the range of [0, 1].
 * @property {Number} b In the range of [0, 1].
 * @property {Number} [a] In the range of [0, 1].
 */

},{}]},{},[24])

//# sourceMappingURL=grafx.js.map
