ymaps.ready(init);

let placemarks = [
        {
            latitude: 59.97,
            longitude: 30.31,
            hintContent: '<div class="map__hint">ул.Литераторов д.19</div>',
            balloonContent: [
                '<div class="map__balloon">',
                '<img class="map__burger-img" src="./src/icons/google-map-marker.png" alt="Бургер"/>',
                'Пышечная по адресу: ул.Литераторов д.19',
                '</div>'
            ]
        },
        {
            latitude: 59.94,
            longitude: 30.25,
            hintContent: '<div class="map__hint">Малый пр-т В.О. д.64</div>',
            balloonContent: [
                '<div class="map__balloon">',
                '<img class="map__burger-img" src="./src/icons/google-map-marker.png" alt="Бургер"/>',
                'Наверняка какой-нибудь музей: Малый пр-т В.О. д.64',
                '</div>'
            ]
        },
        {
            latitude: 59.93,
            longitude: 30.34,
            hintContent: '<div class="map__hint">наб. реки Фрнтанки д.56</div>',
            balloonContent: [
                '<div class="map__balloon">',
                '<img class="map__burger-img" src="./src/icons/google-map-marker.png" alt="Бургер"/>',
                'Рандомные мужики ловят рыбу: наб. реки Фонтанки д.56',
                '</div>'
            ]
        }
    ],
    geoObjects = [];

function init() {
    var myMap = new ymaps.Map('map', {
        center: [59.94, 30.32],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    for (i = 0; i < placemarks.length; i++) {
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
    let clusterer = new ymaps.Clusterer({
        clusterIcons: [
            {
                href: './src/icons/cbaner_pin.png',
                size: [60, 60],
                offset: [-20, -50]
            }
        ],
        clusterIconContentLayout: null
    });
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        var placemark = new YMaps.Placemark(new YMaps.GeoPoint(coords[0], coords[1]), {draggable: 1,
            hintOptions: {
                maxWidth: 100,
                showTimeout: 200,
                offset: new YMaps.Point(5, 5)
            },
            balloonOptions: {
                maxWidth: 70,
                hasCloseButton: false,
                mapAutoPan: 0
            }
        });
        placemark.name = "Имя метки";
        placemark.description = "Описание метки";
        myMap.addOverlay(placemark);
        placemark.openBalloon();

        // if (!myMap.balloon.isOpen()) {
        //     var coords = e.get('coords');
        //     myMap.balloon.open(coords, {
        //         contentHeader:'Событие!',
        //         contentBody:'<p>Кто-то щелкнул по карте.</p>' +
        //             '<p>Координаты щелчка: ' + [
        //                 coords[0].toPrecision(6),
        //                 coords[1].toPrecision(6)
        //             ].join(', ') + '</p>',
        //         contentFooter:'<sup>Щелкните еще раз</sup>'
        //     });
        // }
        // else {
        //     myMap.balloon.close();
        // }
    });
    myMap.geoObjects.add(clusterer);
    myMap.behaviors.enable('scrollZoom')
    clusterer.add(geoObjects);
}
