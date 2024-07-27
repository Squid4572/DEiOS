//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_RelentlessGaze.js
//=============================================================================

var 
DRAGON                                 = DRAGON                        || {};
DRAGON.DollEye                         = DRAGON.DollEye                || {};
DRAGON.DollEye.RelentlessGaze          = DRAGON.DollEye.RelentlessGaze || {};
DRAGON.DollEye.RelentlessGaze.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Relentless Gaze for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * @command setupEye
 * @text Setup Eye
 * @desc Setup Eye Spriteset
 * @default
 * 
 * @arg key
 * @text Key
 * @type text
 * @default 1
 * 
 * @arg targetEvent
 * @text Target Event ID
 * @desc 0 - this event 
 * @type number
 * @default 0
 * 
 * @arg offsetX
 * @text Offset X
 * @type number
 * @min -512
 * @max 512
 * @decimals 4
 * @default 0
 * 
 * @arg offsetY
 * @text Offset Y
 * @min -512
 * @max 512
 * @type number
 * @decimals 4
 * @default 0
 * 
 * @arg pupilFile
 * @text Pupil Sprite File
 * @type file
 * @dir img/
 * @default pictures
 * 
 * @arg pupilFileSpin
 * @text Pupil Sprite Spin
 * @parent pupilFile
 * @type number
 * @min -360
 * @max 360
 * @default 0
 * 
 * @arg baseFile
 * @text Base Sprite File
 * @type file
 * @dir img/
 * @default pictures
 * 
 * @arg baseFileFrames
 * @text Base Sprite Frames
 * @parent baseFile
 * @type number
 * @min 0
 * @max 256
 * @default 1
 * 
 * @arg baseFileWidthOffset
 * @text Base Sprite Width Offset
 * @desc Pupil position is set based on the size of the base sprite, so offset it if needed.
 * @parent baseFile
 * @type number
 * @min -512
 * @max 512
 * @default 0
 * 
 * @arg baseFileHeightOffset
 * @text Base Sprite Height Offset
 * @desc Pupil position is set based on the size of the base sprite, so offset it if needed.
 * @parent baseFile
 * @type number
 * @min -512
 * @max 512
 * @default 0
 * 
 */

