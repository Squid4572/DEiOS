//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_SaveFile.js
//=============================================================================

var 
DRAGON                           = DRAGON                  || {};
DRAGON.DollEye                   = DRAGON.DollEye          || {};
DRAGON.DollEye.SaveFile          = DRAGON.DollEye.SaveFile || {};
DRAGON.DollEye.SaveFile.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Custom Save and Load File Scene for © Doll Eye. (v.1.0.0)
 * @url http://dragonrefuge.net
 * @target MZ
 * @author Jorge Feitosa
 * @help
 * --
 * 
 * @param helpWindow
 * @text Help Window
 * @default
 * 
 * @param helpWindowBaseText
 * @text Base Text
 * @parent helpWindow
 * @type text
 * @default Select a slot. Press ESC to exit.
 * 
 * @param helpWindowLoadText
 * @text Load Text
 * @parent helpWindow
 * @type text
 * @default Loads the data from the saved game.
 * 
 * @param helpWindowSaveText
 * @text Save Text
 * @parent helpWindow
 * @type text
 * @default Saves the current progress in your game.
 * 
 * @param helpWindowDeleteText
 * @text Delete Text
 * @parent helpWindow
 * @type text
 * @default Deletes all data from this save file.
 * 
 * @param optionsWindow
 * @text Options Window
 * @default
 * 
 * @param optionsWindowLoadText
 * @text Load Text
 * @parent optionsWindow
 * @type text
 * @default Load
 * 
 * @param optionsWindowSaveText
 * @text Save Text
 * @parent optionsWindow
 * @type text
 * @default Save
 * 
 * @param optionsWindowDeleteText
 * @text Delete Text
 * @parent optionsWindow
 * @type text
 * @default Delete
 * 
 * @param confirmationWindow
 * @text Confirmation Window
 * @default
 * 
 * @param confirmationWindowConfirmText
 * @text Confirm Text
 * @parent confirmationWindow
 * @type text
 * @default Yes
 * 
 * @param confirmationWindowCancelText
 * @text Cancel Text
 * @parent confirmationWindow
 * @type text
 * @default No
 * 
 * @param confirmationWindowLoad
 * @text Load Confirmation?
 * @parent confirmationWindow
 * @default
 * 
 * @param confirmationWindowLoadEnabled
 * @text Enabled
 * @parent confirmationWindowLoad
 * @type boolean
 * @default true
 * 
 * @param confirmationWindowLoadText
 * @text Text
 * @parent confirmationWindowLoad
 * @type text
 * @default Do you wish to load this save file?
 * 
 * @param confirmationWindowSave
 * @text Save Confirmation?
 * @parent confirmationWindow
 * @default
 * 
 * @param confirmationWindowSaveEnabled
 * @text Enabled
 * @parent confirmationWindowSave
 * @type boolean
 * @default true
 * 
 * @param confirmationWindowSaveText
 * @text Text
 * @parent confirmationWindowSave
 * @type text
 * @default Do you wish to overwrite this save file?
 * 
 * @param confirmationWindowDelete
 * @text Delete Confirmation?
 * @parent confirmationWindow
 * @default
 * 
 * @param confirmationWindowDeleteEnabled
 * @text Enabled
 * @parent confirmationWindowDelete
 * @type boolean
 * @default true
 * 
 * @param confirmationWindowDeleteText
 * @text Text
 * @parent confirmationWindowDelete
 * @type text
 * @default Do you wish to delete this save file?
 * 
 */


