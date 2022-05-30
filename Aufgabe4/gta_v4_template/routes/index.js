// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// GeoTagStore
var tagStore = new GeoTagStore();
tagStore.populate();

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
router.get('/', (req, res) => {
    res.render('index', { taglist: tagStore.geoTags, userLatitude: "", userLongitude: "", mapTaglist: JSON.stringify(tagStore.geoTags) })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
router.get('/api/geotags', (req, res) => {
    let discoveryQuery = req.query.discovery_searchterm;
    let nearbyGeoTags;
    let filteredLocation;

    // if searchterm, then filtered
    if (req.body.discovery_searchterm != null) {
        nearbyGeoTags = tagStore.searchNearbyGeoTags(discoveryQuery);
    }

    // if lat + long available, then filtered
    if (req.body.discovery_latitude != null && req.body.discovery_longitude != null) {
        filteredLocation = tagStore.getNearbyGeoTags(nearbyGeoTags);
    }

    res.render('index', {
        taglist: JSON.stringify(nearbyGeoTags),
        userLatitude: req.body.discovery_latitude,
        userLongitude: req.body.discovery_longitude,
        mapTaglist: JSON.stringify(nearbyGeoTags)
    })
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
router.post('/api/geotags', (req, res) => {
    let name = req.body.discovery_name;
    let latitude = parseFloat(req.body.discovery_latitude);
    let longitude = parseFloat(req.body.discovery_longitude);
    let hashtag = req.body.discovery_hashtag;

    let geoTagObject = new GeoTag(name, latitude, longitude, hashtag);
    tagStore.addGeoTag(geoTagObject);
    let geoTagAsJson = req.query.toJSON(geoTagObject);

    res.render('index', {
        resourceURL: JSON.stringify(geoTagAsJson.url)
    })
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
router.get('/api/geotags/:id', (req, res) => {
    //id is specified via name of specific GeoTag
    let geoTagID = req.params.id;

    let foundGeoTag = tagStore.searchGeoTag(geoTagID);
    //TODO Was wenn foundGeoTag == null, weil GeoTag mit dieser id nicht in Store?

    res.render('index', {
        geotagID: JSON.stringify(foundGeoTag)
    })
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response.
 */
router.put('/api/geotags/:id', (req, res) => {
    let geoTagID = req.params.id;
    let geoTag = JSON.stringify(req.query.geoTagObject);
    // let value = req.body.valueOf(geoTag);

    geoTag.changeGeoTag(geoTag, geoTagID);

    res.render('index', {
        resourceURL: JSON.stringify(geoTag.url) //TODO Warum hier url zurückgeben und nicht den geoTag
    })
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
router.delete('/api/geotags/:id', (req, res) => {
    let geoTagID = req.params.id;
    let geoTag = JSON.stringify(req.query.geoTagObject);

    let removedGeoTag = tagStore.removeGeoTag(geoTagID);

    res.render('index', {
        resourceURL: JSON.stringify(geoTag.url) //TODO Hier auch wieder: Warum url und nicht removedGeoTag?
    })
});

module.exports = router;
