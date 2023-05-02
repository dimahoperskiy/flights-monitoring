import { Icon } from 'ol/style.js';

import planeImg from '../../assets/plane.svg';

const getIconStyle = (rotation, color) =>
    new Icon({
        anchor: [0.5, 25],
        rotation: rotation,
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: planeImg,
        color: color,
        width: 24,
        height: 24,
    });

export default getIconStyle;
