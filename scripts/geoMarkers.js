import Map from './map';

export default class GeoMarkers {
    constructor() {
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
        this.map = new Map('map', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
    }

    async onInit() {

    }

    onClick(coords) {
        const form = this.createForm(coords);
        this.map.openBalloon(coords, form.innerHTML);
    }

    createForm(coords) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);

        return root;
    }
}