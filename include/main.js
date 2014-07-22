var activeTile; // Tile with focus.

var resources = {};
for (var key in buildings) { // Create resource object.
    if (buildings.hasOwnProperty(key)) {
        resources[buildings[key][0]] = [0, 0]; // Set resources.resourceName = [income, amount].
    }
}
var resourceTick = 5000;
var lastMove = new Date().getTime(); // Submarine delay.
var settings = {};
var saveData = JSON.parse(localStorage.saveData || null) || {};

// Initialize game.
$(document).ready(function () {
    musicPlayer = document.getElementById("music");
    speechPlayer = document.getElementById("speech");
    effectsPlayer = document.getElementById("effects");

    if ($.isEmptyObject(saveData) || saveData.newGame === true)
        intro();
    else
        $('#movie').fadeOut("slow");

    setup();

    $("body").click(function (event) { // Bind deselect.
        var target = $(event.target);
        if (target.is($("#container")) || target.is($("body")))
            deselectAll();
    });

    if (!loadGame()) // First time or new game.
        newGame();

    updateLoop(); // Start game.
    submarineMouseMove(); // Make sub follow mouseclicks.
});

function saveGame() {
    // Map buildings TileID, Type.
    saveData.buildings = $('.tile').children("img").map(function (i, el) {
        return [[el.parentNode.id, el.className]];
    }).toArray();
    saveData.resources = resources;
    saveData.settings = settings;
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
}

function loadGame() {
    if ($.isEmptyObject(saveData) || saveData.newGame === true)
        return false;

    // Restore settings.
    settings = saveData.settings || settings;
    if (!restoreSettings())
        alert("Settings failed to load");

    for (var i = 0; i < saveData.buildings.length; i++) {
        // Build (type, target).
        build(saveData.buildings[i][1], saveData.buildings[i][0]);
    }

    var timeSinceSave = new Date().getTime() - saveData.time;
    for (var key in resources) {
        if (resources.hasOwnProperty(key)) {
            // Load old stock + income update.
            resources[key][1] = parseFloat(saveData.resources[key][1]);
            resources[key][1] += Math.round(resources[key][0] * (timeSinceSave / resourceTick)); // Test pop?
            // TODO: update all game ticks instead of just resources?
        }
    }
    return true;
}

function restoreSettings() { // Restore saved settings.
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) { // key: music players.
            for (var k in settings[key]) { // k: key.properties.
                if (settings[key].hasOwnProperty(k)) {
                    console.log("Restoring: " + key + " " + k + " " + settings[key][k]);
                    if (k === "volume")
                        Audio.setVolume(settings[key][k], document.getElementById(key)); // Value, player.
                    else if (k === "muted" && settings[key][k]) // Muted is true.
                        Audio.togglePlayers(document.getElementById(key));
                }
            }
        }
    }
    return true; // TODO: Add false or remove
}

function newGame() {
    for (var key in resources) {
        if (resources.hasOwnProperty(key)) {
            resources[key][1] = 100; // Set stock to 100 for all resources.
        }
    }
    // Reset game state.
    saveData.newGame = false;
}

function setup() {
    var tileCount = 100;

    // Create Grid
    var grid = $('#grid');
    for (var i = 0; i < tileCount; i++) {
        var tile = document.createElement('div');
        tile.id = "t" + (i + 1);
        tile.className = "tile";
        tile.onclick = function () {
            deselect();
            activeTile = $(this);
            $(this).addClass("active");
        };
        grid.append(tile);
    }

    //Create Statusbar (resources).
    var status = $('#status');
    for (var key in buildings) {
        if (buildings.hasOwnProperty(key)) {
            var resource = document.createElement('div');
            var resourceCounter = document.createElement('div');
            resourceCounter.id = buildings[key][0];
            resource.className = "resource";
            resource.innerHTML = buildings[key][0];
            resourceCounter.innerHTML = 0;
            resource.style.backgroundImage = "url('images/resources/" + resourceCounter.id + ".jpg')";
            resource.onclick = function () {
                alert("It's " + this.firstElementChild.id + " baby!");
            };
            resource.appendChild(resourceCounter);
            status.append(resource);
        }
    }

    //Create Buildings Menu
    var menu = $('#menu');
    for (var key in buildings) {
        if (buildings.hasOwnProperty(key)) {
            var building = document.createElement('div');
            building.id = key;
            //building.className = "building";
            building.innerHTML = key;
            building.style.backgroundImage = "url('images/buildings/" + building.id + ".png')";
            building.onclick = function () {
                build(this.id);
            };
            menu.append(building);
        }
    }
}

