function updateLoop() {
    for (var key in resources) {
        if (resources.hasOwnProperty(key)) {
            // Add income to stock.
            //resources[key][1] = (Math.round((resources[key][1] + resources[key][0]) * 10) / 10); // JS rounding error
            resources[key][1] += resources[key][0];
            //resources[key][1] = (parseFloat(resources[key][1]) + parseFloat(resources[key][0])).toFixed(1);
            document.getElementById(key).innerHTML = Math.floor(resources[key][1]); // Round down displayed value.
        }
    }
    // TODO: replace by setInterval as it is more accurate.
    setTimeout(updateLoop, resourceTick);
}