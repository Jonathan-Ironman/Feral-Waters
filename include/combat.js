function fireMissile() {
    var submarine = $('.submarine'),
        mouseX = currentMousePos[0],
        mouseY = currentMousePos[1],
        missileStartX = submarine.offset().left + submarine.width() / 2,
        missileStartY = submarine.offset().top + submarine.height() / 2,
        missile = document.createElement("div");

    missile.style.top = missileStartY + "px";
    missile.style.left = missileStartX + "px";
    missile.className = "missile";

    $(document.body).append(missile);

    // Delay or it will travel instant.
    window.setTimeout(function () {
        missile.style.top = mouseY + "px";
        missile.style.left = mouseX + "px";
    }, 10);

    // Logging.
    $('.log1').html('Cursor X: ' + mouseX + ' | Cursor Y: ' + mouseY + '<br>Missile start X: ' + missileStartX + ' | Missile start Y: ' + missileStartY);
}

function explode(x, y) {
    var explosion = document.createElement("div");

    explosion.style.top = y + "px";
    explosion.style.left = x + "px";
    explosion.className = "explosion explosion" + getRandomInt(1, 5);
    $(document.body).append(explosion);
}

// Bind end to explosion.    
$(document).on('transitionend',
function (event) {
    var $target = $(event.target);
    // Missile.
    if ($target.hasClass("missile") && event.originalEvent.propertyName === 'top') { // Keep from firing for each attr.
        console.log("Missile: " + event.type + " " + event.timeStamp);
        //alert("KILL KILL!");
        explode(
         $target.offset().left - $target.width() / 2,
         $target.offset().top - $target.height() / 2
            );
        $target.remove();
    }
});

// Track mouse all the time.
var currentMousePos = [0, 0];
document.addEventListener('mousemove', function storeMouse(event) {
    currentMousePos = [event.clientX, event.clientY];
});

// TODO: temp helper, should get better versions in util.js
function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

// TODO: move to xxx.js
$(document).on('animationend webkitAnimationEnd',
function (event) {
    var $target = $(event.target);
    // Explosion.
    if ($target.hasClass("explosion")) {
        console.log("Explosion: type'" + event.target.className + "' " + event.type + " " + event.timeStamp);
        $target.remove();
        //alert("Boom!");
    }
});

// TODO: move to xxx.js
$(document).keydown(function (event) {
    var enter = 13, esc = 27, space = 32, left = 37, up = 38, right = 39, down = 40, M = 77, F9 = 120, del = 46;

    switch (event.which) {
        case space:
            // TODO test
            fireMissile();
            break;
        default:
            return;
    }
});