(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_RelentlessGaze";
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

        setupEye(args) {
            const 
            key = [this._mapId, (Number(args.targetEvent) ? Number(args.targetEvent) : this._eventId)],
            params = Object.assign({}, args);
            params.baseFile = parseStringParam(params.baseFile);
            let 
            index = params.baseFile.indexOf('/');
            index >= 0 ? (params.baseFile = ['img/' + params.baseFile.slice(0, index + 1), params.baseFile.slice(index + 1)]) : params.baseFile = null;
            params.pupilFile = parseStringParam(params.pupilFile);
            index = params.pupilFile.indexOf('/');
            index >= 0 ? (params.pupilFile = ['img/' + params.pupilFile.slice(0, index + 1), params.pupilFile.slice(index + 1)]) : params.pupilFile = null;
            params.key = parseNumberParam(args.key);
            params.offsetX = parseNumberParam(args.offsetX);
            params.offsetY = parseNumberParam(args.offsetY);
            params.pupilFileSpin = parseNumberParam(args.pupilFileSpin);
            params.baseFileFrames = Number(args.baseFileFrames);
            params.baseFileWidthOffset = Number(args.baseFileWidthOffset);
            params.baseFileHeightOffset = Number(args.baseFileHeightOffset);
            let obj = $gameSystem.eventsEyesTable[key];
            if (!obj) obj = $gameSystem.eventsEyesTable[key] = {};
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
            this.createEventsEyesTable();
        },

        createEventsEyesTable() {
            this._eventsEyesTable = {};
            return this._eventsEyesTable;
        }

    })

    Object.defineProperties(Game_System.prototype, {
        eventsEyesTable: {
            get: function() {
                return this._eventsEyesTable || this.createEventsEyesTable();
            },
            configurable: true
        }
    });

    //-----------------------------------------------------------------------------
    // Eye_Sprite
    //
    // --

    class Eye_Sprite extends Sprite {

        constructor({ pupilFile, baseFile, offsetX = 0, offsetY = 0, pupilFileSpin = 0, baseFileFrames = 1, baseFileWidthOffset = 0, baseFileHeightOffset = 0 } = {}) {
            super();
            this._pupilFile = pupilFile;
            this._baseFile = baseFile;
            this._pupilSpin = (pupilFileSpin / 180) * Math.PI;
            this._baseWidthOffset = baseFileWidthOffset;
            this._baseHeightOffset = baseFileHeightOffset;
            this.position.set(offsetX, offsetY);
            this.createMaskSprite();
            this.createBaseSprite();
            this.createPupilSprite();
        }

        createPupilSprite() {
            const sprite = this._pupil = new Sprite();
            this.addChild(sprite);
            sprite.anchor.set(0.5, 0.5)
            if (!this._pupilFile) return;
            sprite.bitmap = ImageManager.loadBitmap(...this._pupilFile);
        }

        createBaseSprite() {
            this._halfWidth = null;
            this._halfHeight = null;
            const sprite = this._base = new Sprite();
            this.addChild(sprite);
            sprite.anchor.set(0.5, 0.5)
            if (!this._baseFile) return;
            sprite.bitmap = ImageManager.loadBitmap(...this._baseFile);
            sprite.bitmap.addLoadListener(function() {
                this._halfWidth = (sprite.width + this._baseWidthOffset) / 2;
                this._halfHeight = (sprite.height + this._baseHeightOffset) / 2;
            }.bind(this));
        }

        createMaskSprite() {
            const sprite = this._maskSprite = new Sprite();
            this.addChild(sprite);
            this.mask = sprite;
            sprite.anchor.set(0.5, 0.5)
            if (!this._baseFile) return;
            sprite.bitmap = ImageManager.loadBitmap(...this._baseFile);
        }

        update() {
            if (!this.isReady()) return;
            this._pupil.rotation += this._pupilSpin;
            const 
            mask = this._maskSprite,
            self = this.parent._character,
            dx = $gamePlayer._realX - (self._realX + this.position.x / $gameMap.tileWidth()),
            dy = $gamePlayer._realY - (self._realY + this.position.y / $gameMap.tileHeight());
            let
            length = dx * dx + dy * dy;
            if (length < 625) {
                this.visible = true;
                length = Math.sqrt(length);
                const
                i = Math.pow(length / 25, 0.5),
                vx = dx / length,
                vy = dy / length;
                this._pupil.position.set(
                    this._halfWidth * vx * i,
                    this._halfHeight * vy * i
                )
            } else {
                this.visible = false;
            }
        }

        isReady() {
            return this._halfWidth && this._halfHeight;
        }

    }

    //-----------------------------------------------------------------------------
    // Sprite_Character
    //
    // The sprite for displaying a character.

    const alias_Sprite_Character_initialize = Sprite_Character.prototype.initialize;
    const alias_Sprite_Character_isEmptyCharacter = Sprite_Character.prototype.isEmptyCharacter;

    Object.assign(Sprite_Character.prototype, {

        initialize() {
            alias_Sprite_Character_initialize.apply(this, arguments);
            this.createEyes();
        },

        createEyes() {
            const 
            char = this._character,
            obj = $gameSystem.eventsEyesTable[[char._mapId, char._eventId]];
            if (obj) {
                this._eyes = [];
                for (const settings of Object.values(obj)) {
                    const sprite = new Eye_Sprite(settings);
                    
                    this._eyes.push(sprite);
                    this.addChild(sprite);
                }
            } else {
                this._eyes = null;
            }
        },

        isEmptyCharacter() {
            return alias_Sprite_Character_isEmptyCharacter.apply(this) && !this._eyes;
        }

    });

})(DRAGON.DollEye.RelentlessGaze);
