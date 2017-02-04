
# ReactiveRange v1.1.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

- Uses [aleclarson/tracker](https://github.com/aleclarson/tracker)

```coffee
ReactiveRange = require "ReactiveRange"

range = ReactiveRange [0, 1]

# Subscribe to changes.
listener = range
  .didSet (newValue) ->
    console.log newValue.toString()
  .start()

# The range is reactive, of course.
computation = Tracker.autorun ->
  console.log range.toString()

range.start = 1
range.end = 2

# Set both at once.
range.set [2, 3]
```
