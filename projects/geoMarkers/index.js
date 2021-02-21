class Map {
    constructor(mapId, onClick) {
        this.mapId = mapId;
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    }

    async init() {
        await this.injectYMapsScript();
        await this.loadYMaps();
        this.initMap();
        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }

    injectYMapsScript() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=50f976f6-1098-4dca-a7bf-9028ad375a69&lang=ru_RU';
            document.body.appendChild(script);
            script.addEventListener('load', resolve);
        })
    }

    loadYMaps() {
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    async onInit() {
        const coords = await this.callApi('coords');

        for (const item of coords) {
            for (let i = 0; i < item.total; i++) {
                this.map.createPlacemark(item.coords);
            }
        }

        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }

    async postData(body = {}) {
        const res = await fetch('https://maps-reviews-e5dc7-default-rtdb.firebaseio.com/reviews.json', {
            method: 'post',
            body: JSON.stringify(body),
        });
        return await res.json();
    }

    async getData() {
        fetch('https://maps-reviews-e5dc7-default-rtdb.firebaseio.com/reviews.json')
            .then(response => response.json())
            .then(reviews => alert(reviews[0]));
    }

    createForm(coords) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewList = root.querySelector('.review-list');
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);
        const list = this.postData({ coords });

        // console.log('reviews', reviews);


            // const div = document.createElement('div');
            // div.classList.add('review-item');
            // div.innerHTML = `
            // <div>
            //   <b>${reviews.name}</b> [${reviews.place}]
            // </div>
            // <div>${reviews.text}</div>
            // `;
            // reviewList.appendChild(div);

        return root;
    }

    async onClick(coords) {
        map.openBalloon(coords, 'Загрузка...');

        const form = this.createForm(coords);
        map.setBalloonContent(form.innerHTML);
    }

    async onDocumentClick(e) {
        if (e.target.dataset.role === 'review-add') {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const coords = JSON.parse(reviewForm.dataset.coords);
            console.log('coords', coords);
            const data = {
                coords,
                review: {
                    name: document.querySelector('[data-role=review-name]').value,
                    place: document.querySelector('[data-role=review-place]').value,
                    text: document.querySelector('[data-role=review-text]').value,
                },
            };

            try {
                await this.postData(data);
                this.map.createPlacemark(coords);
                this.map.closeBalloon();
            } catch (e) {
                const formError = document.querySelector('.form-error');
                formError.innerText = e.message;
            }
        }
    }

    initMap() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.map = new ymaps.Map(this.mapId, {
            center: [55.76, 37.64],
            zoom: 10,
        });
        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.geoObjects.add(this.clusterer);
    }

    openBalloon(coords, content) {
        this.map.balloon.open(coords, content);
    }

    setBalloonContent(content) {
        this.map.balloon.setData(content);
    }

    closeBalloon() {
        this.map.balloon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords);
        placemark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placemark);
    }
}

const map = new Map('map');
map.init();