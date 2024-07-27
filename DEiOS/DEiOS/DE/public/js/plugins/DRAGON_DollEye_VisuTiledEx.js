//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_VisuTiledEx.js
//=============================================================================

var 
DRAGON                              = DRAGON                     || {};
DRAGON.DollEye                      = DRAGON.DollEye             || {};
DRAGON.DollEye.VisuTiledEx          = DRAGON.DollEye.VisuTiledEx || {};
DRAGON.DollEye.VisuTiledEx.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - VisuStella Tiled expansion for © Doll Eye. (v.1.0.0)
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
    const pluginName = "DRAGON_DollEye_VisuTiledEx";
    $._params        = PluginManager.parameters(pluginName);
    $.params         = {};

    //-----------------------------------------------------------------------------
    // Utils
    //
    // Utility functions.

    function getTiledObjectType(obj) {
        if      (obj.gid)     return 1; //Tile
        else if (obj.polygon) return 2; //Polygon
        else if (obj.ellipse) return 3; //Circle
        else if (!obj.point)  return 4; //Rectangle
        else                  return undefined;
    }

    function parseTiledObject(obj, type, normalize = true) {
        let tw = 1, th = 1;
        if (normalize) {
            tw = $gameMap.tileWidth();
            th = $gameMap.tileHeight();
        }
        switch (type) {
            case 2:
                const polygon = Altimit.Collider.createList(); //Polylines will be used to represent the polygons here
                const vertices = obj.polygon;
                for (let i = 0; i < vertices.length; i++) {
                    const j = (i + 1) % vertices.length;
                    const p1 = vertices[i];
                    const p2 = vertices[j];
                    Altimit.Collider.addToList(
                        polygon,
                        Altimit.Collider.createLine((obj.x + p1.x) / tw, (obj.y + p1.y) / th, (obj.x + p2.x) / tw, (obj.y + p2.y) / th)
                    );
                }
                return polygon;
            case 3:
                let d;
                if (obj.width < obj.height) {
                    d = obj.width / tw;
                } else {
                    d = obj.height / th;
                }
                return Altimit.Collider.createCircle((obj.x + obj.width / 2) / tw, (obj.y + obj.height / 2) / th, d / 2);
            case 4:
                return Altimit.Collider.createRect(obj.x / tw, obj.y / th, obj.width / tw, obj.height / th);
            default:
                return obj;
        }
    }

    //-----------------------------------------------------------------------------
    // DataManager
    //
    // The static class that manages the database and game objects.

    const alias_DataManager_recursiveExtractLayers = DataManager.recursiveExtractLayers;
    const alias_DataManager_getTilesetProperties = DataManager.getTilesetProperties;

    Object.assign(DataManager, {

        _tiledEvents: null,

        recursiveExtractLayers(groupLayer) {
            if (groupLayer.type === 'group' && groupLayer.name === 'EVENTS') {
                this.extractTiledEvents(groupLayer)
                return;
            }
            alias_DataManager_recursiveExtractLayers.apply(this, arguments);
        },

        extractTiledEvents(data) {
            this._tiledEvents = [];
            const
            tw = $gameMap.tileWidth(),
            th = $gameMap.tileHeight(),
            globalOffset = new Point(data.offsetx, data.offsety);
            for (const layer of data.layers) {
                if (layer.type !== "objectgroup") continue;
                const 
                localOffset = new Point(layer.offsetx, layer.offsety),
                event = { 
                    eventId: VisuMZ.TiledMZ.propertyValue(layer.properties, 'eventId') || null,
                    position: new Point((localOffset.x + globalOffset.x) / tw, (localOffset.y + globalOffset.y) / th), 
                    images: [], 
                    colliders: [] 
                },
                objects = layer.objects;
                for (const obj of objects) {
                    const type = getTiledObjectType(obj);
                    const parsed = parseTiledObject(obj, type);
                    if (obj === parsed) {
                        event.images.push(parsed);
                    } else {
                        event.colliders.push(parsed);
                    }
                }
                this._tiledEvents.push(event);
            }
        },

        getTilesetProperties(tileset) {
            if (tileset.tiles) {
                tileset.tilemaxid = tileset.tiles.reduce((max, value) => Math.max(max, value.id), -Infinity);
            } else {
                tileset.tilemaxid = tileset.tilecount - 1;
            }
            tileset.lastgid = tileset.firstgid + tileset.tilemaxid + 1;
            alias_DataManager_getTilesetProperties.apply(this, arguments);
        }

    });

    VisuMZ.TiledMZ.getTextureId = function(tileId) {
        let textureId = 0; 
        const tilesets = $gameMap.tiledData.tilesets;
        for (let i = 0; i < tilesets.length; ++i) {
            const tileset = tilesets[i];
            if (tileId < tileset.firstgid || tileId >= tileset.lastgid) {
                textureId++;
                continue;
            }
            break;
        }
        return textureId;
    };

    //-----------------------------------------------------------------------------
    // CollisionMesh
    //
    // --

    Object.assign(Altimit.CollisionMesh, {

        parseTiledColliders(data, colliders) {
            for (const layer of data.layers) {
                if (!(layer.type === 'objectgroup' && layer.collision && layer.collision === 'mesh')) continue;
                for (const obj of layer.objects) {
                    const type = getTiledObjectType(obj);
                    const parsed = parseTiledObject(obj, type);
                    if (obj !== parsed) colliders.push(parsed);
                }
            }
            return colliders;
        }

    });

    //-----------------------------------------------------------------------------
    // Game_Map
    //
    // The game object class for a map. It contains scrolling and passage
    // determination functions.

    const alias_Game_Map_setupEvents = Game_Map.prototype.setupEvents;

    Object.assign(Game_Map.prototype, {

        setupEvents() {
            alias_Game_Map_setupEvents.apply(this, arguments);
            this.setupTiledEvents();
        },

        setupTiledEvents() {
            this._availableIds = [];
            if (this.isTiled()) {
                let maxId = 0;
                const ids = $dataMap.events.slice(1).reduce((accumulator, value, index) => {
                    if (!value) accumulator.push(index + 1);
                    if (value) maxId = Math.max(maxId, value.id);
                    return accumulator;
                }, []);
                this._availableIds = ids;
                for (const tiledEvent of DataManager._tiledEvents) {
                    const id = tiledEvent.eventId && Number(tiledEvent.eventId) || this.getEventNextId();
                    const event = new Game_TiledEvent(this._mapId, id);
                    this._events[id] = event;
                    event.setTiledData(tiledEvent);
                }
            }
        },

        getEventNextId() {
            if (this._availableIds.length) {
                return this._availableIds.shift();
            } else {
                let maxId = 1;
                for (const event of this._events) maxId = Math.max(event.id, maxId);
                return maxId + 1;
            }
        }

    });

    //-----------------------------------------------------------------------------
    // Game_TiledEvent
    //
    // --

    class Game_TiledEvent extends Game_Event {

        initialize(mapId, eventId) {
            this._emptyEventData = !$dataMap.events[eventId] && JSON.parse(JSON.stringify(Game_Event.emptyEventData)) || null;
            super.initialize(...arguments);
        }

        event() {
            return this._emptyEventData || super.event();
        }

        setTiledData(data) {
            this._tiledData = data;
            this.locate(data.position.x, data.position.y);
            const colliders = data.colliders
            if (colliders.length === 1) {
                this.setCollider(colliders[0]);
            } else if (colliders.length) {
                const collider = Altimit.Collider.createList();
                for (const c of colliders) Altimit.Collider.addToList(collider, c);
                this.setCollider(collider);
            }
            this._tiledImages = [];
            for (const image of data.images) {
                this._tiledImages.push(new Game_TiledObject(image));
            }
            this.setPriorityType(1);
        }
        /*
        setCollider(collider) {
            var pages = this.event().pages;
            for (const page of pages) page._collider = collider;
        }*/

        setPosition(x, y) {
            this._x = x;
            this._y = y;
            this._realX = x;
            this._realY = y;
        }

        screenX() {
            return Math.floor(this.scrolledX() * $gameMap.tileWidth());
        }

        screenY() {
            return Math.floor(this.scrolledY() * $gameMap.tileHeight());
        }

    }

    globalThis.Game_TiledEvent = Game_TiledEvent;

    Game_Event.emptyEventData = {"id":0,"name":"EV","note":"","pages":[{"conditions":{"actorId":1,"actorValid":false,"itemId":1,"itemValid":false,"selfSwitchCh":"A","selfSwitchValid":false,"switch1Id":1,"switch1Valid":false,"switch2Id":1,"switch2Valid":false,"variableId":1,"variableValid":false,"variableValue":0},"directionFix":false,"image":{"characterIndex":0,"characterName":"","direction":2,"pattern":0,"tileId":0},"list":[{"code":0,"indent":0,"parameters":[]}],"moveFrequency":3,"moveRoute":{"list":[{"code":0,"parameters":[]}],"repeat":true,"skippable":false,"wait":false},"moveSpeed":3,"moveType":0,"priorityType":0,"stepAnime":false,"through":false,"trigger":0,"walkAnime":true}],"x":0,"y":0,"meta":{}};

    //-----------------------------------------------------------------------------
    // Sprite_Character
    //
    // The sprite for displaying a character.

    const alias_Sprite_Character_initialize = Sprite_Character.prototype.initialize;
    const alias_Sprite_Character_isEmptyCharacter = Sprite_Character.prototype.isEmptyCharacter;
    const alias_Sprite_Character_update = Sprite_Character.prototype.update;

    Object.assign(Sprite_Character.prototype, {

        initialize() {
            alias_Sprite_Character_initialize.apply(this, arguments);
            this.initTiledImages();
        },

        initTiledImages() {
            const images = this._character._tiledImages;
            if (images) {
                this._tiledImages = images;
                for (const image of images) this.addChildAt(new Sprite_TiledObjectEx(image), 0);
            }
        },

        isEmptyCharacter() {
            return (this._tiledImages ? !this._tiledImages.length : true) && alias_Sprite_Character_isEmptyCharacter.apply(this, arguments);
        },

        update() {
            alias_Sprite_Character_update.apply(this, arguments);
        }

    });

    //-----------------------------------------------------------------------------
    // Sprite_TiledObject
    //
    // --

    class Sprite_TiledObjectEx extends Sprite_TiledObject {

        setup(data) {
            super.setup(data);
            this.position.set(data.x, data.y);
        }

        update() {
            Sprite.prototype.update.call(this);
            this.updateAnim();
        }

    }

})(DRAGON.DollEye.VisuTiledEx);
