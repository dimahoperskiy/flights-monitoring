import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Vector as OLVectorLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';
import VectorSource from 'ol/source/Vector.js';
import { Icon, Style } from 'ol/style.js';
import { useContext, useEffect } from 'react';

import MapContext from '../MapContext';
import planeImg from './plane.png';

const PlaneLayer = ({ longitude, latitude, direction, zIndex = 0 }) => {
    const { map } = useContext(MapContext);

    const directionInRadians = direction * (Math.PI / 180);

    useEffect(() => {
        if (!map) return;
        const iconFeature = new Feature({
            geometry: new Point(fromLonLat([longitude, latitude])),
            name: 'Null Island',
            population: 4000,
            rainfall: 500,
        });

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 20],
                rotation: directionInRadians,
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: planeImg,
            }),
        });

        iconFeature.setStyle(iconStyle);

        const vectorSource = new VectorSource({
            features: [iconFeature],
        });
        const vectorLayer = new OLVectorLayer({
            source: vectorSource,
        });
        map.addLayer(vectorLayer);
        vectorLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        };
    }, [map]);
    return null;
};
export default PlaneLayer;
