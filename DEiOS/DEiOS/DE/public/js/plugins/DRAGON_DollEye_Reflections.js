//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_Reflections.js
//=============================================================================

var 
DRAGON                              = DRAGON                     || {};
DRAGON.DollEye                      = DRAGON.DollEye             || {};
DRAGON.DollEye.Reflections          = DRAGON.DollEye.Reflections || {};
DRAGON.DollEye.Reflections.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Reflections for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * @command setupMirror
 * @text Setup Mirror
 * @desc Setup Mirror Spriteset
 * @default
 * 
 * @arg key
 * @text Key
 * @type text
 * @default 1
 * 
 * @arg type
 * @text Type
 * @desc Above: Reflects what is above, ideal for surfaces
 * In front: Reflects what is in front, ideal for mirrors
 * @type combo
 * @default Above
 * @option Above
 * @option In front
 * 
 * @arg targetEvent
 * @text Target Event ID
 * @desc 0 - this event 
 * @type text
 * @default 0
 * 
 * @arg offsetX
 * @text Offset X
 * @type text
 * @default 0
 * 
 * @arg offsetY
 * @text Offset Y
 * @type text
 * @default 0
 * 
 * @arg maskFile
 * @text Mask Sprite File
 * @type file
 * @dir img/
 * @default pictures
 * 
 * @arg coverFile
 * @text Cover Sprite File
 * @type file
 * @dir img/
 * @default pictures
 * 
 * @arg coverFileOpacity
 * @text Cover Sprite Opacity
 * @parent coverFile
 * @type text
 * @default 255
 * 
 * @arg charMaskList
 * @text Characters Mask List
 * @desc List of characters that can be reflected. If left empty the default (Player + Followers) will be used.
 * @type text
 * @default 
 * 
 */

