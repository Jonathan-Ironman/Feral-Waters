var musicPlayer, speechPlayer, effectsPlayer;

var Audio = { // TODO: Redefiniton of Audio, might want to change name
    // TODO: simplify Audio obj.
    togglePlayers: function (player) {
        var players;
        player ? players = [player] : players = [musicPlayer, speechPlayer, effectsPlayer];
        for (var i = 0; i < players.length; i++) {
            players[i].muted = !players[i].muted;
            settings[players[i].id] = settings[players[i].id] || {};
            settings[players[i].id].muted = players[i].muted;
        }
    },
    volumeDown: function (player) {
        var players;
        player ? players = [player] : players = [musicPlayer, speechPlayer, effectsPlayer];
        for (var i = 0; i < players.length; i++) {
            if (players[i].volume > 0)
                players[i].volume = (Math.round((players[i].volume - 0.1) * 10) / 10); // JS math error fix
            alert("Volume: " + players[i].volume * 10);
            settings[players[i].id] = settings[players[i].id] || {};
            settings[players[i].id].volume = players[i].volume;
            console.log(settings[players[i].id] + " " + players[i].id + " " + players[i].volume + " " + settings[players[i].id].volume);
        }
    },
    volumeUp: function (player) {
        var players;
        player ? players = [player] : players = [musicPlayer, speechPlayer, effectsPlayer];
        for (var i = 0; i < players.length; i++) {
            if (players[i].volume < 1)
                players[i].volume = (Math.round((players[i].volume + 0.1) * 10) / 10); // JS math error fix
            alert("Volume: " + players[i].volume * 10);
            settings[players[i].id] = settings[players[i].id] || {};
            settings[players[i].id].volume = players[i].volume;
            console.log(settings[players[i].id] + " " + players[i].id + " " + players[i].volume + " " + settings[players[i].id].volume);
        }
    },
    setVolume: function (volume, player) {
        var players;
        player ? players = [player] : players = [musicPlayer, speechPlayer, effectsPlayer];
        for (var i = 0; i < players.length; i++) {
            players[i].volume = volume;
            alert("Volume set: " + players[i].volume * 10);
        }
    },
    nextTrack: function () {
        var player = musicPlayer;
        !player.paused ? player.pause() : player.play();
    }
};
