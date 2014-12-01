var buildings = {
    "Forge": ["Steel", 10, [50, 0, 20, 20], 100],
    "Hydropon": ["Food", 50, [50, 0, 10, 10], 100],
    "Extractor": ["Energy", 10, [50, 0, 30, 10], 100],
    "Melter": ["Obsidian", 10, [50, 0, 20, 5], 100],
    "Housing": ["Population", 1, [50, 0, 10, 30], 100],
    "Storage": ["Room", 0, [50, 0, 10, 10], 500]
};

function build(type, target) {
    if (!target) { // Target comes from Load function, these buildings are free.
        if (!activeTile)
            return alert("Nothing selected");  // Nothing selected.
        if (activeTile.children().length) // Already has a building.
            return alert("You can't build there!");
        if (!pay(type)) // Pay or return.
            return alert("You are poor!");
    }

    var building = document.createElement('img');
    building.className = type;
    building.title = type;
    building.src = "images/buildings/" + type + ".png";
    if (target) {
        $('#' + target).append(building);
    }
    else {
        activeTile.append(building);
        deselect();
    }

    // Update income: Resource.name.income = buildings.type.income.
    resources[buildings[type][0]][0] += buildings[type][1];
}