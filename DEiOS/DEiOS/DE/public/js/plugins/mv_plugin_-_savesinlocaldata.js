//=============================================================================
// SavesInLocalData.js
//=============================================================================

/*:
 * @plugindesc Causes desktop save files to be saved in/loaded from local application directories rather than alongside game data.
 * @author Catball Games/Carrie Cygielnik
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {
	StorageManager.localFileDirectoryPath = function() {
		if (window.$dataSystem) {
			return `${Directory.Documents}/${window.$dataSystem.gameTitle}/`;
		}
		return null;
	};
})();
