//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_PicturesLayers.js
//=============================================================================

var 
DRAGON                                 = DRAGON                        || {};
DRAGON.DollEye                         = DRAGON.DollEye                || {};
DRAGON.DollEye.PicturesLayers          = DRAGON.DollEye.PicturesLayers || {};
DRAGON.DollEye.PicturesLayers.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Pictures Layers Utility for © Doll Eye. (v.1.0.0)
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
    const pluginName = "DRAGON_DollEye_PicturesLayers";
    $._params = PluginManager.parameters(pluginName);
    $.params = {};

    const _layersTable = {
        bottom: 0,
        below_tilemap: 1,
        below_characters: 2,
        above_characters: 3,
        below_weather: 4,
        top: 5,
        default: 6
    };

    const _maxLayer = Object.keys(_layersTable).length - 1; 

    //-----------------------------------------------------------------------------
    // Game_Interpreter
    //
    // The interpreter for running event commands.

    const alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Object.assign(Game_Interpreter.prototype, {

        pluginCommand: function(command, args) {
            //console.log('PLUGIN COMMAND: ' + command);
            switch(command) {
                case 'BindPictureToMap':
                    this._setupPicture(Number(args[0]), args[1], true);
                    break;
                case 'UnbindPictureFromMap':
                    //TODO
                    break;
                case 'ChangePictureLayer':
                    //TODO
                    break;
                case 'START_BindPicturesToMap':
                    //TODO
                    break;
                case 'STOP_BindPicturesToMap':
                    //TODO
                    break;
                default:
                    alias_Game_Interpreter_pluginCommand.apply(this, arguments);
                    break;
            }
        },

        _setupPicture(pictureId, layer, bindToMap) {
            const picture = $gameScreen.picture(pictureId);
            if (picture) {
                picture.setLayer(layer);
                picture.setMapBind(bindToMap);
            }
        }

    });

    //-----------------------------------------------------------------------------
    // Game_Picture
    //
    // The game object class for a picture.

    const alias_Game_Picture_initialize = Game_Picture.prototype.initialize;
    const alias_Game_Picture_x = Game_Picture.prototype.x;
    const alias_Game_Picture_y = Game_Picture.prototype.y;

    Object.assign(Game_Picture.prototype, {
        
        initialize: function() {
            alias_Game_Picture_initialize.apply(this, arguments);
            this.resetLayer();
            this.resetMapBind();
        },

        resetLayer: function() {
            this.setLayer(Object.values(_layersTable).reverse()[0]);
        },

        setLayer: function(layer) {
            switch (typeof layer) {
                case 'string':
                    this.setLayer(_layersTable[layer] || _maxLayer)
                    break;
                case 'number':
                    const lastLayer = this._layer;
                    this._layer = layer.clamp(0, _maxLayer);
                    if (this._layer != lastLayer) this.onLayerChange();
                    break;
            }
        },

        onLayerChange: function() {
            this.layerChangedFlag = true;
        },

        setMapBind: function(value) {
            if (typeof value === 'boolean') this._mapLinked = value;
        },

        resetMapBind: function() {
            this._mapLinked = false
        },

        isMapLinked: function() {
            return (this._mapLinked || false) && (SceneManager._scene instanceof Scene_Map); //TODO 
        },

        layer: function() {
            return this._layer;
        },

        x: function() {
            const px = alias_Game_Picture_x.call(this);
            if (this.isMapLinked()) {
                const tw = $gameMap.tileWidth();
                return Math.floor($gameMap.adjustX(px / tw) * tw);
            } else {
                return px;
            }
        },

        y: function() {
            const py = alias_Game_Picture_y.call(this);
            if (this.isMapLinked()) {
                const th = $gameMap.tileHeight();
                return Math.floor($gameMap.adjustY(py / th) * th);
            } else {
                return py;
            }
        },

    });

    //-----------------------------------------------------------------------------
    // Sprite_Picture
    //
    // The sprite for displaying a picture.

    const alias_Sprite_Picture_updateOther = Sprite_Picture.prototype.updateOther;

    Object.assign(Sprite_Picture.prototype, {

        updateOther() {
            alias_Sprite_Picture_updateOther.apply(this, arguments);
            this.checkForLayerChange();
        },

        checkForLayerChange: function() {
            const picture = this.picture();
            if (picture && picture.layerChangedFlag) {
                picture.layerChangedFlag = false
                this.refreshLayer();
            }  
        },

        refreshLayer: function() {
            const picture = this.picture();
            if (picture) Spriteset_Map.instance.addPictureToLayer(this, picture.layer());
        }

    });
    
    //-----------------------------------------------------------------------------
    // Spriteset_Map
    //
    // The set of sprites on the map screen.

    Spriteset_Map.instance = null;

    const alias_Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
    const alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    const alias_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;

    Object.assign(Spriteset_Map.prototype, {

        initialize: function() {
            Spriteset_Map.instance = this;
            this._pictureLayers = [];
            alias_Spriteset_Map_initialize.apply(this, arguments);
        },

        createLowerLayer: function() {
            alias_Spriteset_Map_createLowerLayer.apply(this, arguments);
            const
            base = this._baseSprite,
            tilemap = this._tilemap;
            this.setupPictureLayer(this.createPictureLayer(0), base, 0); //bottom
            this.setupPictureLayer(this.createPictureLayer(0), base, base.children.indexOf(this._parallax) + 1); //below_tilemap
            this.setupPictureLayer(this.createPictureLayer(0), tilemap, 0); //below_characters
            this.setupPictureLayer(this.createPictureLayer(8), tilemap, 0); //above_characters
            this.setupPictureLayer(this.createPictureLayer(8), tilemap, 0); //below_weather
        },

        createUpperLayer: function() {
            alias_Spriteset_Map_createUpperLayer.apply(this, arguments);
            const
            defaultLayer = this._pictureContainer;
            this.setupPictureLayer(this.createPictureLayer(0), this, this.children.indexOf(defaultLayer)); //top
            this.setupPictureLayer(this.createPictureLayer(0, defaultLayer), this, this.children.indexOf(defaultLayer) + 1); //default
            this.refreshPicturesLayer();
        },

        createPictureLayer: function(zIndex = 0, sprite = null) {
            const layer = sprite || new Sprite();
            const rect = this.pictureContainerRect();
            layer.z = zIndex;
            layer.setFrame(rect.x, rect.y, rect.width, rect.height);
            layer.onChildrenChange = function() {
                this.children.sort((a, b) => { return a._pictureId - b._pictureId })
            }.bind(layer);
            return layer;
        },

        setupPictureLayer(pictureLayer, parent, index) {
            this._pictureLayers.push(pictureLayer);
            parent.addChildAt(pictureLayer, index);
        },

        addPictureToLayer(picture, layer) {
            switch (typeof layer) {
                case 'string':
                    this.addPictureToLayer(picture, _layersTable[layer] || _maxLayer)
                    break;
                case 'number':
                    const pictureLayer = this._pictureLayers[layer];
                    if (pictureLayer) pictureLayer.addChild(picture);
                    break;
            }
        },

        refreshPicturesLayer: function() {
            for (const picture of [...this._pictureContainer.children]) picture.refreshLayer();
        }

    });

})(DRAGON.DollEye.PicturesLayers);
