export default class Map {
    constructor(mapId, onClick) {
        this.mapId = mapId;
        this.onClick = onClick;
    }
    async init() {
        await this.injectScript();
        await this.loadYMaps();
        this.initMap();
    }
    injectScript() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=50f976f6-1098-4dca-a7bf-9028ad375a69&lang=ru_RU';
            document.body.appendChild(script);
            script.addEventListener('load', resolve);
        })
    }
    loadYMaps() {
        return new Promise(resolve => ymaps.ready(resolve)); // здесь появляется глобальный объекс "ymaps"
    }
    initMap() {
        let placemarks = [];
        this.map = new ymaps.Map(this.mapId, {
            center: [59.94, 30.32],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
        });
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterIcons: [
                {
                    href: './src/icons/cbaner_pin.png',
                    size: [60, 60],
                    offset: [-20, -50]
                }
            ],
            clusterIconContentLayout: null,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordintaes();
            this.onClick(coords);
        });

        this.map.events.add('click', (e) => this.onClick(e.get('coords')));

            // var coords = e.get('coords');
            // let item = {
            //     latitude: coords[0],
            //     longitude: coords[1],
            //     hintContent: '<div class="map__hint">ул.Литераторов д.19</div>',
            //     balloonContent: [
            //         '<div class="map__balloon">',
            //         '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
            //         'Пышечная по адресу: ул.Литераторов д.19',
            //         '</div>'
            //     ]
            // }
            // placemarks.push(item);
            //

        // });

        this.map.geoObjects.add(this.clusterer);
        let geoObjects = [];
        for (let i = 0; i < placemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], {
                    hintContent: placemarks[i].hintContent,
                    balloonContent: placemarks[i].balloonContent.join('')
                },
                {
                    iconLayout: 'default#image',
                    iconImageHref: './src/icons/google-map-marker.png',
                    iconImageSize: [37, 55],
                    iconImageOffset: [-23, -57]
                });

        }

        this.map.behaviors.enable('scrollZoom');

    }
}
const map = new Map('map');
map.init();

