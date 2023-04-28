import * as olSource from 'ol/source';

function dark() {
    return new olSource.TileJSON({
        url: 'https://api.maptiler.com/maps/dataviz-dark/tiles.json?key=o8lOt8l8ClLSxlUD8MkC',
        tileSize: 512,
    });
}

export default dark;
