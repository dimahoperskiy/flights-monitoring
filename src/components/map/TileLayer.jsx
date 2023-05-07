import OLTileLayer from 'ol/layer/Tile';
import { useContext, useEffect } from 'react';

import MapContext from '../../utils/MapContext';
import { basic, dark } from '../../utils/source';

const TileLayer = ({ isBlackTheme }) => {
    const { map } = useContext(MapContext);
    const zIndex = 0;
    useEffect(() => {
        if (!map) return;
        const source = isBlackTheme ? dark() : basic();

        let tileLayer = new OLTileLayer({
            source,
            zIndex,
        });

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
