# De-Coupled Event Dispatching with BackboneJS

## Overview

Managing events between various plugins is a challenge.

We will use the (events object)[http://backbonejs.org/#Events] from BackboneJS to manage register and trigger events.

## Init

Within the scope of your app (or global scope if you've not set that up):

```javascript
var eventDispatcher = _.clone(Backbone.Events);
```
You now have the choice to either pass it in, mix-it-in (mixin), or reference it like a god-object. 

Read the events section from BackboneJS for details on usage.

## Example use

Lets inject the eventDispatcher object into the view during construction:

```javascript
var MyView = Backbone.View.extend({

    initialize: function(options) {
        this.eventDispatcher = options.eventDispatcher; // I like to be explicit here, to be obvious.
        this.listenTo(this.eventDispatcher, 'activitySelectedStepChange', this.render);
        // ...
    }

    // ...

});
```

And then elsewhere, in another view or bit of code.

```javascript
this.eventDispatcher.trigger('activitySelectedStepChange');
```

## What about the data?

Backbone views are given collections or models to inspect for data. These models are usually what views listen to.

## Why do this?

De-couples the views. If you create meaningfully (and generically) named events, then it means your app is a loose collection of behaviours.

## Strictly controlled behaviour via a meta-event

If you ever have a situation where a specific sequence of plugin behaviours needs to 

