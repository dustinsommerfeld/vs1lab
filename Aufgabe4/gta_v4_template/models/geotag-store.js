// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */


const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */

class InMemoryGeoTagStore {

    #geoTags = [];

    get geoTags() {
        return this.#geoTags;
    }

    addGeoTag(geotag) {
        if(this.searchGeoTag(geotag.name) == null) {
            this.#geoTags.push(geotag);
        }
    }

    removeGeoTag(name) {
        for (let i = 0; i < this.#geoTags.length; i++) {
            if (this.#geoTags[i].name === name) {
                let removedGeoTag = this.#geoTags[i];
                this.#geoTags.splice(i, 1);
                return removedGeoTag;
            }
        }
    }

    getNearbyGeoTags(location) {
        let nearbyGeoTags = [];
        let distance;

        for (let i = 0; i < this.#geoTags.length; i++) {
            distance = this.calculateDistance(location, this.#geoTags[i]);
            //distance < 0.282
            if (distance < 10) {
                nearbyGeoTags.push(this.#geoTags[i]);
            }
        }
        return nearbyGeoTags;
    }

    searchNearbyGeoTags(keyword) {
        let geoTagMatching;
        let nearbyGeoTags = [];
        let stringMatch;
        let geoTagName;

        let regExp = new RegExp(keyword, 'gi') //Ignores Case + returns value in Array for each time finding keyword string in geoTagName

        for (let i = 0; i < this.#geoTags.length; i++) {
            geoTagName = this.#geoTags[i].name;
            stringMatch = geoTagName.match(regExp);

            if(stringMatch != null) {
                geoTagMatching = this.#geoTags[i];
                // let array = this.getNearbyGeoTags(geoTagMatching);

                nearbyGeoTags.push(geoTagMatching);
            }
        }

        return nearbyGeoTags;
    }

    searchGeoTag(id){
        for (let i = 0; i < this.#geoTags.length; i++) {
            if(this.#geoTags[i].name === id) {
                return this.#geoTags[i];
            }
        }
        return null;
    }

    changeGeoTag(geoTag, id){
        let foundGeoTag = this.searchGeoTag(id);
        console.log(foundGeoTag);
        if(foundGeoTag !== undefined) {
            console.log(foundGeoTag)
            console.log(foundGeoTag.name)
            this.removeGeoTag(foundGeoTag.name)
            this.#geoTags.unshift(geoTag);
        }
    }

    calculateDistance(from, to) {
        let fromX = from.latitude;
        let fromY = from.longitude;
        let toX = to.latitude;
        let toY = to.longitude;
        return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    }

    populate() {
        let tagList = GeoTagExamples.tagList;
        for (let i = 0; i < (GeoTagExamples.tagList).length; i++) {
            this.addGeoTag(new GeoTag(tagList[i][0], tagList[i][1], tagList[i][2], tagList[i][3]));
        }
    }
}


module.exports = InMemoryGeoTagStore;
