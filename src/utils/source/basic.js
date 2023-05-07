import * as olSource from 'ol/source';

function basic() {
    return new olSource.TileJSON({
        url: `https://api.maptiler.com/maps/basic-v2/tiles.json?key=${process.env.REACT_APP_MAPTILER_KEY}`,
        tileSize: 512,
    });
}

export default basic;
