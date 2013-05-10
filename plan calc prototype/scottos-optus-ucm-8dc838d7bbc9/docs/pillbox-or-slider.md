# Pillbox or Slider

Q: How should the UI decide on which one to render? JSON-driven or HTML attribute driven?
A: Go with HTML data-attribute?

Q: Should the slider be designed to work on mobile?
A: Not a priority, use pillbox view instead. Should be workable, with touchpunch.

Q: HTML scaffolding will be the same?
A: Will probably end up being very similar, but not necessarily the same.

Q: What about Osiris SCSS?
A: Will need to refactor any existing work to fit with the new JS/HTML.

Q: How will we handle the different device types?
A: ???

Views:
* PillboxActivityView
* SliderActivityView

Templates:
* usageCalculatorActivityPillboxTemplate
* usageCalculatorActivitySliderTemplate