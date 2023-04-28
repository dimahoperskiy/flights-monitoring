import * as olSource from 'ol/source';

function basic() {
    return new olSource.TileJSON({
        url: 'https://api.maptiler.com/maps/basic-v2/tiles.json?key=o8lOt8l8ClLSxlUD8MkC',
        tileSize: 512,
    });
}

export default basic;
