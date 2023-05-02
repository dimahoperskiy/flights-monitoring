import { fromLonLat } from 'ol/proj';
import React from 'react';

import Map from '../map/Map';

const Layout = ({ children }) => {
    const center = [37.621218, 55.752811];
    const zoom = 4;

    return (
        <div>
            <Map center={fromLonLat(center)} zoom={zoom}>
                {children}
            </Map>
        </div>
    );
};

export default Layout;
