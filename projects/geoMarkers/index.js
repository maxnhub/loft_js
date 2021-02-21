class Map {
    constructor(mapId, onClick) {
        this.mapId = mapId;
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    }
    async init() {
        await this.injectYMapsScript();
        await this.loadYMaps();
        this.initMap();
        this.onInit();
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
        const coords = await this.getData();
        let arr = Object.entries(coords);
        arr.forEach(([key, value]) => {
            let x = value.coords[0];
            let y = value.coords[1];
            let markerCoords = x + ', ' + y;
            console.log('markerCoords', markerCoords);
            this.map.createPlacemark(markerCoords);
        });

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
        // fetch('https://maps-reviews-e5dc7-default-rtdb.firebaseio.com/reviews.json')
        //     .then(response => response.json())
        //     .then(res => console.log('res', res))
        const res = await fetch('https://maps-reviews-e5dc7-default-rtdb.firebaseio.com/reviews.json', {
            method: 'get'
        });
        return await res.json();
    }
    createForm(coords, data) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewList = root.querySelector('.review-list');
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);
        console.log('data', data);

            for(let i = 0; i<= data.length; i++) {
                console.log('data[i].coords', data[i].coords);

                // if(координаты из базы == тек.коориданаты) {
                //     for (const item of res[i].coords.review) {
                //         const div = document.createElement('div');
                //         div.classList.add('review-item');
                //         div.innerHTML = `
                //         <div>
                //           <b>${item.name}</b> [${item.place}]
                //         </div>
                //         <div>${item.text}</div>
                //         `;
                //         reviewList.appendChild(div);
                //     }
                // }


            }



        return root;
    }
    async onClick(coords) {
        await this.openBalloon(coords, 'Загрузка...');
        const data = await this.getData();
        const form = this.createForm(coords, data);
        this.setBalloonContent(form.innerHTML);
    }
    async onDocumentClick(e) {
        if (e.target.dataset.role === 'review-add') {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const coords = JSON.parse(reviewForm.dataset.coords);
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
                this.createPlacemark(coords);
                this.closeBalloon();
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