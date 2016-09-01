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
      this._array[0] = startIndex;
      this._first.changed();
      this.didSet.emit(this._array);
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
      this._array[1] = endIndex;
      this._last.changed();
      this.didSet.emit(this._array);
    }
  },
  get: function() {
    if (Tracker.isActive) {
      this._first.depend();
      this._last.depend();
    }
    return this._array;
  }
});

type.defineMethods({
  set: function(range) {
    assertType(range, Array);
    this._array = range;
    if (range[0] === this._array[0]) {
      if (range[1] !== this._array[1]) {
        this._last.changed();
        this.didSet.emit(this._array);
      }
    } else {
      this._first.changed();
      if (range[1] !== this._array[1]) {
        this._last.changed();
      }
      this.didSet.emit(this._array);
    }
  },
  toString: function() {
    return this.get().toString();
  }
});

module.exports = type.build();

//# sourceMappingURL=map/ReactiveRange.map
