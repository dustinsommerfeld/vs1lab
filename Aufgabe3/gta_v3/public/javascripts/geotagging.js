// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/*
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateMap(lat, long) {
    let nearTaglist = JSON.parse(document.getElementById("mapView").getAttribute("data-tags"));
    let mapManager = new MapManager("1B01AJ2nIgqKzmdYXhvgQbCVZltB6csW");
    let mapUrl = mapManager.getMapUrl(lat, long, nearTaglist);
    document.getElementById("mapView").setAttribute("src", mapUrl);
}

/*
 * (1) Mit static function LocationHelper-Instanz holen (callback-function als Parameter die locationHelper Instanz
 * liefert)
 * (2) Über document.getElementById Referenzen auf HTML holen (discovery + tagging jeweils longitude latitude)
 * (3) Den Wert des Attribut value verändern mit Instanz von locationHelper und entsprechenden Coords
 */
function updateLocation () {
    if (document.getElementById("tagging_latitude").getAttribute("value" ) === "" ||
        document.getElementById("tagging_longitude").getAttribute("value")=== "" )
    {
        LocationHelper.findLocation(function (locationHelper) {
            document.getElementById("discovery_latitude")
                .setAttribute("value", locationHelper.latitude);
            document.getElementById("tagging_latitude")
                .setAttribute("value", locationHelper.latitude);
            document.getElementById("discovery_longitude")
                .setAttribute("value", locationHelper.longitude);
            document.getElementById("tagging_longitude")
                .setAttribute("value", locationHelper.longitude);
            updateMap(locationHelper.latitude, locationHelper.longitude);
        })
    } else {
        let lat = document.getElementById("tagging_latitude").getAttribute("value");
        let long = document.getElementById("tagging_longitude").getAttribute("value");
        updateMap(lat, long);
    }
}

document.addEventListener("DOMContentLoaded", updateLocation, true);


// Wait for the page to fully load its DOM content, then call updateLocation
