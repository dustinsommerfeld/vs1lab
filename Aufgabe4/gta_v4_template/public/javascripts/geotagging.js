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

function getUpdateMap(geotags) {
    let mapManager = new MapManager("1B01AJ2nIgqKzmdYXhvgQbCVZltB6csW");
    let lat = parseFloat(document.getElementById("tagging_latitude").getAttribute("value"));
    let long = parseFloat(document.getElementById("tagging_longitude").getAttribute("value"));
    let mapUrl = mapManager.getMapUrl(lat, long, JSON.parse(geotags), 10);
    document.getElementById("mapView").setAttribute("src", mapUrl);

    return geotags;
}

/*
 * (1) Mit static function LocationHelper-Instanz holen (callback-function als Parameter die locationHelper Instanz
 * liefert)
 * (2) Über document.getElementById Referenzen auf HTML holen (discovery + tagging jeweils longitude latitude)
 * (3) Den Wert des Attribut value verändern mit Instanz von locationHelper und entsprechenden Coords
 */
function updateLocation() {
    if (document.getElementById("tagging_latitude").getAttribute("value") === "" ||
        document.getElementById("tagging_longitude").getAttribute("value") === "") {
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

function updateList(geotags) {
    let taglist = JSON.parse(geotags);

    if (taglist !== undefined) {
        let list = document.getElementById("discoveryResults");
        list.innerHTML = "";

        taglist.forEach(function (gtag) {
            let li = document.createElement("li");
            li.innerHTML = gtag.name + " (" + gtag.location.latitude + "," + gtag.location.longitude + ") " + gtag.hashtag;
            list.appendChild(li);
        });
    }
}

async function postAdd(geotag) {
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });

    return await response.json();
}

async function getTagList(searchTerm) {
    let geotag = await fetch("http://localhost:3000/api/geotags/" + searchTerm);

    geotag = await geotag.json();
    geotag = JSON.parse(geotag);

    let latitude = geotag.location.latitude;
    let longitude = geotag.location.longitude;
    let response = await fetch("http://localhost:3000/api/geotags?latitude=" + latitude + "&longitude=" + longitude + "&searchterm=" + searchTerm);
    return await response.json();
}

document.getElementById("tag-form").addEventListener("submit", function (evt) {
    evt.preventDefault();

    let geotag = {
        name: document.getElementById("tagging_name").value,
        location: {
            latitude: document.getElementById("tagging_latitude").value,
            longitude: document.getElementById("tagging_longitude").value,
        },
        hashtag: document.getElementById("tagging_hashtag").value
    }

    postAdd(geotag).then(getUpdateMap).then(updateList);
    document.getElementById("tagging_name").value = "";
    document.getElementById("tagging_hashtag").value = "";
}, true);

document.getElementById("discoveryFilterForm").addEventListener("submit", function (evt) {
    evt.preventDefault();

    let searchTerm = document.getElementById("discovery_searchterm").value;

    getTagList(searchTerm).then(getUpdateMap).then(updateList);
})

document.addEventListener("DOMContentLoaded", updateLocation, true);
