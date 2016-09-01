
assertType = require "assertType"
Tracker = require "tracker"
Event = require "Event"
Type = require "Type"

type = Type "ReactiveRange"

type.defineArgs
  range: Array

type.defineValues (range) ->

  didSet: Event()

  _dep: Tracker.Dependency()

  _range: range or []

type.definePrototype

  "0":

    get: ->
      if Tracker.isActive
        @_dep.depend()
      return @_range[0]

    set: (startIndex) ->
      @_range[0] = startIndex
      @_dep.changed()
      @didSet.emit @_range
      return

  "1":

    get: ->
      if Tracker.isActive
        @_dep.depend()
      return @_range[1]

    set: (endIndex) ->
      @_range[1] = endIndex
      @_dep.changed()
      @didSet.emit @_range
      return

type.defineMethods

  set: (range) ->
    assertType range, Array
    @_range = range
    @_dep.changed()
    @didSet.emit @_range
    return

  toString: ->
    if Tracker.isActive
      @_dep.depend()
    return @_range.toString()

module.exports = type.build()
