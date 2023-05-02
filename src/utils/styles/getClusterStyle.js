import { Fill, Stroke, Style, Text } from 'ol/style.js';

import getIconStyle from './getIconStyle';

const clusterMemberStyle = (clusterMember, selectedFeature, theme) => {
    const icao = selectedFeature
        ?.getProperties()
        ?.features[0]?.getProperties()?.icao;
    return new Style({
        image: getIconStyle(
            clusterMember.getProperties().direction,
            clusterMember.getProperties().icao === icao
                ? theme.palette.hoverColor.main
                : theme.palette.text.primary
        ),
    });
};
const getClusterStyle = (feature, selectedFeature, theme) => {
    const size = feature.get('features').length;
    const originalFeature = feature.get('features')[0];
    if (size > 1) {
        return [
            new Style({
                image: getIconStyle(
                    originalFeature.getProperties().direction,
                    theme.palette.text.primary
                ),
            }),

            new Style({
                text: new Text({
                    text: size.toString(),
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
    }
    return clusterMemberStyle(originalFeature, selectedFeature, theme);
};

export default getClusterStyle;
