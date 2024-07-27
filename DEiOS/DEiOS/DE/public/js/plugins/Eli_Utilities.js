//=========================================================
// Eli_Utilities.js
//=========================================================

/*:
@plugindesc v1.0 - Can customize the default setting of MV.
@author Eliaquim or Rakuen Zero

@help 
Made and tested with Rpg Maker Mv 1.6.2.
Always have a backup from your project!
============================================================================
Introduction
============================================================================

There are many things in Rpg Maker Mv that without the alternative of a 
plugin there is no way to change what is set by default. Things like the 
amount of slots to save, the formula used to calculate the experience to 
level up and other things.

This plugin is designed to give developers some simple flexibility to change 
these default settings. Some of them can be changed even during the game.

============================================================================
Features
============================================================================

This plugin offers:
• Option to choose whether simultaneous two-finger touch will be used to 
open the menu/cancel or not on mobile devices.
• Change the max number of slots to save.
• Enable or disable the blur effect on the screen background when the menu 
is opened.
• Choose a different formula to calculate when the actor will level up.
• Change how much HP is taken from the damage tile based on the value of a 
variable.
• Change the formula that calculates the strength of the critical hit.
• Change the number of actors that can enter in a battle.
• Define a name for the party with plugin command.
• Choose the number of max followers that will be shown on the map.
• Change the Max gold that the party can carry with plugin command.
• Change the Max items that the party can carry with plugin command.
• Change the fadespeed for fade In/Out with plugin command.

============================================================================
How to use
============================================================================

To use the plugin just go in the plugin parameters. However, there are a few 
things you should know:

• The default formula for calculating the experience to level up is:
"Math.round(basis (Math.pow(level-1, 0.9+acc_a/250)) level 
(level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1) extra);"

• The default formula that determines the strength of the critical hit is:
"damage * 3;"

• You can change the number of actors that will enter in battle anytime in
the game. However, the number of followers cannot be changed mid-game, only
in the beginning via parameters.

Plugin Commands:
• maxbattlers X
• partyname X
• maxgold X
• maxitems X
• fadespeed X

Change the X value for the value that you want. All values are numbers(not 
tested with decimal values). Only the party name that you can put letters.

============================================================================
Terms of Use
============================================================================

1. Give the credits to Eliaquim or Rakuen Zero in the credits section of 
your game.
2. It can be used in free and commercial games.
3. Do not sell or say that you made this plugin or part of him.
4. A free copy of your game would be nice(but it's not mandatory).
5. Do not redistribute this plugin. Instead, give this link to the download:
https://rakuenzero.itch.io/eli_utilities

============================================================================
Special thanks and considerations
============================================================================

Thanks to:
LTNGames, AloeGuvner, Nio Kasgami.

The plugin is free. However, consider donating if possible.
This can help me with small expenses and motivation! Working with games
in Brazil is very difficult. But don't feel obligated. I hope my small
contribution is also a fuel of hope for you to continue to make your games! 
Thank you! 
PayPal > eliaquimranascimento@gmail.com

============================================================================
Contact
============================================================================

RM Web - https://forums.rpgmakerweb.com/index.php?members/eliaquim.123037/
Centro Rpg Maker - https://centrorpg.com/index.php?action=profile
Instagram - https://www.instagram.com/rakuen.zero
Twitter - https://twitter.com/rakuenzero
Facebook - https://www.facebook.com/rakuenzero

============================================================================
Updatelog
============================================================================
Version 1.0
- Plugin release! 

@param Cancel Two Fingers
@type boolean
@on Yes(default)
@off No
@desc Use two-finger touch to open menu/cancel(Mobile devices)?
@default true

@param Max Save Files
@text Max Save Files
@type number
@min 1
@max 100
@desc Choose a number to determine the maximum number of slots to save. Default is 20.
@default 20

@param Blur Menu
@type boolean
@on Use(default)
@off Remove
@desc Choose if you want to remove the blur effect when the menu is opened.
@default true

@param VarId for Damage Floor
@type variable
@desc Use a variable value to determine the damage caused by the floor. Leave none for default.
@default 0

@param Exp Type
@type boolean
@on Use Default
@off Use Custom
@desc Choose if you want to use the default formula for experience rate.
@default true

@param Exp Formula Set
@type text
@desc Set your custom formula.
@default (level-1) * 100
@parent Exp Type

@param Critical Type
@type boolean
@on Use Default
@off Use Custom
@desc Choose if you want to use the default formula for critical hit or a custom one.
@default true

@param Critical Formula Set
@type text
@desc Set your custom formula.
@default damage * 2
@parent Critical Type

@param Max Battlers
@type number
@desc Choose the initial value for max battle members. Default is 4.
@default 4

@param Followers
@type boolean
@on Use Default
@off Use Custom
@desc Choose if you want to change the default number of followers in map. Default is 4.
@default true

@param Max Followers
@type number
@desc Choose the number of followers you want.
@default 4
@parent Followers

@param Party Name
@type boolean
@on Use Default
@off Use Custom
@desc Choose if you want to use a custom party name. Default is the leader name.
@default true

@param Custom Party Name
@type text
@desc Choose the initial party name. You can change it later with plugin commands too.
@default
@parent Party Name

@param Max Gold
@type number
@desc The initial value for Max Gold. You can change it later with plugin commands too.
@default 9999999

@param Max Items
@type number
@desc The initial value for Max Items. You can change it later with plugin commands too.
@default 99

@param Fade Speed
@type number
@desc Choose the duration of Fade In/Out. Default is 24 frames. You can change it later with plugin commands too.
@default 24
*/

