
assertType = require "assertType"
Tracker = require "tracker"
Event = require "Event"
Type = require "Type"

type = Type "ReactiveRange"

type.defineArgs
  range: Array

type.defineValues (range) ->

  didSet: Event()

  _array: range or []

  _first: Tracker.Dependency()

  _last: Tracker.Dependency()

type.definePrototype

  "0":

    get: ->
      if Tracker.isActive
        @_first.depend()
      return @_array[0]

    set: (startIndex) ->
      if canEmit = @didSet.hasListeners
        oldRange = @_array.slice()
      @_array[0] = startIndex
      @_first.changed()
      canEmit and @didSet.emit @_array, oldRange
      return

  "1":

    get: ->
      if Tracker.isActive
        @_last.depend()
      return @_array[1]

    set: (endIndex) ->
      if canEmit = @didSet.hasListeners
        oldRange = @_array.slice()
      @_array[1] = endIndex
      @_last.changed()
      canEmit and @didSet.emit @_array, oldRange
      return

type.defineMethods

  get: ->
    if Tracker.isActive
      @_first.depend()
      @_last.depend()
    return @_array

  set: (range) ->
    assertType range, Array

    oldRange = @_array
    @_array = range

    if range[0] is oldRange[0]
      if range[1] isnt oldRange[1]
        @_last.changed()
        @didSet.emit range, oldRange

    else
      @_first.changed()
      @_last.changed() if range[1] isnt oldRange[1]
      @didSet.emit range, oldRange
    return

  toString: ->
    @get().toString()

module.exports = type.build()
