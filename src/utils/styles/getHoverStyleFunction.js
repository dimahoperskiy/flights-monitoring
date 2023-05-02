import { Fill, Stroke, Style, Text } from 'ol/style.js';

import getIconStyle from './getIconStyle';

const getHoverStyleFunction = (
    feature,
    selectedFeature,
    setSelectedFeature,
    theme
) => {
    let style;
    document.body.style.cursor = 'pointer';

    if (feature.getProperties().features.length > 1) {
        style = [
            new Style({
                image: getIconStyle(
                    feature.getProperties().features[0].getProperties()
                        .direction,
                    theme.palette.text.primary
                ),
            }),
            new Style({
                text: new Text({
                    text: feature.getProperties().features.length.toString(),
                    fill: new Fill({
                        color: '#fff',
                    }),
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.6)',
                        width: 3,
                    }),
                }),
            }),
        ];
    } else {
        style = new Style({
            image: getIconStyle(
                feature.getProperties().features[0].getProperties().direction,
                theme.palette.hoverColor.main
            ),
        });
    }
    return style;
};

export default getHoverStyleFunction;