function deselect() {
    if (activeTile) {
        activeTile.removeClass("active");
        activeTile = null;
    }
}

function deselectAll() {
    deselect();
    //$('#menu').fadeOut("slow");
    //$('#system').fadeOut("slow");
}


function pay(type) {
    // Test cost.
    var i = 0;
    for (var key in resources) {
        if (resources.hasOwnProperty(key)) {
            if (resources[key][1] < buildings[type][2][i])
                return false;
            else
                i++;
        }
    }

    // Substract cost.
    i = 0;
    for (var key in resources) {
        if (resources.hasOwnProperty(key)) {
            resources[key][1] -= buildings[type][2][i];
            i++;
        }
    }
    return true;
}

function demolish(type) {
    activeTile.empty();
    deselect();

    // Update income.
    resources[buildings[type][0]][0] -= buildings[type][1];
}


// Sub has arrived!
$(document).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
function (event) {
    var $target = $(event.target);
    if ($target.hasClass("submarine") && event.originalEvent.propertyName === 'top') { // Keep from firing for each attr.
        console.log(event.type + " " + new Date().getTime());
        alert("Sub has arrived!");
    }
});

//------- Hotkeys & Events End -------//
function intro() { // TODO foreach rotator
    var screen1 = $('#screen1');
    var screen2 = $('#screen2');
    var bg = $('#screen3');
    document.getElementById("speech").play();

    screen1.css({
        'background': 'url(images/intro.jpg)',
        'background-position': 'left center',
        'background-size': '100% 100%',
        '-webkit-filter': 'none'
    });

    bg.css({
        'z-index': '800'
    });

    screen2.css({
        'z-index': '900',
        'opacity': '0',
        'background-position': 'left center'
    });

    setTimeout(function () {
        screen1.css({
            'opacity': '0'
        });

        screen2.css({
            'background': 'url(images/intro2.jpg)',
            'background-position': 'right center',
            'background-size': '100% 100%',
            '-webkit-filter': 'none',
            'opacity': '1'
        });
    }, 10000);

    setTimeout(function () {
        screen2.css({
            'opacity': '0'
        });
    }, 20000);

    setTimeout(function () {
        $('#movie').fadeOut();
    }, 50000);

    setTimeout(function () {
        $('#movie').remove();
    }, 55000);
}



function submarineMouseMove() {
    $('.tile').on('click', function (e) {
        var $target = $(e.target);
        if (!$target.hasClass('tile')) // Building was clicked.
            $target = $target.parent();

        if (new Date().getTime() - lastMove < 3000)
            return;

        //TODO:
        effectsPlayer.play();

        lastMove = new Date().getTime();

        var submarine = $('.submarine'),
            newX = $target.offset().left + $target.width(),
            newY = $target.offset().top,
            submarineX = newX - submarine.width() / 2,
            submarineY = newY - submarine.height() / 2;

        $('.submarine').css({
            top: submarineY,
            left: submarineX
        });

        // Set the direction.
        if (newX < submarine.offset().left - submarine.width() / 2) {
            submarine.removeClass('right');
            submarine.addClass('left');
        }
        else {
            submarine.removeClass('left');
            submarine.addClass('right');
        }

        if (newY > submarine.offset().top - submarine.height() / 2) {
            submarine.removeClass('top');
            submarine.addClass('bottom');
        }
        else {
            submarine.removeClass('bottom');
            submarine.addClass('top');
        }

        // Logging.
        $('.log1').html('Cursor X: ' + newX + ' | Cursor Y: ' + newY + '<br>submarine X: ' + submarineX + ' | submarine Y: ' + submarineY);

    });
}

function lineDistance(point1, point2) { // TODO implement speed
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}