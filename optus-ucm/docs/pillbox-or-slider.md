# Pillbox or Slider

## Questions

Q: How should the UI decide on which one to render? JSON-driven or HTML attribute driven?
A: Go with the JSON data. We can have a mobile + desktop copy. I think we'll focus on driving most stuff from the JSON, rather than JSON + HTML data attributes etc.

Q: Should the slider be designed to work on mobile?
A: Not a priority, use pillbox view instead. Should be workable, with touchpunch.

Q: HTML scaffolding will be the same?
A: Will probably end up being very similar, but not necessarily the same. Keep as basic as possible.

Q: What about Osiris SCSS?
A: Will need to refactor any existing work to fit with the new JS/HTML. Do that later.

Q: How will we handle the different device types?
A: ???

## Slider and Pillbox

Views:
* PillboxActivityView
* SliderActivityView

Templates:
* usageCalculatorActivityPillboxTemplate
* usageCalculatorActivitySliderTemplate

 