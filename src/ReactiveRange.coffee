
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
      @_array[0] = startIndex
      @_first.changed()
      @didSet.emit @_array
      return

  "1":

    get: ->
      if Tracker.isActive
        @_last.depend()
      return @_array[1]

    set: (endIndex) ->
      @_array[1] = endIndex
      @_last.changed()
      @didSet.emit @_array
      return

  get: ->
    if Tracker.isActive
      @_first.depend()
      @_last.depend()
    return @_array

type.defineMethods

  set: (range) ->
    assertType range, Array

    @_array = range

    if range[0] is @_array[0]
      if range[1] isnt @_array[1]
        @_last.changed()
        @didSet.emit @_array

    else
      @_first.changed()
      @_last.changed() if range[1] isnt @_array[1]
      @didSet.emit @_array
    return

  toString: ->
    @get().toString()

module.exports = type.build()
