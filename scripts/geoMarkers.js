import Map from './map';

export default class GeoMarkers {
    constructor() {
        this.map = new Map('map', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
    }

    async onInit() {

    }

    onClick(coords) {

    }
}