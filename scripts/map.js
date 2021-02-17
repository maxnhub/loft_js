class Map {
    constructor(mapId) {
        this.mapId = mapId;
    }
    async init() {
        await this.injectScript();
        await this.loadYMaps();
        this.initMap();
    }
    injectScript() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
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
            clusterIconContentLayout: null
        })
        this.map.events.add('click', function (e) {
            var coords = e.get('coords');
            let item = {
                latitude: coords[0],
                longitude: coords[1],
                hintContent: '<div class="map__hint">ул.Литераторов д.19</div>',
                balloonContent: [
                    '<div class="map__balloon">',
                    '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
                    'Пышечная по адресу: ул.Литераторов д.19',
                    '</div>'
                ]
            }
            placemarks.push(item);
            console.log(placemarks);
            var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout">$</div></div>');

            var squarePlacemark = new ymaps.Placemark(
                [coords[0], coords[1]], {
                    hintContent: 'Метка с прямоугольным HTML макетом'
                }, {
                    iconLayout: squareLayout,
                    // Описываем фигуру активной области "Прямоугольник".
                    iconShape: {
                        type: 'Rectangle',
                        // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
                        coordinates: [
                            [-25, -25], [25, 25]
                        ]
                    }
                }
            );

            // var placemark = new ymaps.Placemark((coords[0], coords[1]), {draggable: 1
            // hintOptions: {
            //     maxWidth: 100,
            //     showTimeout: 200
            // },
            // balloonOptions: {
            //     maxWidth: 70,
            //     hasCloseButton: true,
            //     mapAutoPan: 0
            // }
        // });
            squarePlacemark.name = "Имя метки";
            squarePlacemark.description = "Описание метки";
            this.map.addOverlay(squarePlacemark);
            squarePlacemark.openBalloon();

        });
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
        this.map.geoObjects.add(squarePlacemark);
        this.map.geoObjects.add(this.clusterer);
        this.map.behaviors.enable('scrollZoom');
        // this.clusterer.add(geoObjects);
    }
}
const map = new Map('map');
map.init();

// class Map {
//     constructor(mapId) {
//         this.mapId = mapId;
//     }
//     async init() {
//         await this.injectScript();
//         await this.loadYMaps();
//         this.initMap();
//     }
//     injectScript() {
//         return new Promise((resolve) => {
//             const script = document.createElement('script');
//             script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
//             document.body.appendChild(script);
//             script.addEventListener('load', resolve);
//         })
//     }
//     loadYMaps() {
//         return new Promise(resolve => ymaps.ready(resolve)); // здесь появляется глобальный объекс "ymaps"
//     }
//     initMap() {
//         let placemarks = [
//                 {
//                     latitude: 59.97,
//                     longitude: 30.31,
//                     hintContent: '<div class="map__hint">ул.Литераторов д.19</div>',
//                     balloonContent: [
//                         '<div class="map__balloon">',
//                         '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
//                         'Пышечная по адресу: ул.Литераторов д.19',
//                         '</div>'
//                     ]
//                 },
//                 {
//                     latitude: 59.94,
//                     longitude: 30.25,
//                     hintContent: '<div class="map__hint">Малый пр-т В.О. д.64</div>',
//                     balloonContent: [
//                         '<div class="map__balloon">',
//                         '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
//                         'Наверняка какой-нибудь музей: Малый пр-т В.О. д.64',
//                         '</div>'
//                     ]
//                 },
//                 {
//                     latitude: 59.93,
//                     longitude: 30.34,
//                     hintContent: '<div class="map__hint">наб. реки Фрнтанки д.56</div>',
//                     balloonContent: [
//                         '<div class="map__balloon">',
//                         '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
//                         'Рандомные мужики ловят рыбу: наб. реки Фонтанки д.56',
//                         '</div>'
//                     ]
//                 }
//             ],
v
//         this.clusterer = new ymaps.Clusterer({
//             groupByCoordinates: true,
//             clusterIcons: [
//                 {
//                     href: './src/icons/cbaner_pin.png',
//                     size: [60, 60],
//                     offset: [-20, -50]
//                 }
//             ],
//             clusterIconContentLayout: null
//         })
//         this.map = new ymaps.Map(this.mapId, {
//             center: [59.94, 30.32],
//             zoom: 12,
//             controls: ['zoomControl'],
//             behaviors: ['drag']
//         });
//         this.map.events.add('click', function (e) {
//             var coords = e.get('coords');
//             var placemark = new ymaps.Placemark(new ymaps.GeoPoint(coords[0], coords[1]), {draggable: 1,
//                 hintOptions: {
//                     maxWidth: 100,
//                     showTimeout: 200,
//                     offset: new YMaps.Point(5, 5)
//                 },
//                 balloonOptions: {
//                     maxWidth: 70,
//                     hasCloseButton: false,
//                     mapAutoPan: 0
//                 }
//             });
//             placemark.name = "Имя метки";
//             placemark.description = "Описание метки";
//             this.map.addOverlay(placemark);
//             placemark.openBalloon();
//
//             if (!this.map.balloon.isOpen()) {
//                 var Balcoords = e.get('coords');
//                 this.map.balloon.open(Balcoords, {
//                     contentHeader:'Событие!',
//                     contentBody:'<p>Кто-то щелкнул по карте.</p>' +
//                         '<p>Координаты щелчка: ' + [
//                             coords[0].toPrecision(6),
//                             coords[1].toPrecision(6)
//                         ].join(', ') + '</p>',
//                     contentFooter:'<sup>Щелкните еще раз</sup>'
//                 });
//             }
//             else {
//                 this.map.balloon.close();
//             }
//         });
//         this.map.geoObjects.add(this.clusterer);
//         this.map.behaviors.enable('scrollZoom');
//         this.clusterer.add(geoObjects);
//     }
// }
// const map = new Map('map');
// map.init();



