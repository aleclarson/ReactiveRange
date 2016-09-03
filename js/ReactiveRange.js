var Event, Tracker, Type, assertType, type;

assertType = require("assertType");

Tracker = require("tracker");

Event = require("Event");

Type = require("Type");

type = Type("ReactiveRange");

type.defineArgs({
  range: Array
});

type.defineValues(function(range) {
  return {
    didSet: Event(),
    _array: range || [],
    _first: Tracker.Dependency(),
    _last: Tracker.Dependency()
  };
});

type.definePrototype({
  "0": {
    get: function() {
      if (Tracker.isActive) {
        this._first.depend();
      }
      return this._array[0];
    },
    set: function(startIndex) {
      var canEmit, oldRange;
      if (canEmit = this.didSet.hasListeners) {
        oldRange = this._array.slice();
      }
      this._array[0] = startIndex;
      this._first.changed();
      canEmit && this.didSet.emit(this._array, oldRange);
    }
  },
  "1": {
    get: function() {
      if (Tracker.isActive) {
        this._last.depend();
      }
      return this._array[1];
    },
    set: function(endIndex) {
      var canEmit, oldRange;
      if (canEmit = this.didSet.hasListeners) {
        oldRange = this._array.slice();
      }
      this._array[1] = endIndex;
      this._last.changed();
      canEmit && this.didSet.emit(this._array, oldRange);
    }
  }
});

type.defineMethods({
  get: function() {
    if (Tracker.isActive) {
      this._first.depend();
      this._last.depend();
    }
    return this._array;
  },
  set: function(range) {
    var oldRange;
    assertType(range, Array);
    oldRange = this._array;
    this._array = range;
    if (range[0] === oldRange[0]) {
      if (range[1] !== oldRange[1]) {
        this._last.changed();
        this.didSet.emit(range, oldRange);
      }
    } else {
      this._first.changed();
      if (range[1] !== oldRange[1]) {
        this._last.changed();
      }
      this.didSet.emit(range, oldRange);
    }
  },
  toString: function() {
    return this.get().toString();
  }
});

module.exports = type.build();

//# sourceMappingURL=map/ReactiveRange.map
