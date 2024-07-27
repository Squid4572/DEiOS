Game_Followers.prototype.initialize = function() {
    this._visible = $dataSystem.optFollowers;
    this._gathering = false;
    this._data = [];
    var maximum = 5 || $gameParty.allMembers();
    for (var i = 1; i < maximum; i++) {
        this._data.push(new Game_Follower(i));
    }
};
