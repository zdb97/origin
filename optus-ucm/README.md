# Optus UCM

## Overview

2 versions:

* The old "sliders" implmentation. (bbUsageCalculatorLegacy.js)
* A new, mobile-first "pillbox" implementation. (bbUsageCalculatorApp.js)

## Goals

* Best experience of a usage calculator on a mobile/tablet device.
* Focus on core experience, keep it simple, don't overthink the damn thing.
* Refactor the sliders version to use the mobile codebase. Different views, same plugin behaviour.

## Installation

Deploy to a subdirectory of www.

All assets are loaded relative to current folder.

Example links:

* http://localhost/dev/optus/optus-ucm/slider.html
* http://localhost/dev/optus/optus-ucm/pillbox.html

## TODO

* Update slider.html version to use updated codedbase. Views/templates the only difference?
* Integrate back into main 1P codebase, to share with desktop again.
* Jasmine test suite (for 1P codebase).

## Done

### Ages ago

* Review and update the metrics for the sliders, so they're meaningful.
* Add "unit" to each slider's .varaible_display on the RHS.
* Rewrite the backbone code.