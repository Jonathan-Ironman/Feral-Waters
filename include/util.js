//--------- Hotkeys & Events ---------//
$(document).keyup(function (event) {
    var enter = 13, esc = 27, left = 37, up = 38, right = 39, down = 40, M = 77, F9 = 120, del = 46;

    switch (event.which) {
        case enter:
            $.event.trigger({
                type: "confirm",
                message: "Hello World!", // TODO dummy code.
                time: new Date()
            });
            break;
        case esc:
            $.event.trigger("cancel");
            break;
        case left:
            break;
        case up:
            Audio.volumeUp();
            break;
        case right:
            break;
        case down:
            Audio.volumeDown();
            break;
        case M:
            Audio.togglePlayers(musicPlayer);
            //Audio.togglePlayers();
            break;
        case F9:
            localStorage.clear();
            saveData.newGame = true;
            location.reload();
            break;
        case del:

            break;
        default:
            return;
    }
});

$(document).on("confirm", function (event) {
    alert("Confirmed: " + event.message + ' @ ' + event.time);
    $(document).off("confirm");
});

$(document).on("cancel", function (event) {
    $(".popup").fadeOut(300);

    deselectAll();
});

$(document).on("contextmenu", function (event) {
    //event.preventDefault();
    //var target = event.target;
    //alert("context: " + target.id);
});

// Call save.
$(window).on('unload', function () {
    saveGame();
});

window.alert = function (message, type, duration) {
    duration = duration || 1500;
    // TODO
    var elem = $('<div/>', {
        class: 'alert popup',
        //title: 'Become a Googler',
        text: message
    }).appendTo('body');

    elem.delay(duration).fadeOut(300);
    setTimeout(function () {
        elem.remove();
    }, duration + 300);
};

function warn(message, duration) {

}

window.onerror = function errorHandler(errorMsg, url, lineNumber) {
    return alert(errorMsg, url, 4000);
};