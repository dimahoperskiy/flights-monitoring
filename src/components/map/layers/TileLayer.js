import OLTileLayer from 'ol/layer/Tile';
import { useContext, useEffect } from 'react';

import MapContext from '../../../utils/MapContext';
import { dark } from '../../../utils/source';

const TileLayer = ({ source, zIndex = 0, isBlackTheme }) => {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;

        let tileLayer = new OLTileLayer({
            source,
            zIndex,
        });

        if (isBlackTheme) {
            tileLayer.setSource(dark());
        }

        map.addLayer(tileLayer);
        tileLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(tileLayer);
            }
        };
    }, [map, isBlackTheme]);
    return null;
};
export default TileLayer;