(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_Reflections";
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

        setupMirror(args) {
            const 
            key = [this._mapId, (Number(args.targetEvent) ? Number(args.targetEvent) : this._eventId)],
            params = Object.assign({}, args);
            let index;
            params.maskFile = parseStringParam(params.maskFile);
            index = params.maskFile.indexOf('/');
            index >= 0 ? (params.maskFile = ['img/' + params.maskFile.slice(0, index + 1), params.maskFile.slice(index + 1)]) : params.maskFile = null;
            params.coverFile = parseStringParam(params.coverFile);
            index = params.coverFile.indexOf('/');
            index >= 0 ? (params.coverFile = ['img/' + params.coverFile.slice(0, index + 1), params.coverFile.slice(index + 1)]) : params.coverFile = null;
            params.key = parseNumberParam(args.key);
            params.offsetX = parseNumberParam(args.offsetX);
            params.offsetY = parseNumberParam(args.offsetY);
            params.coverOpacity = parseNumberParam(args.coverFileOpacity);
            let obj = $gameSystem.eventsRfxTable[key];
            if (!obj) obj = $gameSystem.eventsRfxTable[key] = {};
            obj[params.key] = params;
        }

	});

    const parseRegExp = /^(v|s)\[(\d+)\]/i;

    const parseNumberParam = function(string) {
        const num = Number(string);
        if (isNaN(num)) {
            const match = string.trim().match(parseRegExp);
            if (match.shift()) {
                switch(match[0]) {
                    case 's': return $gameSwitches.value(Number(match[1]));
                    case 'v': return $gameVariables.value(Number(match[1]));
                }
            }
            return 0;
        } else {
            return num;
        }
    }

    const parseStringParam = function(string) {
        const match = string.match(parseRegExp);
        if (match) {
            if (match.shift()) {
                switch(match[0]) {
                    case 's': return String($gameSwitches.value(Number(match[1])));
                    case 'v': return String($gameVariables.value(Number(match[1])));
                }
            }
        } else {
            return String(string);
        }
    }

    //-----------------------------------------------------------------------------
    // Game_System
    //
    // The game object class for the system data.

    const alias_Game_System_initialize = Game_System.prototype.initialize;

    Object.assign(Game_System.prototype, {

        initialize() {
            alias_Game_System_initialize.apply(this, arguments);
        },

        createEventsRfxTable() {
            this._eventsRfxTable = {};
            return this._eventsRfxTable;
        }

    });

    Object.defineProperties(Game_System.prototype, {
        eventsRfxTable: {
            get: function() {
                return this._eventsRfxTable || this.createEventsRfxTable();
            },
            configurable: true
        }
    });

    //-----------------------------------------------------------------------------
    // Reflective_Sprite
    //
    // --

    class Reflective_Sprite extends Sprite {

        constructor(data) {
            super();
            this._data = data;
            this.position.set(data.offsetX, data.offsetY);
            this.createMaskSprite();
            this.createRfxContainer();
            this.createCoverSprite();
            this.createFilters();
        }

        createMaskSprite() {
            const sprite = this._maskSprite = new Sprite();
            sprite.z = -1;
            this.addChild(sprite);
            this.mask = sprite;
            sprite.anchor.set(0.5, 1.0)
            if (!this._data.maskFile) return;
            sprite.bitmap = ImageManager.loadBitmap(...this._data.maskFile);
        }

        createRfxContainer() {
            const 
            sprite = this._reflections = new Sprite(),
            group = this.getReflectionsGroup(),
            klass = this.getReflectionsClass();
            for (const entity of group) {
                if (entity) {
                    const child = new klass(entity);
                    if (this._data.type === 'Above') child.filters = [new SimpleFadeFilter()];
                    sprite.addChild(child);
                }
            }
            this.addChild(sprite);
        }

        getReflectionsClass() {
            return (this._data.type === 'Above' ? Sprite_ReflectedCharacter2 : Sprite_ReflectedCharacter);
        }

        getReflectionsGroup() {
            return (this._data.charMaskList ? eval(this._data.charMaskList) : [$gamePlayer, ...$gamePlayer.followers()._data]);
        }

        createCoverSprite() {
            const sprite = this._coverSprite = new Sprite();
            this._coverSprite.alpha = this._data.coverOpacity / 255;
            sprite.z = Infinity;
            this.addChild(sprite);
            sprite.anchor.set(0.5, 1.0)
            if (!this._data.coverFile) return;
            sprite.bitmap = ImageManager.loadBitmap(...this._data.coverFile);
        }

        createFilters() {
            if (this._data.type != 'Above') return;
            this._displacement = new Sprite();
            this._displacement.bitmap = ImageManager.loadPicture('waterDisplacement');
            this._displacement.bitmap.addLoadListener(function() {
                this._displacement.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                this._displacementFilter = new PIXI.filters.DisplacementFilter(this._displacement, 6);
                this._reflections.filters = [this._displacementFilter];
                this._reflections.addChild(this._displacement);
            }.bind(this))
        }

        update() {}

        updateEx() {
            this._reflections._recursivePostUpdateTransform();
            if (this._displacement) {
                this._displacement.x += 1;
                this._displacement.y += 1;
            }
            super.update();
            if (this._data.type === 'Above') {
                this._reflections.children.sort(this._sortReflections2.bind(this._reflections));
            } else {
                this._reflections.children.sort(this._sortReflections.bind(this._reflections));
            }
            
        }

        _sortReflections(a, b) {
            return -Tilemap.prototype._compareChildOrder(a, b);
        }

        _sortReflections2(a, b) {
            return Tilemap.prototype._compareChildOrder(a, b);
        }
        
    }

    //-----------------------------------------------------------------------------
    // Sprite_ReflectedCharacter
    //
    // --

    class Sprite_ReflectedCharacter extends Sprite_Character {

        constructor() {
            super(...arguments);
            this.scale.x = -1;
        }

        characterPatternY() {
            return ((10 - this._character.direction()) - 2) / 2;
        }

        updatePosition() {
            super.updatePosition();
            const 
            selfGlobal = this.getGlobalPosition(undefined, true),
            parentGlobal = this.parent.getGlobalPosition(undefined, true),
            dx = selfGlobal.x - parentGlobal.x * 2,
            dy = selfGlobal.y - parentGlobal.y * 2;
            this.position.set(
                dx,
                dy - 256 * Math.pow(dy / 500, 0.75)
            );
        }

    }

    //-----------------------------------------------------------------------------
    // Sprite_ReflectedCharacter2
    //
    // --

    class Sprite_ReflectedCharacter2 extends Sprite_Character {

        constructor() {
            super(...arguments);
            this.scale.y = -1;
        }

        updatePosition() {
            super.updatePosition();
            const 
            selfGlobal = this.getGlobalPosition(undefined, true),
            parentGlobal = this.parent.getGlobalPosition(undefined, true),
            dx = selfGlobal.x - parentGlobal.x * 2,
            dy = selfGlobal.y - parentGlobal.y * 2;
            this.position.set(
                dx,
                dy - 12
            );
        }

    }

    //-----------------------------------------------------------------------------
    // SimpleFadeFilter
    //
    // --

    const _frag = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float dephtBottom;
    uniform float dephtTop;
    void main(void)
    {
       vec4 color = texture2D(uSampler, vTextureCoord);
       if(vTextureCoord.y < 0.25)
       {
          color.rgba *= vTextureCoord.y * 4.0;
       }
       gl_FragColor = color;
    }
    `;

    class SimpleFadeFilter extends PIXI.Filter {

        constructor() {
            super(null, _frag,);
        }
    }

    $.SimpleFadeFilter = SimpleFadeFilter;

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
            this.createReflections();
        },

        createReflections() {
            const 
            char = this._character,
            obj = $gameSystem.eventsRfxTable[[char._mapId, char._eventId]];
            if (obj) {
                this._reflections = [];
                for (const settings of Object.values(obj)) {
                    const sprite = new Reflective_Sprite(settings);
                    this._reflections.push(sprite);
                    this.addChild(sprite);
                }
            } else {
                this._reflections = null;
            }
        },

        isEmptyCharacter() {
            return alias_Sprite_Character_isEmptyCharacter.apply(this) && !this._reflections;
        },

        update() {
            alias_Sprite_Character_update.apply(this, arguments);
            //Reflections need to be updated after the parent sprite so that there is no delay in positioning
            if (this._reflections) for (const reflection of this._reflections) reflection.updateEx();
        }

    });

    //-----------------------------------------------------------------------------
    // Spriteset_Map
    //
    // The set of sprites on the map screen.

    const alias_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;

    Object.assign(Spriteset_Map.prototype, {

        createCharacters() {
            alias_Spriteset_Map_createCharacters.apply(this, arguments);
            this._tilemap.update();
        }

    });

})(DRAGON.DollEye.Reflections);
