// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const InMemoryGeoTagStore = require("./geotag-store");
const GeoTag = require("./geotag");

/**
 * A class representing example geoTags at HKA
 *
 * TODO: populate your InMemoryGeoTagStore with these tags
 *
 */


class GeoTagExamples {
    /**
     * Provides some geoTag data
     */

    static inMemoryGeoTagStore;

    static get tagList() {
        return [
            ['Castle', 49.013790, 8.404435, '#sight'],
            ['IWI', 49.013790, 8.390071, '#edu'],
            ['Building E', 49.014993, 8.390049, '#campus'],
            ['Building F', 49.015608, 8.390112, '#campus'],
            ['Building M', 49.016171, 8.390155, '#campus'],
            ['Building LI', 49.015636, 8.389318, '#campus'],
            ['Auditorium He', 49.014915, 8.389264, '#campus'],
            ['Building R', 49.014992, 8.392365, '#campus'],
            ['Building A', 49.015738, 8.391619, '#campus'],
            ['Building B', 49.016843, 8.391372, '#campus'],
            ['Building K', 49.013190, 8.392090, '#campus'],
        ];
    }

    static populate() {
        GeoTagExamples.inMemoryGeoTagStore = new InMemoryGeoTagStore();
        for (let i in GeoTagExamples.tagList) {
            GeoTagExamples.inMemoryGeoTagStore.addGeoTag(new GeoTag(i[0], i[1], i[2], i[3]));
        }
    }
}

GeoTagExamples.populate();

module.exports = GeoTagExamples;
