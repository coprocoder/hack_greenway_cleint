import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import { ThreeSixtySharp } from '@material-ui/icons';

mapboxgl.accessToken = 'pk.eyJ1IjoibnpheWNldiIsImEiOiJjazhudXZnaGMwMmIzM2RvM2N3MDl2dmNwIn0.cNCktRFle2xX3PsaB-l0MQ';

class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lng: 37.61719,
            lat: 55.75224,
            zoom: 9
        };
        this.points = []
        this.mapContainer = React.createRef();
    }

    componentDidMount() {

        const { lng, lat, zoom } = this.state;
        this.map = new mapboxgl.Map({
            container: this.mapContainer.current,
            // style: 'mapbox://styles/nzaycev/cksl9h0iu09fy18pg7yeljl4q',
            style: 'mapbox://styles/nzaycev/cku013wd22hdk17mof1lwol42',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: [
                [35.2, 54.6],
                [39.0, 56.2], 
            ]
        });

        this.map.on('move', () => {
            this.setState({
                lng: this.map.getCenter().lng.toFixed(4),
                lat: this.map.getCenter().lat.toFixed(4),
                zoom: this.map.getZoom().toFixed(2)
            });
        });

        this.map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        );

        this.map.on('load', () => {
            // console.log('features', this.props.points_geoJson)

            this.addSources()
            this.addDetectorLayer()
            this.addRouteLayer()
            this.addHeatMapLayer()

            // Координаты
            // this.map.on('mousemove', (e) => {
            //     document.getElementById('map-coordinates').innerHTML =
            //         e.lngLat.lng.toFixed(4) + ' ' + e.lngLat.lat.toFixed(4);
            // });
        })

        // === Маркеры на поинтах === 
        let areaPopup
        this.map.on('mouseenter', 'detector_points', (e) => {
            // console.log('mouseenter', e.features)
            let value = `<li>Value: ${e.features[0].properties.value}</li>` 

            if (!!areaPopup == true)
                areaPopup.remove()
            areaPopup = new mapboxgl.Popup({
                closeOnClick: false,
                closeButton: false
            })
                .setLngLat(e.lngLat)
                .setHTML(`<ul>${value}</ul>`)
                .addTo(this.map);
        })
        this.map.on('mouseleave', 'detector_points', (e) => {
            if (!!areaPopup == true)
                areaPopup.remove()
        })
    }

    componentDidUpdate(props, old) {

        console.log('======map update', this.props, props)
        this.props.onUpdateMap(this.state)
        this.map.getSource('route_path')
            &&this.map.getSource('route_path').setData(this.props.route_geoJson?this.props.route_geoJson.route : { "type": "FeatureCollection", "features": [] })
        if(this.props.route_geoJson) {
            let route = this.props.route_geoJson.route
            

            let path_len = route.features[0].geometry.coordinates.length
            let start = route.features[0].geometry.coordinates[0]
            let end = route.features[0].geometry.coordinates[path_len - 1]
            console.log('beg end', start, end)
            
            // const marker_start = new mapboxgl.Marker({
            //     color: "#green",
            //     draggable: false
            //     }).setLngLat(start)
            //     .addTo(this.map);

            // const marker_end = new mapboxgl.Marker({
            //     color: "#red",
            //     draggable: false
            //     }).setLngLat(end)
            //     .addTo(this.map);
        }
    }


    addSources(){
        // console.log('addSources', this.map)
        // Датчики на карте
        this.map.addSource('detector_points', {
            type: 'geojson',
            data: this.props.points_geoJson
        })

        // Маршрут на карте
        this.map.addSource('route_path', {
            type: 'geojson',
            data: this.props.route_geoJson ? 
                this.props.route_geoJson.route :  // Путь
                { "type": "FeatureCollection", "features": [] } // Заглушка
        })
        return this.map
    }
    addRouteLayer(){
        // console.log('addRouteLayer', this.map)
        this.map.addLayer({
            id: 'route_path',
            type: 'line',
            source: 'route_path',
            paint: {
                // 'line-color': '#6f66a6',
                'line-color': '#06450B',
                'line-width': 4
            }
        })
    }
    addDetectorLayer(){
        // console.log('addDetectorLayer', this.map)
        this.map.addLayer({
            id: 'detector_points',
            type: 'circle',
            source: 'detector_points',
            minzoom: 15,
            paint: {
                'circle-radius': 4,
                'circle-color': '#6f66a6'
                // 'circle-color': [
                //     "case",
                //     ['==', ['get', "value"], true], "#33FFB0",
                //     ['==', ['get', "value"], false], "#FC8C7F",
                //     '#6f66a6'
                // ],
  
            }
        })
    }
    addHeatMapLayer(){
        // console.log('addHeatMapLayer', this.map)
        this.map.addLayer({
            'id': 'detector_heat',
            'type': 'heatmap',
            'source': 'detector_points',
            'maxzoom': 15,
            'paint': {
                // Increase the heatmap weight based on frequency and property magnitude
                'heatmap-weight': {
                    property: 'value',
                    type: 'exponential',
                    stops: [
                      [0, 0],
                      [1, 1]
                    ]
                },

                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': {
                    stops: [
                      [9, 1],
                      [15, 3]
                    ]
                },

                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                'heatmap-color': [
                    'interpolate',
                    ['linear'], ['heatmap-density'],
                    0,      'rgba(0,255,0,0)',
                    0.1,    'rgba(0,255,0,0.8)',
                    0.5,    'rgb(255,255,0)',
                    1,      'rgb(255,0,0)'
                ],

                // Adjust the heatmap radius by zoom level
                'heatmap-radius': {
                    stops: [
                      [9, 15],
                      [15, 100],
                    ]
                  },

                // Transition from heatmap to circle layer by zoom level
                'heatmap-opacity': {
                    default: 1,
                    stops: [
                      [9, 1],
                      [16, 0]
                    ]
                },
            }
        },'waterway-label');

        this.map.addLayer({
            'id': 'detector_circle',
            'type': 'circle',
            'source': 'detector_points',
            'minzoom': 15,
            'paint': {
                // Size circle radius by earthquake magnitude and zoom level
                'circle-radius': {
                    property: 'value',
                    type: 'exponential',
                    stops: [
                        [{ zoom: 9, value: 0 }, 5],
                        [{ zoom: 9, value: 1 }, 10],
                        [{ zoom: 15, value: 0 }, 20],
                        [{ zoom: 15, value: 1 }, 50]
                    ]
                },

                // Color circle 
                'circle-color': {
                    property: 'value',
                    type: 'exponential',
                    stops: [
                      [0, 'green'],
                      [0.5, 'yellow'],
                      [1, 'red']
                    ]
                },

                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                  stops: [
                    [15, 0.2],
                    [22, 1]
                  ]
                }
            }
        }, 'waterway-label');
    }

    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <div className="map-overlay">
                {/* <div id="map-coordinates" /> */}
                {this.props.route_geoJson ? 
                    <div className="map-route-info">
                        <div>{(this.props.route_geoJson.distance/1000).toFixed(2)} км.</div>
                        <div>{(this.props.route_geoJson.time/1000/60).toFixed(2)} мин.</div>
                    </div>
                : null}
                <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                

                <div ref={this.mapContainer} className="map-container" />
            </div>
        );
    }

}

export default Map