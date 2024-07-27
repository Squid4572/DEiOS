//=============================================================================
// ** RPG Maker MZ - DRAGON_DollEye_MainMenu.js
//=============================================================================

var 
DRAGON                           = DRAGON                  || {};
DRAGON.DollEye                   = DRAGON.DollEye          || {};
DRAGON.DollEye.MainMenu          = DRAGON.DollEye.MainMenu || {};
DRAGON.DollEye.MainMenu.VERSION  = [1, 0, 0];

/*:
 * @plugindesc [RPG Maker MZ] - Custom Main Menu Scenes for © Doll Eye. (v.1.0.0)
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
    const pluginName = "DRAGON_DollEye_MainMenu";
    $._params        = PluginManager.parameters(pluginName);
    $.params         = {};

    //-----------------------------------------------------------------------------
    // Scene_Menu
    //
    // The scene class of the menu screen.

    const alias_Scene_Menu_create = Scene_Menu.prototype.create;

    Object.assign(Scene_Menu.prototype, {
        
        create: function() {
            alias_Scene_Menu_create.apply(this, arguments);
            this._windowLayer.removeChild(this._goldWindow);
            this._windowLayer.removeChild(this._statusWindow);
        },

        commandWindowRect: function() {
            const ww = this.mainCommandWidth();
            const wh = this.calcWindowHeight(4, true);
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = this.mainAreaTop() + (Graphics.boxHeight - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        }

    });

    //-----------------------------------------------------------------------------
    // Scene_Item
    //
    // The scene class of the item screen.

    const alias_Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;

    Object.assign(Scene_Item.prototype, {

        createItemWindow: function() {
            alias_Scene_Item_createItemWindow.apply(this, arguments);
            if (!this._categoryWindow.needsSelection()) {
                this._categoryWindow.show();
                this._itemWindow.y += this._categoryWindow.height;
                this._itemWindow.height -= this._categoryWindow.height;
            }
        }

    });

    //-----------------------------------------------------------------------------
    // Window_ItemCategory
    //
    // The window for selecting a category of items on the item and shop screens.


    Object.assign(Window_ItemCategory.prototype, {

        maxCols: function() {
            return this._list?.length;
        },

        colSpacing: function() {
            return 16;
        },

        rowSpacing: function() {
            return 8;
        }

    });

    //-----------------------------------------------------------------------------
    // Window_ItemList
    //
    // The window for selecting an item on the item screen.

    const alias_Window_ItemList_drawItemNumber = Window_ItemList.prototype.drawItemNumber;

    Object.assign(Window_ItemList.prototype, {

        drawItemNumber: function(item, x, y, width) {
            const lastFontSize = this.contents.fontSize;
            this.contents.fontSize = 20;
            if (this.needsNumber()) {
                this.drawText("x", x, y, width - this.textWidth("00"), "right");
                this.drawText(String($gameParty.numItems(item)).padZero(2), x, y, width, "right");
            }
            this.contents.fontSize = lastFontSize;
        },

        rowSpacing: function() {
            return 0;
        }

    });

})(DRAGON.DollEye.MainMenu);
