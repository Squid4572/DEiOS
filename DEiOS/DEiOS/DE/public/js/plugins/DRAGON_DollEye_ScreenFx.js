//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_ScreenFx.js
//=============================================================================

var 
DRAGON                           = DRAGON                  || {};
DRAGON.DollEye                   = DRAGON.DollEye          || {};
DRAGON.DollEye.ScreenFx          = DRAGON.DollEye.ScreenFx || {};
DRAGON.DollEye.ScreenFx.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Custom Screen Effects for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * 
 * @command addLocalFx
 * @text Add Local Effect
 * @desc Adds a effect to the current map
 * 
 * @arg key
 * @text Key
 * @desc The key that references the effect. If left blank, the effect name will be used.
 * @type text
 * 
 * @arg fx
 * @text Effect
 * @desc Description
 * @type combo
 * @default
 * @option NoiseFx
 * @option ChromaticAberrationFx
 * @option BloomFx
 * 
 * @arg params
 * @text Params
 * @desc Effect Parameters
 * @type text
 * @default []
 * 
 */



(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_ScreenFx";
    $._params        = PluginManager.parameters(pluginName);
    $.params         = Object.assign({}, $._params);

    //-----------------------------------------------------------------------------
    // PluginManager
    //
    // The static class that manages the plugins.

    const assignPluginCommands = function(pluginName, obj) {
        const proto = obj.prototype;
        for (const commandName of Object.getOwnPropertyNames(proto)) {
            if (commandName === 'constructor') continue;
            const func = proto[commandName];
            if (typeof func === "function") PluginManager.registerCommand(pluginName, commandName, func);
        }
    }
	assignPluginCommands(pluginName, class {

        addLocalFx(args) {
            setMapEffect($gameMap.mapId(), args)
        }

	});

    //-----------------------------------------------------------------------------
    // * FILTERS
    //-----------------------------------------------------------------------------

    class NoiseFx extends PIXI.filters.NoiseFilter {

        constructor(params) {
            super(...params);
            this._params = params;
            Object.defineProperties(this.uniforms, {
                uNoise: {
                    get: function() { return params[0] },
                    set: function(value) { params[0] = value },
                    configurable: true,
                },
                uSeed: {
                    get: function() { return Math.random(); },
                    configurable: true,
                }
            });
        }
        
    }

    $.NoiseFx = NoiseFx;

    class ChromaticAberrationFx extends PIXI.filters.RGBSplitFilter { 
        
        constructor(params) {
            super(...params);
            this._params = params;
            Object.defineProperties(this.uniforms, {
                red: {
                    get: function() { return params[0] },
                    set: function(value) { params[0] = value },
                    configurable: true,
                },
                green: {
                    get: function() { return params[1] },
                    set: function(value) { params[1] = value },
                    configurable: true,
                },
                blue: {
                    get: function() { return params[2] },
                    set: function(value) { params[2] = value },
                    configurable: true,
                }
            });
        }

    }

    $.ChromaticAberrationFx = ChromaticAberrationFx;

    class BloomFx extends PIXI.filters.AdvancedBloomFilter { 

        constructor(params) {
            super(...params);
            this._params = params;
            Object.defineProperties(this, {
                bloomScale: {
                    get: function() { return params[0].bloomScale },
                    set: function(value) { params[0].bloomScale = value },
                    configurable: true,
                }
            })
        }
        
    }

    $.BloomFx = BloomFx;

    //-----------------------------------------------------------------------------
    // ConfigManager
    //
    // The static class that manages the configuration data.

    const alias_ConfigManager_makeData = ConfigManager.makeData;
    const alias_ConfigManager_applyData = ConfigManager.applyData;

    Object.assign(ConfigManager, {

        screenFx: true,

        makeData() {
            const config = alias_ConfigManager_makeData.apply(this, arguments);
            config.screenFx = this.screenFx;
            return config;
        },

        applyData(config) {
            alias_ConfigManager_applyData.apply(this, arguments);
            this.screenFx = this.readFlag(config, "screenFx", true);
        }

    });

    //-----------------------------------------------------------------------------
    // Window_Options
    //
    // The window for changing various settings on the options screen.

    const alias_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;

    Object.assign(Window_Options.prototype, {

        addGeneralOptions() {
            alias_Window_Options_addGeneralOptions.apply(this, arguments);
            this.addCommand('Screen Effects', "screenFx");
        }

    })

    //-----------------------------------------------------------------------------
    // Scene_Base
    //
    // The superclass of all scenes within the game.

    const alias_Scene_Base_initialize = Scene_Base.prototype.initialize;

    Object.assign(Scene_Base.prototype, {

        initialize() {
            alias_Scene_Base_initialize.apply(this, arguments);
            this.createFiltersEx();
        },

        createFiltersEx() {
            if (!this.filters) this.filters = [];
            /* */
        }

    });

    //-----------------------------------------------------------------------------
    // Game_System
    //
    // The game object class for the system data.

    const alias_Game_System_initialize = Game_System.prototype.initialize;

    Object.assign(Game_System.prototype, {

        initialize() {
            alias_Game_System_initialize.apply(this, arguments);
            this.createMapEffectsTable();
        },

        createMapEffectsTable() {
            this._mapEffectsTable = {};
            return this._mapEffectsTable
        }

    });

    Object.defineProperties(Game_System.prototype, {
        mapEffectsTable: {
            get: function() {
                return this._mapEffectsTable || this.createMapEffectsTable();
            },
            configurable: true
        }
    });

    //-----------------------------------------------------------------------------
    // Scene_Map
    //
    // The scene class of the map screen.

    const getMapEffects = function(mapId) {
        const mapEffectsTable = $gameSystem.mapEffectsTable;
        let obj = mapEffectsTable[mapId];
        if (!obj) {
            obj = {};
            mapEffectsTable[mapId] = obj;
        }
        return obj;
    }

    const setMapEffect = function(mapId, settings) {
        const obj = getMapEffects(mapId);
        obj[settings.key] = {
            fx: settings.fx,
            params: (typeof settings.params === 'string' ? eval(settings.params) : settings.params)
        };
    }

    const alias_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;

    Object.assign(Scene_Map.prototype, {

        createFiltersEx() {
            Scene_Base.prototype.createFiltersEx.apply(this, arguments);
            if (!ConfigManager.screenFx) return;
            //const filters = this.filters;
            //filters.push(new NoiseFx([0.05]));
        },

        onMapLoaded() {
            alias_Scene_Map_onMapLoaded.apply(this, arguments);
            if (!ConfigManager.screenFx) return;
            const filters = this.filters;
            for (const [key, value] of Object.entries(getMapEffects($gameMap.mapId()))) {
                filters.push(new $[value.fx](value.params))
            }
        }

    });

})(DRAGON.DollEye.ScreenFx);