/*:pt
@plugindesc v1.0 - Possibilita a customização de algumas configurações padrões do MV.
@author Eliaquim or Rakuen Zero

@help 
Feito e testado com Rpg Maker Mv 1.6.2
Sempre faça um backup do seu projeto!
============================================================================
Introdução
============================================================================

Existem muitas coisas no Rpg Maker Mv que sem a alternativa de um plugin não 
há como mudar o que está estabelecido por padrão. Coisas como a quantidade 
de slots para salvar, a fórmula usada para calcular a experiência para 
evoluir de nível. Dentre outras coisas.

Esse plugin foi feito para dar uma certa flexibilidade para o desenvolvedor 
de alterar essas configurações padrão. Algumas delas poderão ser alteraradas 
até durante o jogo.

============================================================================
Funcionalidades
============================================================================

Esse plugin oferece:
• Opção de escolher se o toque simultâneo de dois dedos será usado para abrir 
o menu/cancelar ou não em aparelhos móveis.
• Alterar a quantidade máxima de slots para salvar.
• Habilitar ou desabilitar o efeito blur no fundo da tela quando o menu é 
aberto.
• Escolher uma fórmula diferente para calcular quando o ator subirá de nível.
• Mudar quanto de HP é perdido pelo tile de dano com base no valor de uma 
variável.
• Mudar a fórmula que calcula a força do critical hit.
• Alterar a quantidade de atores que podem entrar em uma batalha.
• Definir um nome para o grupo com comando de plugin.
• Escolha a quantidade de seguidores que aparecerão no mapa.
• Escolha o valor máximo de ouro que o grupo pode carregar através de comando
de plugin.
• Escolha a quantidade máxima de items que o grupo pode carregar através de
comando de plugin.
• Escolha a duração para Fade In/Out através de comando de plugin.

============================================================================
Como usar
============================================================================

Para usar o plugin basta ir nos parâmetros de plugin. Entretanto, existem 
algumas coisas você deveria saber:

• A fómula padrão para calcular a experiência para subir de level é:
"Math.round(basis (Math.pow(level-1, 0.9+acc_a/250)) level 
(level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1) extra);"

• A fómula padrão que determina a força do critical hit é:
"damage * 3;"

• A quantidade de atores que entram em campo de batalha pode ser alterada 
durante o jogo. Mas a quantidade de seguidores não. Ela é definida somente 
nos parâmetros de plugin.

Plugin Commands:
• maxbattlers X
• partyname X
• maxgold X
• maxitems X
• fadespeed X

Troque o X pelo valor que quer. Todos são números, com exceção do nome do
grupo(partyname). Não testei com valores decimais.

============================================================================
Termos de uso
============================================================================

1. Dê os créditos para Eliaquim ou Rakuen Zero na seção de créditos do seu 
jogo.
2. Pode ser usado em jogos gratuitos e comerciais.
3. Não venda e nem diga que foi você que fez esse plugin ou parte dele.
4. Uma cópia gratuita do seu jogo seria legal(mas não é obrigatório).
5. Não redistribua esse plugin. Ao invés disso, dê este link para o download:
https://rakuenzero.itch.io/eli_utilities

============================================================================
Agradecimentos especiais e considerações
============================================================================

Agradecimentos a:
LTNGames, AloeGuvner, Nio Kasgami.

O plugin é gratuito. Entretanto, considere fazer uma doação se possível. 
Isso pode me ajudar com pequenas despesas e motivação! Trabalhar com jogos 
no Brasil é muito difícil. Mas não se sinta obrigado. Espero que minha 
pequena contribuição também seja um combustível de esperança para que 
você continue a fazer seus jogos! 
Obrigado!
PayPal > eliaquimranascimento@gmail.com

============================================================================
Contato
============================================================================

RM Web - https://forums.rpgmakerweb.com/index.php?members/eliaquim.123037/
Centro Rpg Maker - https://centrorpg.com/index.php?action=profile
Instagram - https://www.instagram.com/rakuen.zero
Twitter - https://twitter.com/rakuenzero
Facebook - https://www.facebook.com/rakuenzero

============================================================================
Log de atualizações
============================================================================
Versão 1.0
- Plugin lançado!

@param Cancel Two Fingers
@type boolean
@on Yes
@off No
@desc Usar o toque de dois dedos para abrir o menu/cancelar(Dispositivos móveis)?
@default true

@param Max Save Files
@text Max Save Files
@type number
@min 1
@max 100
@desc Determina quantos slots(arquivos) estarão disponíveis para o jogador usar. Por padrão são 20.
@default 20

@param Blur Menu
@type boolean
@on Use
@off Remove
@desc Remover o blur ao abrir o menu?
@default true

@param VarId for Damage Floor
@type variable
@desc Configura uma variável para determinar o dano causado pelo chão. O valor padrão é 10 de dano.
@default 0

@param Exp Type
@type boolean
@on Use Default
@off Use Custom
@desc Usar a fórmula padrão para aumento de level?
@default true

@param Exp Formula Set
@type text
@desc Coloque sua fórmula customizada aqui.
@default (level-1) * 100
@parent Exp Type

@param Critical Type
@type boolean
@on Use Default
@off Use Custom
@desc Usar a fórmula de dano crítico padrão?
@default true

@param Critical Formula Set
@type text
@desc Coloque sua fórmula customizada.
@default damage * 3
@parent Critical Type

@param Max Battlers
@type number
@desc Determine o número inicial de atores que podem entrar em batalha.
@default 0

@param Followers
@type boolean
@on Use Default
@off Use Custom
@desc Escolha se deseja alterar a quantidade de seguidores pelo mapa.
@default true

@param Max Followers
@type number
@desc Escolha a quantidade máxima de seguidores. O padrão são 4.
@default 4
@parent Followers

@param Party Name
@type boolean
@on Use Default
@off Use Custom
@desc Escolha se deseja usar o nome padrão para o grupo ou se deseja customizá-lo.
@default true

@param Custom Party Name
@type text
@desc Escolha o nome inicial do grupo.
@default
@parent Party Name

@param Max Gold
@type number
@desc Escolha o valor inicial máximo para o ouro.
@default 9999999

@param Max Items
@type number
@desc Escolha o valor inicial máximo para os items.
@default 99

@param Fade Speed
@type number
@desc Escolha a duração de fade In/Out. Padrão é 24 frames.
@default 24

*/

