var _TouchInput_initialize = TouchInput.initialize;
TouchInput.initialize = function() {
_TouchInput_initialize.call(this);
this._touchEnabled = true;
}

var _TouchInput_update = TouchInput.update;
TouchInput.update = function() {
if (this._touchEnabled)
_TouchInput_update.call(this);
}

TouchInput.enable = function() {
this._touchEnabled = true;
}

TouchInput.disable = function() {
this._touchEnabled = false;
TouchInput.clear();
}
