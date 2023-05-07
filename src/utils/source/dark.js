import * as olSource from 'ol/source';

function dark() {
    return new olSource.TileJSON({
        url: `https://api.maptiler.com/maps/dataviz-dark/tiles.json?key=${process.env.REACT_APP_MAPTILER_KEY}`,
        tileSize: 512,
    });
}

export default dark;
