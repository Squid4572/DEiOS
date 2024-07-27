//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_TouchCore.js
//=============================================================================

var 
DRAGON                            = DRAGON                   || {};
DRAGON.DollEye                    = DRAGON.DollEye           || {};
DRAGON.DollEye.TouchCore          = DRAGON.DollEye.TouchCore || {};
DRAGON.DollEye.TouchCore.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Game Touch extended functions for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * 
 * @param destination
 * @text Destination
 * @default
 * 
 * @param destinationSprite
 * @text Sprite
 * @parent destination
 * @default
 * 
 * @param destinationSpriteVisible
 * @text Default Visibility
 * @parent destinationSprite
 * @type boolean
 * @default true
 * 
 */

(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_TouchCore";
    $._params        = PluginManager.parameters(pluginName);
    $.params         = Object.assign({}, $._params);

    const params = $.params;
    params.destinationSpriteVisible = params.destinationSpriteVisible === 'true';

    //-----------------------------------------------------------------------------
    // TouchInput
    //
    // The static class that handles input data from the mouse and touchscreen.

    const alias_TouchInput_initialize = TouchInput.initialize;
    const alias_TouchInput_update = TouchInput.update;

    Object.assign(TouchInput, {

        initialize() {
            alias_TouchInput_initialize.apply(this, arguments);
            this.enable();
        },

        enable() {
            this._touchEnabled = true;
        },

        disable() {
            this._touchEnabled = false;
            this.clear();
        },

        toggle() {
            this._touchEnabled = !this._touchEnabled;
        },

        update() {
            if (this._touchEnabled) alias_TouchInput_update.apply(this, arguments);
        }

    });

    //-----------------------------------------------------------------------------
    // Game_Temp
    //
    // The game object class for temporary data that is not included in save data.
    
    const alias_Game_Temp_setDestination = Game_Temp.prototype.setDestination;

    Object.assign(Game_Temp.prototype, {

        setDestination: function(x, y) {
            if (!this.anyClickableEventAt(x, y)) alias_Game_Temp_setDestination.apply(this, arguments);
        },

        anyClickableEventAt: function(x, y) {
            const events = $gameMap.eventsXy(Math.floor(x), Math.floor(y));
            for (const event of events) {
                if (event.processClickTrigger()) return true;
            }
            return false;
        }
        
    });

    //-----------------------------------------------------------------------------
    // Game_Event
    //
    // The game object class for an event. It contains functionality for event page
    // switching and running parallel process events.

    const alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;

    Object.assign(Game_Event.prototype, {

        setupPageSettings: function() {
            alias_Game_Event_setupPageSettings.apply(this, arguments);
            const list = this.list();
            for (const cmd of list) {
                if (cmd.code == 108 || cmd.code == 408) this._isClickable = !!cmd.parameters[0].match(/<Click Trigger>/i);
                if (!!this._isClickable) break;
            }
        },

        processClickTrigger: function() {
            if (this.isClickable()) {
                this.start();
                return true;
            }
            return false;
        },

        isClickable: function() {
            return !!this._isClickable;
        }

    });

    //-----------------------------------------------------------------------------
    // Sprite_Destination
    //
    // The sprite for displaying the destination place of the touch input.

    const alias_Sprite_Destination_update = Sprite_Destination.prototype.update;

    Object.assign(Sprite_Destination.prototype, {

        update() {
            alias_Sprite_Destination_update.apply(this, arguments);
            this.visible = params.destinationSpriteVisible;
        }

    })

})(DRAGON.DollEye.TouchCore);
