//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_TextCore.js
//=============================================================================

var 
DRAGON                           = DRAGON                  || {};
DRAGON.DollEye                   = DRAGON.DollEye          || {};
DRAGON.DollEye.TextCore          = DRAGON.DollEye.TextCore || {};
DRAGON.DollEye.TextCore.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Game Text extended functions for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * 
 * @param textSound
 * @text Text Sound
 * @default
 * 
 * @param textSoundEnabled
 * @text Enabled by default?
 * @parent textSound
 * @type boolean
 * @default false
 * 
 * @param textSoundName
 * @text Default Filename
 * @parent textSound
 * @type file
 * @dir audio/se/
 * @default
 * 
 * @param textSoundVolume
 * @text Default Volume
 * @parent textSound
 * @type number
 * @default 100
 * @min 0
 * @max 100
 * 
 * @param textSoundVolumeRand
 * @text Randomness
 * @parent textSoundVolume
 * @type number
 * @default 0
 * @min -50
 * @max 50
 * 
 * @param textSoundPitch
 * @text Default Pitch
 * @parent textSound
 * @type number
 * @default 100
 * @min 50
 * @max 150
 * 
 * @param textSoundPitchRand
 * @text Randomness
 * @parent textSoundPitch
 * @type number
 * @default 0
 * @min -50
 * @max 50
 * 
 * @param textSoundPan
 * @text Default Pan
 * @parent textSound
 * @type number
 * @default 0
 * @min -100
 * @max 100
 * 
 * @param textSoundPanRand
 * @text Randomness
 * @parent textSoundPan
 * @type number
 * @default 0
 * @min -100
 * @max 100
 * 
 * @param textSoundInterval
 * @text Default Interval
 * @parent textSound
 * @type number
 * @default 5
 * @min 0
 * @max 60
 * 
 */

