//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_Core.js
//=============================================================================

var 
DRAGON                       = DRAGON              || {};
DRAGON.DollEye               = DRAGON.DollEye      || {};
DRAGON.DollEye.Core          = DRAGON.DollEye.Core || {};
DRAGON.DollEye.Core.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Core functions for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * 
 * @param scenes
 * @text Scenes
 * @desc Scenes Global Setup
 * @default
 * 
 * @param menus
 * @text Menus
 * @desc Menu Scenes Global Setup
 * @parent scenes
 * @default
 * 
 * @param menuBgBlurStrength
 * @text Background Blur Strength
 * @desc Choose the strength of blur of background in menu scenes.
 * @parent menus
 * @type number
 * @decimals 1
 * @default 0.0
 * 
 * @param menuBgOpacity
 * @text Background Opacity
 * @desc Choose the opacity of background in menu scenes.
 * @parent menus
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param menuTouchButtonMargin
 * @text Touch Button Margin
 * @desc Choose whether the margin of the top touch button should be kept even if UI touch is disabled. 
 * @parent menus
 * @type boolean
 * @default false
 * 
 * @param sceneOptions
 * @text Options Menu
 * @desc Options Scene Setup
 * @parent scenes
 * @default
 * 
 * @param sceneOptionsCmd1
 * @text Command - Always Dash
 * @parent sceneOptions
 * @type struct<CommandBool>
 * @default {"enabled":"true","defaultValue":"false"}
 * 
 * @param sceneOptionsCmd2
 * @text Command - Command Remember
 * @parent sceneOptions
 * @type struct<CommandBool>
 * @default {"enabled":"true","defaultValue":"false"}
 * 
 * @param sceneOptionsCmd3
 * @text Command - UI Touch
 * @parent sceneOptions
 * @type struct<CommandBool>
 * @default {"enabled":"false","defaultValue":"false"}
 * 
 * @param sceneOptionsCmd8
 * @text Command - Screen Effects
 * @parent sceneOptions
 * @type struct<CommandBool>
 * @default {"enabled":"true","defaultValue":"false"}
 * 
 * @param sceneOptionsCmd4
 * @text Command - BGM Volume
 * @parent sceneOptions
 * @type struct<CommandNum>
 * @default {"enabled":"true","defaultValue":"100"}
 * 
 * @param sceneOptionsCmd5
 * @text Command - BGS Volume
 * @parent sceneOptions
 * @type struct<CommandNum>
 * @default {"enabled":"true","defaultValue":"100"}
 * 
 * @param sceneOptionsCmd6
 * @text Command - ME Volume
 * @parent sceneOptions
 * @type struct<CommandNum>
 * @default {"enabled":"true","defaultValue":"100"}
 * 
 * @param sceneOptionsCmd7
 * @text Command - SE Volume
 * @parent sceneOptions
 * @type struct<CommandNum>
 * @default {"enabled":"true","defaultValue":"100"}
 * 
 * @param sceneMap
 * @text Map
 * @desc Map Scenes Setup
 * @parent scenes
 * @default
 * 
 * @param sceneMapFastForward
 * @text Fast Forward
 * @desc Fast Forward is activated by pressing 'ok' while an event is being processed.
 * @parent sceneMap
 * @default
 * 
 * @param sceneMapFastForwardEnabled
 * @text Enabled?
 * @parent sceneMapFastForward
 * @type boolean
 * @default true
 * 
 * @param sceneMapFastForwardFactor
 * @text Acceleration Factor
 * @desc How many times the speed should be increased
 * @parent sceneMapFastForward
 * @type number
 * @default 2
 * @min 2
 * @max 32
 * 
 * @param windows
 * @text Windows
 * @desc Windows Global Setup
 * @default
 * 
 * @param drawItemBackground
 * @text Draw Item Background
 * @desc MZ has added a gradient background for all menu items. For better fidelity with the MV, it should be removed.
 * @parent windows
 * @type boolean
 * @default false
 * 
 * @param videos
 * @text Videos
 * @desc Videos Global Setup
 * @default
 * 
 * @param videosSetupList
 * @text Setup List
 * @desc Video volume setting.
 * @parent videos
 * @type struct<Video>[]
 * @default []
 */