//
// let placemarks = [
//         {
//             latitude: 59.97,
//             longitude: 30.31,
//             hintContent: '<div class="map__hint">ул.Литераторов д.19</div>',
//             balloonContent: [
//                 '<div class="map__balloon">',
//                 '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
//                 'Пышечная по адресу: ул.Литераторов д.19',
//                 '</div>'
//             ]
//         },
//         {
//             latitude: 59.94,
//             longitude: 30.25,
//             hintContent: '<div class="map__hint">Малый пр-т В.О. д.64</div>',
//             balloonContent: [
//                 '<div class="map__balloon">',
//                 '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
//                 'Наверняка какой-нибудь музей: Малый пр-т В.О. д.64',
//                 '</div>'
//             ]
//         },
//         {
//             latitude: 59.93,
//             longitude: 30.34,
//             hintContent: '<div class="map__hint">наб. реки Фрнтанки д.56</div>',
//             balloonContent: [
//                 '<div class="map__balloon">',
//                 '<img class="map__img" src="./src/icons/google-map-marker.png" alt="Метка"/>',
//                 'Рандомные мужики ловят рыбу: наб. реки Фонтанки д.56',
//                 '</div>'
//             ]
//         }
//     ],
//     geoObjects = [];
//
// function init() {
//     var myMap = new ymaps.Map('map', {
//         center: [59.94, 30.32],
//         zoom: 12,
//         controls: ['zoomControl'],
//         behaviors: ['drag']
//     });
//
//     for (i = 0; i < placemarks.length; i++) {
//         geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], {
//                 hintContent: placemarks[i].hintContent,
//                 balloonContent: placemarks[i].balloonContent.join('')
//             },
//             {
//                 iconLayout: 'default#image',
//                 iconImageHref: './src/icons/google-map-marker.png',
//                 iconImageSize: [37, 55],
//                 iconImageOffset: [-23, -57]
//             });
//
//     }
//     let clusterer = new ymaps.Clusterer({
//         clusterIcons: [
//             {
//                 href: './src/icons/cbaner_pin.png',
//                 size: [60, 60],
//                 offset: [-20, -50]
//             }
//         ],
//         clusterIconContentLayout: null
//     });
//     myMap.events.add('click', function (e) {
//         var coords = e.get('coords');
//         var placemark = new ymaps.Placemark(new ymaps.GeoPoint(coords[0], coords[1]), {draggable: 1,
//             hintOptions: {
//                 maxWidth: 100,
//                 showTimeout: 200,
//                 offset: new YMaps.Point(5, 5)
//             },
//             balloonOptions: {
//                 maxWidth: 70,
//                 hasCloseButton: false,
//                 mapAutoPan: 0
//             }
//         });
//         placemark.name = "Имя метки";
//         placemark.description = "Описание метки";
//         myMap.addOverlay(placemark);
//         placemark.openBalloon();
//
//         if (!myMap.balloon.isOpen()) {
//             var coords = e.get('coords');
//             myMap.balloon.open(coords, {
//                 contentHeader:'Событие!',
//                 contentBody:'<p>Кто-то щелкнул по карте.</p>' +
//                     '<p>Координаты щелчка: ' + [
//                         coords[0].toPrecision(6),
//                         coords[1].toPrecision(6)
//                     ].join(', ') + '</p>',
//                 contentFooter:'<sup>Щелкните еще раз</sup>'
//             });
//         }
//         else {
//             myMap.balloon.close();
//         }
//     });
//     myMap.geoObjects.add(clusterer);
//     myMap.behaviors.enable('scrollZoom')
//     clusterer.add(geoObjects);
// }
