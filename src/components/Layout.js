import { fromLonLat } from 'ol/proj';
import React, { useState } from 'react';

import Map from './map/map';
import mapConfig from './map/mapConfig.json';

const Layout = ({ children }) => {
    const [center] = useState(mapConfig.center);
    const [zoom] = useState(4);

    return (
        <div>
            <Map center={fromLonLat(center)} zoom={zoom}>
                {children}
            </Map>
        </div>
    );
};

export default Layout;