(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_TextCore";
    $._params        = PluginManager.parameters(pluginName);
    $.params         = Object.assign({}, $._params);

    const params = $.params;
    params.textSoundEnabled = params.textSoundEnabled === 'true';
    params.textSoundVolume = Number(params.textSoundVolume);
    params.textSoundVolumeRand = Number(params.textSoundVolumeRand);
    params.textSoundPitch = Number(params.textSoundPitch);
    params.textSoundPitchRand = Number(params.textSoundPitchRand);
    params.textSoundPan = Number(params.textSoundPan);
    params.textSoundPanRand = Number(params.textSoundPanRand);
    params.textSoundInterval = Number(params.textSoundInterval);
    //-----------------------------------------------------------------------------

    const escapeTable = $.escapeTable = new Map();
    const escapeFlags = $.escapeFlags = {
        null:     0x0,
        size:     0x1,
        visual:   0x2,
        sound:    0x4,
        position: 0x8,
        global:   0x10,
    }
    const _escapeRestrictSet = new Set();

    const addEscapeCharacter = $.addEscapeCharacter = function (key, data) {
        if (!data.function) return;
        if (!data.flags) data.flags = 0x0;
        if (!data.instanceOf) data.instanceOf = [Window_Base];
        if (!data.params) data.params = [];
        if (data.params.length === 0) {
            _escapeRestrictSet.add(key);
            const alias = data.function;
            data.function = function(params, textState) { //TODO - put this on processEscapeCharacter instead
                textState.index++;
                alias.apply(this, arguments);
            }
        }
        escapeTable.set(key, data);
    }

    //-----------------------------------------------------------------------------
    //TEXT VISUALS
    addEscapeCharacter('FR', { //Font Reset
        params: [],
        function: function(params, textState) { this.resetFontSettings(); },
        flags: escapeFlags.size | escapeFlags.visual
    });
    addEscapeCharacter('FS', { //Font Size
        params: ['number'],
        function: function(params, textState) { this.contents.fontSize = params[0]; },
        flags: escapeFlags.size | escapeFlags.visual
    });
    addEscapeCharacter('FN', { //Font Name
        params: ['string'],
        function: function(params, textState) { this.contents.fontFace = params[0]; },
        flags: escapeFlags.size | escapeFlags.visual
    });
    addEscapeCharacter('FB', { //Font Boldness
        params: [],
        function: function(params, textState) { this.contents.fontBold = !this.contents.fontBold; },
        flags: escapeFlags.size | escapeFlags.visual
    });
    addEscapeCharacter('FI', { //Font Italic
        params: [],
        function: function(params, textState) { this.contents.fontItalic = !this.contents.fontItalic; },
        flags: escapeFlags.size | escapeFlags.visual
    });

    //-----------------------------------------------------------------------------
    //TEXT ALIGN
    addEscapeCharacter('TA', {
        params: ['number'],
        function: function(params, textState) {
            this.setTextAlign(params[0], textState);
            this.refreshTextAlignOffset(textState);
        },
        flags: escapeFlags.position
    });

    //-----------------------------------------------------------------------------
    //TEXT ANIMATIONS
    addEscapeCharacter('SHAKE', {
        params: [],
        function: function(params, textState) {
            this._textAnimParams = ['SHAKE', () => { return 0.2 + Math.random() * 0.3; }, () => { return 0.2 + Math.random() * 0.3; }, 1, 1];
        },
        flags: escapeFlags.position
    });
    addEscapeCharacter('WAVE', {
        params: [],
        function: function(params, textState) {
            this._textAnimParams = ['WAVE', 0.3, 0.3, 2, 2];
        },
        flags: escapeFlags.position
    });
    addEscapeCharacter('SLIDE', {
        params: [],
        function: function(params, textState) {
            this._textAnimParams = ['SLIDE', 0.5, 0, 4, 0];
        },
        flags: escapeFlags.position
    });
    addEscapeCharacter('CIRCLE', {
        params: [],
        function: function(params, textState) {}, //TODO
        flags: escapeFlags.position
    });
    addEscapeCharacter('RESETSHAKE', {
        params: [],
        function: function(params, textState) {
            this.clearTextAnimation();
        },
        flags: escapeFlags.position
    });

    //-----------------------------------------------------------------------------
    //TEXT SOUNDS
    addEscapeCharacter('LSRESET', { //Letter Sound Reset
        params: [],
        function: function(params, textState) { $gameSystem.resetTextSound(); },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSN', { //Letter Sound Filename
        params: ['string'],
        function: function(params, textState) { $gameSystem.textSound.name = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSON', {
        params: [],
        function: function(params, textState) { $gameSystem.textSound.enabled = true; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSOFF', {
        params: [],
        function: function(params, textState) { $gameSystem.textSound.enabled = false; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSV', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.volume = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSVV', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.volumeRand = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSPI', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.pitch = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSPIV', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.pitchRand = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSPA', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.pan = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSPAV', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.panRand = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });
    addEscapeCharacter('LSI', {
        params: ['number'],
        function: function(params, textState) { $gameSystem.textSound.interval = params[0]; },
        flags: escapeFlags.global,
        instanceOf: [Window_Message]
    });

    //-----------------------------------------------------------------------------
    // Sprite_Text
    //
    // --

    class Sprite_Text extends Sprite {

        constructor({ text = '', x = 0, y = 0, width = 0, height = 0, fontSettings = {} } = {}) {
            super();
            this.setupFont(fontSettings);
            this.setupText(text, width, height);
            this.position.set(x, y);
            this.anchorPos = [x, y];
        }

        setupFont(settings = {}) {
            if (!this.bitmap) this.bitmap = new Bitmap(1, 1);
            for (const [key, value] of Object.entries(settings)) {
                if (this.bitmap.hasOwnProperty(key)) this.bitmap[key] = value;
            }
        }

        setupText(text = '', forceWidth = 0, forceHeight = 0) {
            this._text = text;
            this._forceWidth = forceWidth;
            this._forceHeight = forceHeight;
            this.visible = text.length > 0;
            this.refreshBitmap();
        }

        refreshBitmap() {
            const 
            text = this._text,
            bitmap = this.bitmap || new Bitmap(1, 1);
            this.bitmap = null;
            bitmap.clear();
            if (text?.length > 0) {
                const 
                w = this._forceWidth || bitmap.measureTextWidth(text),
                h = this._forceHeight || bitmap.fontSize;
                bitmap.resize(w, h);
                bitmap.drawText(text, 0, 0, w, h);
            }
            this.bitmap = bitmap;
        }

    }

    $.Sprite_Text = Sprite_Text;

    //-----------------------------------------------------------------------------
    // Sprite_AnimatedText
    //
    // --

    class Sprite_AnimatedText extends Sprite_Text {

        constructor({ animSettings = {} } = {}) {
            super(...arguments)
            this.setupAnimation(animSettings)
        }

        setupAnimation(settings) {
            this._animation = {
                type: settings.type,
                params: settings.params.map((value) => { if (typeof value === 'function') return Number(value()); return Number(value); })
            };
        }

        update() {
            const 
            type = this._animation.type,
            params = this._animation.params;
			this.x += params[0];
			this.y += params[1];
			if (Math.abs(this.x - this.anchorPos[0]) > params[2]) params[0] *= -1;
			if (Math.abs(this.y - this.anchorPos[1]) > params[3]) params[1] *= -1;
        }

    }
    
    $.Sprite_AnimatedText = Sprite_AnimatedText;

    //TODO
    const animatedSpritePool = []

    const getAnimatedTextSprite = function(args) {
        return new Sprite_AnimatedText(args);
        if (animatedSpritePool.length > 0) {
            const 
            x = args.x || 0,
            y = args.y || 0,
            sprite = animatedSpritePool.pop();
            sprite.position.set(x, y);
            sprite.anchorPos = [x, y];
            sprite.setupFont(args.fontSettings);
            sprite.setupText(args.text, args.width, args.height);
            sprite.setupAnimation(args.animSettings);
            return sprite;
        } else {
            return new Sprite_AnimatedText(args);
        }
    }

    const addAnimatedTextSpriteToPool = function(sprite) {
        //animatedSpritePool.push(sprite);
    }

    //-----------------------------------------------------------------------------
    // Game_System
    //
    // The game object class for the system data.

    const alias_Game_System_initialize = Game_System.prototype.initialize;

    Object.assign(Game_System.prototype, {

        initialize() {
            alias_Game_System_initialize.apply(this, arguments);
            this.resetTextSound();
        },

        resetTextSound() {
            this._textSound = {
                enabled:    params.textSoundEnabled,
                name:       params.textSoundName,
                volume:     params.textSoundVolume,
                volumeRand: params.textSoundVolumeRand,
                pitch:      params.textSoundPitch,
                pitchRand:  params.textSoundPitchRand,
                pan:        params.textSoundPan,
                panRand:    params.textSoundPanRand,
                interval:   params.textSoundInterval,
                count:      0
            };
            return this._textSound;
        },

        shouldPlayTextSound() {
            if (!this.textSound.enabled) return false;
            if (this.textSound.count <= -1) this.textSound.count = this.textSound.interval;
            return (--this.textSound.count) === -1;
        },

        playTextSound() {
            const seObj = { 
                name: this.textSound.name, 
                volume: this.textSound.volume + Math.round(Math.random() * this.textSound.volumeRand * 2) - this.textSound.volumeRand, 
                pitch: this.textSound.pitch + Math.round(Math.random() * this.textSound.pitchRand * 2) - this.textSound.pitchRand, 
                pan: this.textSound.pan + Math.round(Math.random() * this.textSound.panRand * 2) - this.textSound.panRand, 
            };
            AudioManager.playSe(seObj);
        }

    });

    Object.defineProperties(Game_System.prototype, {
        textSound: {
            get: function() {
                return this._textSound || this.resetTextSound();
            },
            configurable: true
        }
    });

    //-----------------------------------------------------------------------------
    // Window_Base
    //
    // The superclass of all windows within the game.

    const alias_Window_Base_resetFontSettings = Window_Base.prototype.resetFontSettings;
    const alias_Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;

    Object.assign(Window_Base.prototype, {

        resetFontSettings() {
            alias_Window_Base_resetFontSettings.apply(this, arguments);
            this.contents.fontBold = false;
            this.contents.fontItalic = false;
        },

        calcTextWidthEx(text) {
            if (!text) return 0;
            this.pasteVisualStateTo(this.placeholder);
            return this.placeholder.textSizeEx(text).width;
        },

        convertEscapeCharacters(text) {
            text = alias_Window_Base_convertEscapeCharacters.apply(this, arguments);
            for (const code of _escapeRestrictSet) {
                const regExp = new RegExp('\\x1b' + code, 'gi');
                text = text.replace(regExp, '\x1b' + code + ' ');
            }
            return text
        },

        obtainStringEscapeParam(textState) {
            const regExp = /^\<(.*?)\>/; //Yanfly Message Core Legacy
            const arr = regExp.exec(textState.text.slice(textState.index));
            if (arr) {
                const string = arr[0];
                textState.index += string.length;
                return arr[0].slice(1, string.length - 1);
            } else {
                return "";
            }
        },

        createVisualStateObj() {
            return {
                fontFace: this.contents.fontFace,
                fontSize: this.contents.fontSize,
                textColor: this.contents.textColor,
                fontBold: this.contents.fontBold,
                fontItalic: this.contents.fontItalic,
                outlineColor: this.contents.outlineColor,
                outlineWidth: this.contents.outlineWidth,
            };
        },

        saveCurrentVisualState() {
            this._savedVisualState = this.createVisualStateObj();
        },

        loadSavedVisualState() {
            if (this._savedVisualState) {
                this.contents.fontFace = this._savedVisualState.fontFace;
                this.contents.fontSize = this._savedVisualState.fontSize;
                this.contents.textColor = this._savedVisualState.textColor;
                this.contents.fontBold = this._savedVisualState.fontBold;
                this.contents.fontItalic = this._savedVisualState.fontItalic;
                this.contents.outlineColor = this._savedVisualState.outlineColor;
                this.contents.outlineWidth = this._savedVisualState.outlineWidth;
                this._savedVisualState = null;
            }
        },

        copyVisualStateFrom(other) {
            this.contents.fontFace = other.contents.fontFace;
            this.contents.fontSize = other.contents.fontSize;
            this.contents.textColor = other.contents.textColor;
            this.contents.fontBold = other.contents.fontBold;
            this.contents.fontItalic = other.contents.fontItalic;
            this.contents.outlineColor = other.contents.outlineColor;
            this.contents.outlineWidth = other.contents.outlineWidth;
        },

        pasteVisualStateTo(other) {
            other.copyVisualStateFrom(this);
        },

    });

    Object.defineProperties(Window_Base.prototype, {
        placeholder: {
            get: function() {
                let placeholder = this.constructor._placeholder;
                if (!placeholder) {
                    placeholder = new this.constructor(new Rectangle());
                    placeholder._isPlaceholder = true;
                    placeholder.resetFontSettings = (function() {}).bind(placeholder);
                    this.constructor._placeholder = placeholder;
                }
                return placeholder;
            },
            configurable: true
        }
    });
    
    //-----------------------------------------------------------------------------
    // Window_Message
    //
    // The window for displaying text messages.

    const alias_Window_Message_initialize = Window_Message.prototype.initialize;
    const alias_Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    const alias_Window_Message_newPage = Window_Message.prototype.newPage;
    const alias_Window_Message_startWait = Window_Message.prototype.startWait;
    const alias_Window_Message_flushTextState = Window_Message.prototype.flushTextState;
    const alias_Window_Message_processNewLine = Window_Message.prototype.processNewLine;
    const alias_Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;

    Object.assign(Window_Message.prototype, {

        initialize() {
            alias_Window_Message_initialize.apply(this, arguments);
            this._textSprites = [];
            this.clearTextAnimation();
        },

        updateMessage() {
            const flag = alias_Window_Message_updateMessage.apply(this, arguments);
            if (flag && this._drewAnyText && $gameSystem.shouldPlayTextSound()) $gameSystem.playTextSound();
            this._drewAnyText = false;
            return flag;
        },

        newPage() {
            alias_Window_Message_newPage.apply(this, arguments);
            this.clearTextSprites();
            this.clearTextAnimation();
            $gameSystem.textSound.count = 0;
        },

        startWait() {
            alias_Window_Message_startWait.apply(this, arguments);
            $gameSystem.textSound.count = 0;
        },

        clearTextSprites() {
            for (const sprite of this._textSprites) {
                addAnimatedTextSpriteToPool(sprite);
                this._contentsSprite.removeChild(sprite)
            }
        },

        clearTextAnimation() {
            this._textAnimParams = null;
        },

        flushTextState(textState) {
            this._drewAnyText = this._drewAnyText || (textState.drawing && textState.buffer.length > 0);
            if (this._textAnimParams) {
                const 
                animType = this._textAnimParams[0],
                animParams = this._textAnimParams.slice(1),
                fontSettings = this.createVisualStateObj();
                this.contents.drawText = function(text, x, y, width, height) {
                    const chars = Array.from(text);
                    for (const [i, char] of Object.entries(chars)) {
                        width = this.textWidth(char);
                        const sprite = getAnimatedTextSprite({
                            text: char,
                            x: x,
                            y: y,
                            width: width + fontSettings.outlineWidth,
                            height: height,
                            fontSettings: fontSettings,
                            animSettings: { type: animType, params: animParams }
                        })
                        for(let j = chars.length - 1; j > i; j--) sprite.update();
                        this._textSprites.push(sprite);
                        this._contentsSprite.addChild(sprite);
                        x += width
                    }
                }.bind(this);
                alias_Window_Message_flushTextState.apply(this, arguments);
                this.contents.drawText = Bitmap.prototype.drawText.bind(this.contents);
            } else {
                alias_Window_Message_flushTextState.apply(this, arguments);
            }
        },

        processEscapeCharacter(code, textState) {
            const escapeObj = escapeTable.get(code);
            if (escapeObj) {
                const params = [];
                for (const param of escapeObj.params) { //BIG TODO
                    switch (param) {
                        case 'number':
                            params.push(this.obtainEscapeParam(textState));
                            break;
                        case 'string':
                            params.push(this.obtainStringEscapeParam(textState));
                            break
                    }
                }
                if (this.shouldProcessEscapeFunction(escapeObj)) escapeObj.function.call(this, params, textState);
            } else {
                alias_Window_Message_processEscapeCharacter.apply(this, arguments);
            }
        },

        shouldProcessEscapeFunction(obj) {
            if (this._isPlaceholder) {
                return obj && (obj.flags & escapeFlags.size) > 0 && !(obj.flags & escapeFlags.global)
            } else {
                return !!obj;
            }
        },

        setTextAlign(align, textState) {
            textState.align = align;
        },

        processNewLine(textState) {
            alias_Window_Message_processNewLine.apply(this, arguments);
            this.refreshTextAlignOffset(textState);
        },

        refreshTextAlignOffset(textState) {
            if (textState.skipAlign || typeof textState.align != 'number') return;
            const
            margin = this.newLineX(textState),
            textWidth = this.calcTextWidthEx(textState.text.slice(textState.index).split(/[\r\n]+/)[0]);
            switch (textState.align) {
                case 0:
                    textState.x = textState.startX;
                    break;
                case 1:
                    textState.x = margin + (this.contentsWidth() - margin - textWidth) / 2;
                    break;
                case 2:
                    textState.x = this.contentsWidth() - textWidth - 4;
                    break;
            }
        }

    });

})(DRAGON.DollEye.TextCore);
