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
    _dep: Tracker.Dependency(),
    _range: range || []
  };
});

type.definePrototype({
  "0": {
    get: function() {
      if (Tracker.isActive) {
        this._dep.depend();
      }
      return this._range[0];
    },
    set: function(startIndex) {
      this._range[0] = startIndex;
      this._dep.changed();
      this.didSet.emit(this._range);
    }
  },
  "1": {
    get: function() {
      if (Tracker.isActive) {
        this._dep.depend();
      }
      return this._range[1];
    },
    set: function(endIndex) {
      this._range[1] = endIndex;
      this._dep.changed();
      this.didSet.emit(this._range);
    }
  }
});

type.defineMethods({
  set: function(range) {
    assertType(range, Array);
    this._range = range;
    this._dep.changed();
    this.didSet.emit(this._range);
  },
  toString: function() {
    if (Tracker.isActive) {
      this._dep.depend();
    }
    return this._range.toString();
  }
});

module.exports = type.build();

//# sourceMappingURL=map/ReactiveRange.map