"use strict"; 
var Imported = Imported || {};
Imported.Eli_Utilities = true;

var Eli = Eli || {};
Eli.Utilities = Eli.Utilities || {};

Eli.Parameters = PluginManager.parameters('Eli_Utilities');
Eli.Param = Eli.Param || {};

	Eli.Param.Utilities = {
		CancelTwoFingers: JSON.parse(Eli.Parameters['Cancel Two Fingers']),
		NSaveFiles: Number(Eli.Parameters['Max Save Files']),
		BlurMenu: JSON.parse(Eli.Parameters['Blur Menu']),
		CritType: JSON.parse(Eli.Parameters['Critical Type']),
		CritFormSet: String(Eli.Parameters['Critical Formula Set']),
		ExpType: JSON.parse(Eli.Parameters['Exp Type']),
		ExpFormSet: String(Eli.Parameters['Exp Formula Set']),
		DmgFloorVarId: Number(Eli.Parameters['VarId for Damage Floor']),
		MaxBtlMemb: Number(Eli.Parameters['Max Battlers']),
		PartyName: JSON.parse(Eli.Parameters['Party Name']),
		PartyNameX: String(Eli.Parameters['Custom Party Name']),
		MxGd: Number(Eli.Parameters['Max Gold']),
		MxItm: Number(Eli.Parameters['Max Items']),
		Followers: JSON.parse(Eli.Parameters['Followers']),
		MaxFlw: Number(Eli.Parameters['Max Followers']),
		FadeSp: Number(Eli.Parameters['Fade Speed'])
	};

//RPG CORE

	// 3588