/*~struct~CommandBool:
 * 
 * @param enabled
 * @text Enabled
 * @desc Should this command be enabled?
 * @type boolean
 * @default true
 * 
 * @param defaultValue
 * @text Default Value
 * @desc Sets the default value of this command.
 * @type boolean
 * @default true
 */
/*~struct~CommandNum:
 * 
 * @param enabled
 * @text Enabled
 * @desc Should this command be enabled?
 * @type boolean
 * @default true
 * 
 * @param defaultValue
 * @text Default Value
 * @desc Sets the default value of this command.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 */
/*~struct~Video:
 * 
 * @param filename
 * @text Filename
 * @desc Video Filename, without extension.
 * @type text
 * 
 * @param volume
 * @text Default Volume
 * @desc Sets the volume of the video when playing.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 */


(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_Core";
    $._params = PluginManager.parameters(pluginName);
    $.params = {};

    function deepParse(obj) {
        if (typeof obj === 'object') {

        } else {
            return JSON.parse(obj);
        }
    }

    //-----------------------------------------------------------------------------
    // * Computer Scene Flickering FIX
    //-----------------------------------------------------------------------------

    const alias_Game_Map_setup = Game_Map.prototype.setup;

    Object.assign(Game_Map.prototype, {

        setup() {
            alias_Game_Map_setup.apply(this, arguments);
            this.updateEvents();
        }

    });

    Object.assign(ImageManager, {

        clear(clearAll = false) {
            const 
            cache = this._cache,
            trash = new Set();
            for (const url in cache) { 
                if (clearAll || !(url.includes('parallaxes') || url.includes('pictures'))) {
                    trash.add(url)
                    cache[url].destroy();
                }
            }
            for (const key of trash) delete cache[key];
        }

    });

    //-----------------------------------------------------------------------------
    // * SCENES
    //-----------------------------------------------------------------------------

    $.params.scenes = {};
    const _scenesParams = $.params.scenes;
    _scenesParams.menuBgBlurStrength = Number($._params.menuBgBlurStrength);
    _scenesParams.menuBgOpacity = Number($._params.menuBgOpacity);
    _scenesParams.menuTouchButtonMargin = $._params.menuTouchButtonMargin === 'true';
    
    _scenesParams.options = {};
    const _optionsScene = _scenesParams.options;
    _optionsScene.alwaysDash = JSON.parse($._params.sceneOptionsCmd1);
    _optionsScene.commandRemember = JSON.parse($._params.sceneOptionsCmd2);
    _optionsScene.touchUI = JSON.parse($._params.sceneOptionsCmd3);
    _optionsScene.screenFx = JSON.parse($._params.sceneOptionsCmd8);
    _optionsScene.bgmVolume = JSON.parse($._params.sceneOptionsCmd4);
    _optionsScene.bgsVolume = JSON.parse($._params.sceneOptionsCmd5);
    _optionsScene.meVolume = JSON.parse($._params.sceneOptionsCmd6);
    _optionsScene.seVolume = JSON.parse($._params.sceneOptionsCmd7);

    _scenesParams.map = {};
    const _mapScene = _scenesParams.map;
    _mapScene.FastForwardEnabled = $._params.sceneMapFastForwardEnabled === 'true';
    _mapScene.FastForwardFactor = Number($._params.sceneMapFastForwardFactor);

    //-----------------------------------------------------------------------------
    // Scene_Base
    //
    // The superclass of all scenes within the game.

    const alias_Scene_Base_buttonAreaHeight = Scene_Base.prototype.buttonAreaHeight;

    Object.assign(Scene_Base.prototype, {

        buttonAreaHeight: function() {
            return alias_Scene_Base_buttonAreaHeight.apply(this, arguments) * (_scenesParams.menuTouchButtonMargin ? 1 : ConfigManager.touchUI);
        }

    });

    //-----------------------------------------------------------------------------
    // Scene_MenuBase
    //
    // The superclass of all the menu-type scenes.

    const alias_Scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground;

    Object.assign(Scene_MenuBase.prototype, {

        createBackground: function() {
            alias_Scene_MenuBase_createBackground.apply(this, arguments);
            this._backgroundFilter.blur = _scenesParams.menuBgBlurStrength;
            this.setBackgroundOpacity(_scenesParams.menuBgOpacity);
        }

    });

    //-----------------------------------------------------------------------------
    // Scene_Options
    //
    // The scene class of the options screen.

    Object.assign(Scene_Options.prototype, {

        maxCommands: function() {
            return Object.values(_optionsScene).filter((value) => { return value.enabled === 'true'; }).length;
        }

    });

    //-----------------------------------------------------------------------------
    // Window_Options
    //
    // The window for changing various settings on the options screen.

    const alias_Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;

    Object.assign(Window_Options.prototype, {

        makeCommandList: function() {
            alias_Window_Options_makeCommandList.apply(this, arguments);
            const disposeList = this._list.filter((value) => {
                return !JSON.parse(_optionsScene[value.symbol].enabled);
            });
            for (const item of disposeList) this._list.remove(item);
        }

    });

    //-----------------------------------------------------------------------------
    // ConfigManager
    //
    // The static class that manages the configuration data.

    const alias_ConfigManager_readFlag = ConfigManager.readFlag;
    const alias_ConfigManager_readVolume = ConfigManager.readVolume;

    Object.assign(ConfigManager, {

        readFlag: function(config, name) {
            if (!(name in config) && name in _optionsScene) {
                return _optionsScene[name].defaultValue === 'true';
            } else {
                return alias_ConfigManager_readFlag.apply(this, arguments);
            }
        },

        readVolume: function(config, name) {
            if (!(name in config) && name in _optionsScene) {
                return Number(_optionsScene[name].defaultValue).clamp(0, 100);
            } else {
                return alias_ConfigManager_readVolume.apply(this, arguments);
            }
        }

    });

    for (const key of Object.keys(_optionsScene)) {
        if (key in ConfigManager) {
            ConfigManager[key] = JSON.parse(_optionsScene[key].defaultValue);
        }
    }

    //-----------------------------------------------------------------------------
    // Scene_Map
    //
    // The scene class of the map screen.

    const alias_Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;

    Object.assign(Scene_Map.prototype, {

        updateMainMultiply: function() {
            let i = 0;
            const n = this.isFastForward() ? _mapScene.FastForwardFactor : 1;
            while (i < n) {
                this.updateMain();
                i++;
            }
        },

        isFastForward: function() {
            if (!_mapScene.FastForwardEnabled) return false;
            return alias_Scene_Map_isFastForward.apply(this, arguments);
        }

    })

    //-----------------------------------------------------------------------------
    // * WINDOWS
    //-----------------------------------------------------------------------------

    $.params.windows = {};
    const _windowsParams = $.params.windows;
    _windowsParams.drawItemBackground = $._params.drawItemBackground === 'true';
    
    //-----------------------------------------------------------------------------
    // Window_Selectable
    //
    // The window class with cursor movement functions.

    const alias_Window_Selectable_drawBackgroundRect = Window_Selectable.prototype.drawBackgroundRect;

    Object.assign(Window_Selectable.prototype, {

        drawBackgroundRect: function() {
            if (_windowsParams.drawItemBackground) alias_Window_Selectable_drawBackgroundRect.apply(this, arguments);
        }

    });

    //-----------------------------------------------------------------------------
    // * VIDEOS
    //-----------------------------------------------------------------------------

    $.params.videos = {};
    const _videosParams = $.params.videos;
    const videoTable = {};
    _videosParams.setupList = JSON.parse($._params.videosSetupList).map((value) => {
        value = JSON.parse(value);
        value.volume = Number(value.volume);
        videoTable[value.filename] = Math.max(0, Math.min(1, value.volume / 100));
        return value;
    });

    //-----------------------------------------------------------------------------
    // Game_Interpreter
    //
    // The interpreter for running event commands.    

    const alias_Game_Interpreter_command261 = Game_Interpreter.prototype.command261;

    Object.assign(Game_Interpreter.prototype, {

        command261(params) {
            const flag = alias_Game_Interpreter_command261.apply(this, arguments);
            if (flag) {
                const data = videoTable[params[0]];
                if (data) Video.setVolume(data);
            }
            return flag;
        }

    });

})(DRAGON.DollEye.Core);
