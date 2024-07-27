//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_Title.js
//=============================================================================

var 
DRAGON                        = DRAGON               || {};
DRAGON.DollEye                = DRAGON.DollEye       || {};
DRAGON.DollEye.Title          = DRAGON.DollEye.Title || {};
DRAGON.DollEye.Title.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Custom Scene Title for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 */

(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_Title";
    $._params        = PluginManager.parameters(pluginName);
    $.params         = {};

    //-----------------------------------------------------------------------------
    // Window_TitleCommand
    //
    // The window for selecting New Game/Continue on the title screen.

    const alias_Window_TitleCommand_initialize = Window_TitleCommand.prototype.initialize;

    Object.assign(Window_TitleCommand.prototype, {

        initialize: function() {
            alias_Window_TitleCommand_initialize.apply(this, arguments);
            this.openness = 255;
        },

        open: function() {
            this._opening = false;
            this._closing = false;
            this.openness = 255;
        },

        close: function() {
            this._opening = false;
            this._closing = false;
            this.openness = 0;
        }

    });

})(DRAGON.DollEye.Title);