Eli.Utilities.TouchInput_isCancelled = TouchInput.isCancelled;
	TouchInput.isCancelled = function() {
		if (Eli.Param.Utilities.CancelTwoFingers) {
			return false;
		} else {
			return Eli.Utilities.TouchInput_isCancelled.call(this); // Case someone else's plugin use this function.
		}
	};
	
// RPG MANAGERS

	// 333
	DataManager.maxSavefiles = function() {
		return Eli.Param.Utilities.NSaveFiles;
	};
	
	//2112
	SceneManager.snapForBackground = function() {
		this._backgroundBitmap = this.snap();
		if (Eli.Param.Utilities.BlurMenu) {
			this._backgroundBitmap.blur();
		}
	};
	
// RPG OBJECTS

//1723
Eli.Utilities.Game_Action_applyCritical = Game_Action.prototype.applyCritical;
	Game_Action.prototype.applyCritical = function(damage) {
		if (Eli.Param.Utilities.CritType) {
			return Eli.Utilities.Game_Action_applyCritical.call(this, damage); // Case someone else's plugin use this function.
		} else {
			return eval(Eli.Param.Utilities.CritFormSet);
		}
	};

//3524
Eli.Utilities.Game_Actor_expForLevel = Game_Actor.prototype.expForLevel;
	Game_Actor.prototype.expForLevel = function(level) {
		if (Eli.Param.Utilities.ExpType) {
			return Eli.Utilities.Game_Actor_expForLevel.call(this, level);
		} else {
			var c = this.currentClass();
			var basis = c.expParams[0];
			var extra = c.expParams[1];
			var acc_a = c.expParams[2];
			var acc_b = c.expParams[3];
			return eval(Eli.Param.Utilities.ExpFormSet);
		}
	};

//4203
Eli.Utilities.Game_Actor_basicFloorDamage = Game_Actor.prototype.basicFloorDamage;
	Game_Actor.prototype.basicFloorDamage = function() {
		if(Eli.Param.Utilities.DmgFloorVarId > 0) {
			return $gameVariables.value(Eli.Param.Utilities.DmgFloorVarId);
		} else {
			return Eli.Utilities.Game_Actor_basicFloorDamage.call(this); // Case someone else's plugin use this function.
		}
	};

//4805
	Game_Party.prototype.maxBattleMembers = function() {
		return Eli.Param.Utilities.MaxBtlMemb;
	};
	
//4877
Eli.Utilities.Game_Party_name = Game_Party.prototype.name;
	Game_Party.prototype.name = function() {
		if(Eli.Param.Utilities.PartyName) {
			return Eli.Utilities.Game_Party_name.call(this);
		} else {
			let numBattleMembers = this.battleMembers().length;
			if (numBattleMembers === 0) {
				return '';
			} else if (numBattleMembers >= 1) {
				return Eli.Param.Utilities.PartyNameX;
			}
		}
	};

//4947
Eli.Utilities.Game_Party_maxGold = Game_Party.prototype.maxGold;
	Game_Party.prototype.maxGold = function() {
		return Eli.Param.Utilities.MxGd;
	};
	
//4964
Eli.Utilities.Game_Party_maxItems = Game_Party.prototype.maxItems;
	Game_Party.prototype.maxItems = function(item) {
		return Eli.Param.Utilities.MxItm;
	};

//8077
Eli.Utilities.Game_Followers_initialize = Game_Followers.prototype.initialize;
	Game_Followers.prototype.initialize = function() {
		if(Eli.Param.Utilities.Followers) {
			Eli.Utilities.Game_Followers_initialize.call(this);
		} else {
			this._visible = $dataSystem.optFollowers;
			this._gathering = false;
			this._data = [];
			for (var i = 1; i < Eli.Param.Utilities.MaxFlw; i++) {
				this._data.push(new Game_Follower(i));
			}
		}
	};

//8919
	Game_Interpreter.prototype.fadeSpeed = function() {
		return Eli.Param.Utilities.FadeSp;
	};

Eli.Utilities.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
	Eli.Utilities.Game_Interpreter_pluginCommand.call(this, command, args);
	let numarg = Number(args[0]);
	switch(command.toLowerCase()) {
		case "maxbattlers": 
			Eli.Param.Utilities.MaxBtlMemb = numarg;
		break;
		case "partyname":
			let name = String(args);
			Eli.Param.Utilities.PartyNameX = name.replace(/,/g, " ");
		break;
		case "maxgold":
			Eli.Param.Utilities.MxGd = numarg;
		break;
		case "maxitems":
			Eli.Param.Utilities.MxItm = numarg;
		break;
		case "fadespeed":
			Eli.Param.Utilities.FadeSp = numarg;
	}
};