(($) => {
	//-----------------------------------------------------------------------------
	// * Plugin Definitions
	//-----------------------------------------------------------------------------	

    "use strict";
    const pluginName = "DRAGON_DollEye_SaveFile";
    $._params = PluginManager.parameters(pluginName);
    $.params = Object.assign({}, $._params);
    const params = $.params;
    params.confirmationWindowLoadEnabled = params.confirmationWindowLoadEnabled === 'true';
    params.confirmationWindowSaveEnabled = params.confirmationWindowSaveEnabled === 'true';
    params.confirmationWindowDeleteEnabled = params.confirmationWindowDeleteEnabled === 'true';

    //-----------------------------------------------------------------------------
    // DataManager
    //
    // The static class that manages the database and game objects.

    const snapCanvas = document.createElement("canvas");
    const snapContext = snapCanvas.getContext('2d');
    snapContext.globalCompositeOperation = "source-over";
    snapContext.imageSmoothingEnabled = false;

    const alias_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;

    Object.assign(DataManager, {

        makeSavefileInfo() {
            const info = alias_DataManager_makeSavefileInfo.apply(this, arguments);
            const canvas = SceneManager?._backgroundBitmap?.canvas;
            if (canvas) {
                const 
                w = canvas.width,
                h = canvas.height,
                w3 = Math.floor(w / 3),
                h3 = Math.floor(h / 3);
                snapCanvas.width = w3;
                snapCanvas.height = h3;
                snapContext.drawImage(canvas, 0, 0, w, h, 0, 0, w3, h3);
                info.snapshot = snapCanvas.toDataURL('image/webp', 0.82);
            }
            info.mapName = $dataMap.displayName.length ? $dataMap.displayName : $dataMapInfos[$gameMap.mapId()].name;
            return info;
        }

    });

    //-----------------------------------------------------------------------------
    // Scene_File
    //
    // The superclass of Scene_Save and Scene_Load.

    const alias_alias_Scene_File_initialize = Scene_File.prototype.initialize;
    const alias_Scene_File_create = Scene_File.prototype.create;
    const alias_Scene_File_terminate = Scene_File.prototype.terminate;
    const alias_Scene_File_listWindowRect = Scene_File.prototype.listWindowRect;

    Object.assign(Scene_File.prototype, {

        initialize: function() {
            alias_alias_Scene_File_initialize.apply(this, arguments);
            this._flags = 0;
        },

        setHelpWindowBaseText() {
            this._helpWindow.setText(params.helpWindowBaseText);
        },

        flags() {
            return this._flags;
        },

        setFlags(flags) {
            this._flags = flags;
        },

        checkFlag(flag) {
            return (this._flags & flag) == flag;
        },

        create: function() {
            alias_Scene_File_create.apply(this, arguments);
            this.setHelpWindowBaseText();
            this.createOptionsWindow();
            this.createConfirmWindow();
            this.createInfoWindow();
            this._listWindow.setOptionsWindow(this._optionsWindow);
            this._listWindow.setInfoWindow(this._infoWindow);
        },

        terminate: function() {
            alias_Scene_File_terminate.apply(this, arguments);
            if (this.checkFlag(Scene_File.loadFlag) && this._loadSuccess) $gameSystem.onAfterLoad();
        },

        createOptionsWindow: function() {
            this._optionsWindow = new Window_SaveFileOptions(this.optionsWindowRect());
            this._optionsWindow.setHandler('load', this.onLoadOk.bind(this));
            this._optionsWindow.setHandler('save', this.onSaveOk.bind(this));
            this._optionsWindow.setHandler('delete', this.onDeleteOk.bind(this));
            this._optionsWindow.setHandler('cancel', this.onOptionsCancel.bind(this));
            this._optionsWindow.setHandler('_select', this.onOptionsSelect.bind(this));
            this._optionsWindow.setFlags(this.flags());
            this.addWindow(this._optionsWindow);
        },

        optionsWindowRect: function() {
            const ww = Graphics.boxWidth - this._listWindow.width;
            const wh = 64 + 4;
            const wx = this._listWindow.x + this._listWindow.width;
            const wy = this._listWindow.y + this._listWindow.height - wh;
            return new Rectangle(wx, wy, ww, wh);
        },

        createConfirmWindow: function() {
            this._confirmWindow = new Window_SaveFileConfirm(this.confirmWindowRect());
            this._confirmWindow.setHandler('cancel', this.onConfirmWindowCancel.bind(this));
            this.addChild(this._confirmWindow);
        },

        confirmWindowRect: function() {
            const ww = Graphics.boxWidth - this._listWindow.width;
            const wh = 68 * 2;
            const wx = this._listWindow.x + this._listWindow.width;
            const wy = this._listWindow.y + (this._listWindow.height - this._optionsWindow.height - wh) / 2;
            return new Rectangle(wx + 4, wy + 4, ww, wh);
        },

        createInfoWindow() {
            this._infoWindow = new Window_SaveFileInfo(this.infoWindowRect())
            this.addWindow(this._infoWindow);
        },

        infoWindowRect() {
            const ww = Graphics.boxWidth - this._listWindow.width;
            const wh = 272 + 24;
            const wx = this._listWindow.x + this._listWindow.width;
            const wy = this._helpWindow.y + this._optionsWindow.height + (this._listWindow.height - this._optionsWindow.height - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        },

        listWindowRect: function() {
            const rect = alias_Scene_File_listWindowRect.apply(this, arguments);
            rect.width = 196 + 12;
            return rect;
        },

        onSavefileOk: function() {
            this._optionsWindow.refresh();
            const index = this._optionsWindow._list.findIndex((value) => {
                if (this.checkFlag(Scene_File.saveFlag)) {
                    return value.symbol === 'save';
                } else {
                    return value.enabled;
                }
            })
            if (index >= 0) {
                this._optionsWindow.activate();
                this._optionsWindow.select(index);
            } else {
                this.onOptionsCancel();
            }
        },

        onLoadOk: function() {
            if (params.confirmationWindowLoadEnabled) {
                this.onConfirmWindowOpen();
                this._confirmWindow.setText(params.confirmationWindowLoadText);
                this._confirmWindow.setHandler('confirm', this.onLoadProcess.bind(this));
            } else {
                this.onLoadProcess();
            }
        },

        onLoadProcess: function() {
            const savefileId = this._optionsWindow._savefileId;
            DataManager.loadGame(savefileId)
            .then(function() {
                SoundManager.playLoad();
                this.fadeOutAll();
                this.reloadMapIfUpdated();
                SceneManager.goto(Scene_Map);
                this._loadSuccess = true;
            }.bind(this))
            .catch(function() {
                SoundManager.playBuzzer();
                this._optionsWindow.activate();
            }.bind(this));
        },

        onSaveOk: function() {
            if (params.confirmationWindowSaveEnabled && DataManager.savefileExists(this._optionsWindow._savefileId)) {
                this.onConfirmWindowOpen();
                this._confirmWindow.setText(params.confirmationWindowSaveText);
                this._confirmWindow.setHandler('confirm', this.onSaveProcess.bind(this));
            } else {
                this.onSaveProcess();
            }
        },

        onSaveProcess: function() {
            const savefileId = this._optionsWindow._savefileId;
            $gameSystem.setSavefileId(savefileId);
            $gameSystem.onBeforeSave();
            DataManager.saveGame(savefileId)
            .then(function() {
                SoundManager.playSave();
                this.onOptionsCancel();
                this._listWindow.refresh();
                this._optionsWindow.refresh();
                this._infoWindow.diposeSnapshot(savefileId);
                this._infoWindow.refresh();
            }.bind(this))
            .catch(function() {
                SoundManager.playBuzzer();
                this._optionsWindow.activate();
            }.bind(this));
        },

        onDeleteOk: function() {
            if (params.confirmationWindowDeleteEnabled) {
                this.onConfirmWindowOpen();
                this._confirmWindow.setText(params.confirmationWindowDeleteText);
                this._confirmWindow.setHandler('confirm', this.onDeleteProcess.bind(this));
            } else {
                this.onDeleteProcess();
            }
        },

        onDeleteProcess: function() {
            const savefileId = this._optionsWindow._savefileId;
            StorageManager.remove(DataManager.makeSavename(savefileId));
            SoundManager.playSave();
            this.onOptionsCancel();
            this._listWindow.refresh();
            this._optionsWindow.refresh();
            this._infoWindow.diposeSnapshot(savefileId);
            this._infoWindow.refresh();
        },

        onOptionsCancel: function() {
            this._optionsWindow.deactivate();
            this._optionsWindow.select(-1);
            this._listWindow.activate();
            this.setHelpWindowBaseText();
        },

        onOptionsSelect: function() {
            switch(this._optionsWindow.currentSymbol()) {
                case 'load':
                    this._helpWindow.setText(params.helpWindowLoadText);
                    break;
                case 'save':
                    this._helpWindow.setText(params.helpWindowSaveText);
                    break;
                case 'delete':
                    this._helpWindow.setText(params.helpWindowDeleteText);
                    break;
            };
        },

        reloadMapIfUpdated: function() {
            if ($gameSystem.versionId() !== $dataSystem.versionId) {
                const mapId = $gameMap.mapId();
                const x = $gamePlayer.x;
                const y = $gamePlayer.y;
                const d = $gamePlayer.direction();
                $gamePlayer.reserveTransfer(mapId, x, y, d, 0);
                $gamePlayer.requestMapReload();
            }
        },

        onConfirmWindowOpen: function() {
            this._confirmWindow.activate();
            this._confirmWindow.select(0);
            this._confirmWindow.open();
        },

        onConfirmWindowCancel: function() {
            this._optionsWindow.activate();
        }

    });

    Scene_File.saveFlag = 1;
    Scene_File.loadFlag = 2;

    //-----------------------------------------------------------------------------
    // Scene_Save
    //
    // The scene class of the save screen.

    const alias_Scene_Save_initialize = Scene_Save.prototype.initialize;

    Object.assign(Scene_Save.prototype, {

        initialize: function() {
            alias_Scene_Save_initialize.apply(this, arguments);
            this.setFlags(Scene_File.saveFlag | Scene_File.loadFlag);
        },

        onSavefileOk: function() {
            Scene_File.prototype.onSavefileOk.apply(this, arguments);
        }

    });

    //-----------------------------------------------------------------------------
    // Scene_Load
    //
    // The scene class of the load screen.

    const alias_Scene_Load_initialize = Scene_Load.prototype.initialize;

    Object.assign(Scene_Load.prototype, {

        initialize: function() {
            alias_Scene_Load_initialize.apply(this, arguments);
            this.setFlags(Scene_File.loadFlag);
        },

        onSavefileOk: function() {
            Scene_File.prototype.onSavefileOk.apply(this, arguments);
        },

    });
    
    //-----------------------------------------------------------------------------
    // Window_SavefileList
    //
    // The window for selecting a save file on the save and load screens.

    const alias_Window_SavefileList_initialize = Window_SavefileList.prototype.initialize;

    Object.assign(Window_SavefileList.prototype, {

        initialize: function() {
            alias_Window_SavefileList_initialize.apply(this, arguments);
            this._flags = 0;
        },

        maxItems(){
            return DataManager.maxSavefiles();
        },

        setFlags(flags) {
            this._flags = flags;
        },

        checkFlag(flag) {
            return (this._flags & flag) == flag;
        },

        rowSpacing: function() {
            return 0;
        },

        numVisibleRows: function() {
            return this.maxItems();
        },

        drawItem: function(index) {
            const savefileId = this.indexToSavefileId(index);
            const rect = this.itemRectWithPadding(index);
            this.resetTextColor();
            const enabled = this.isEnabled(savefileId);
            this.changePaintOpacity(enabled);
            this.drawIcon((enabled ? 5 : 6), rect.x, rect.y + (rect.height - ImageManager.iconHeight) / 2);
            this.drawTitle(savefileId, rect.x + ImageManager.iconWidth, rect.y);
        },

        setOptionsWindow(optionsWindow) {
            this._optionsWindow = optionsWindow;
            this._optionsWindow.setSaveFileId(this.savefileId());
        },

        setInfoWindow(optionsWindow) {
            this._infoWindow = optionsWindow;
            this._infoWindow.setSaveFileId(this.savefileId());
        },

        isEnabled: function(savefileId) {
            return !!DataManager.savefileExists(savefileId);
        },

        select: function() {
            const lastIndex = this._index;
            Window_Selectable.prototype.select.apply(this, arguments);
            if (this._index >= 0 && this._index != lastIndex) {
                const fileId = this.savefileId();
                if (this._optionsWindow) this._optionsWindow.setSaveFileId(fileId);
                if (this._infoWindow) this._infoWindow.setSaveFileId(fileId);
            }
        },

        isCurrentItemEnabled: function() {
            return !!this._optionsWindow._list.find((value) => {
                return value.enabled;
            });
        },

        playOkSound: function() {
            Window_Base.prototype.playOkSound.apply(this);
        }
    });

    //-----------------------------------------------------------------------------
    // Window_SaveFileOptions
    //
    // --

    class Window_SaveFileOptions extends Window_Command {

        constructor(rect) {
            super(rect);
            this.deactivate()
            this.select(-1);
            this._flags = 0;
        }

        setFlags(flags) {
            this._flags = flags;
            this.refresh();
        }

        checkFlag(flag) {
            return (this._flags & flag) == flag;
        }

        maxCols() {
            return this._list?.length;
        }

        rowSpacing() {
            return 0;
        }

        itemHeight() {
            return 36;
        }

        itemTextAlign() {
            return 'center';
        }

        makeCommandList() {
            if (typeof this._savefileId != 'number') return;
            const fileExists = !!DataManager.savefileExists(this._savefileId);
            if (this.checkFlag(Scene_File.loadFlag)) {
                this.addCommand(params.optionsWindowLoadText, 'load', fileExists);
            }
            if (this.checkFlag(Scene_File.saveFlag)) {
                this.addCommand(params.optionsWindowSaveText, 'save', this._savefileId > 0);
            }
            this.addCommand(params.optionsWindowDeleteText, 'delete', this._savefileId > 0 && fileExists);
        }

        processCancel() {
            super.processCancel();
        }

        setSaveFileId(savefileId) {
            this._savefileId = savefileId;
            this.refresh();
        }

        select(index) {
            const lastIndex = this._index;
            super.select(index);
            if (this._index >= 0 && this._index != lastIndex) {
                this.callHandler('_select');
            }
        }

        _updateClientArea() {
            Window.prototype._updateClientArea.apply(this, arguments);
            this._clientArea.y += 4;
        }

    }

    //-----------------------------------------------------------------------------
    // Window_SaveFileConfirm
    //
    // --

    class Window_SaveFileConfirm extends Window_Command {

        constructor(rect) {
            super(rect);
            this.openness = 0;
            this.deactivate();
        }

        deactivate() {
            super.deactivate();
            if (this.openness > 0) this.close();
        }

        setText(text) {
            this._text = text;
            this.refresh();
        }

        makeCommandList() {
            this.addCommand(params.confirmationWindowConfirmText, 'confirm');
            this.addCommand(params.confirmationWindowCancelText, 'cancel');
        }

        refresh() {
            super.refresh();
            this.refreshText();
        }

        refreshText() {
            if (!this._text) return;
            const rect = this.itemLineRect(0);
            this.resetTextColor();
            this.changePaintOpacity(true);
            this.drawText(this._text, rect.x, rect.y - this.itemVerticalOffset(), rect.width, this.itemTextAlign());
        }
        
        rowSpacing() {
            return 0;
        }

        itemHeight() {
            return 36;
        }

        itemTextAlign() {
            return 'center';
        }

        itemVerticalOffset() {
            return this.itemHeight() + 2;
        }

        itemRect(index) {
            const rect = super.itemRect(index);
            rect.y += this.itemVerticalOffset();
            return rect
        }
        
        playOkSound() {
            //
        }
    }

    //-----------------------------------------------------------------------------
    // Window_SaveFileInfo
    //
    // --

    class Window_SaveFileInfo extends Window_Base {

        constructor(rect) {
            super(rect);
            this._snapSprite = new Sprite();
            this._contentsSprite.addChild(this._snapSprite);
            this._saveInfo = null;
        }

        setSaveFileId(savefileId) {
            this._savefileId = savefileId;
            this.refresh();
        }

        refresh() {
            const savefileId = this._savefileId;
            this._saveInfo = DataManager.savefileExists(savefileId) ? DataManager.savefileInfo(savefileId) : null;
            this.paint();
        }

        paint() {
            if (!this.contents) return;
            this.contents.clear();
            this.contentsBack.clear();
            this.draw();
        }

        draw() {
            const 
            info = this._saveInfo,
            width = this.contents.width - 336,
            height = this.contents.height,
            ox = 336,
            oy = 0;
            if (info?.snapshot) {
                this._snapSprite.bitmap = this.getSnapshotBitmap();
            } else {
                this._snapSprite.bitmap = ImageManager.loadPicture('noImageData');
            }
            this.changePaintOpacity(false);
            let fontSize = this.contents.fontSize;
            this.contents.fontSize = 20;
            this.drawText(this._savefileId ? 'File ' + String(this._savefileId) : 'Autosave', ox + 16, 8, width, 'left');
            this.contents.fontSize = fontSize;
            this.changePaintOpacity(true);
            if (info?.mapName) {
                this.drawText(info.mapName, ox + 16, this.contents.fontSize + 16, width, 'left');
            } else {
                this.drawText(info ? '--' : 'New Game', ox + 16, this.contents.fontSize + 16, width, 'left');
            }
            this.changePaintOpacity(false);
            this.contents.fontSize = 20;
            if (info?.timestamp) {
                const date = new Date(info.timestamp);
                this.drawText(date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5), ox, oy + height - this.contents.fontSize - 16, width, 'right');
            }
            this.contents.fontSize = fontSize;
        }

        getSnapshotBitmap() {
            this._snapCache = this._snapCache || [];
            let bitmap = this._snapCache[this._savefileId];
            if (!bitmap) {
                bitmap = this._snapCache[this._savefileId] = Bitmap.load(this._saveInfo.snapshot);
            }
            return bitmap;
        }

        diposeSnapshot(id) {
            if (!this._snapCache) return;
            const bitmap = this._snapCache[id];
            if (bitmap) bitmap.destroy();
            this._snapCache[id] = null;
        }

        destroy() {
            if (this._snapCache) {
                for (const bitmap of this._snapCache) {
                    if (bitmap) bitmap.destroy();
                }
            }
            super.destroy()
        }

    }
    
})(DRAGON.DollEye.SaveFile);
