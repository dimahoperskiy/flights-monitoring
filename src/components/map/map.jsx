import './styles.css';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as ol from 'ol';
import { defaults as defaultInteractions, Select } from 'ol/interaction.js';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import planeImg from '../../assets/plane.svg';
import MapContext from './MapContext';

const selectStyleFunction = (
    feature,
    selectedFeature,
    setSelectedFeature,
    theme
) => {
    // setSelectedFeature(feature);
    let style;
    document.body.style.cursor = 'pointer';

    if (feature.getProperties().features.length > 1) {
        style = [
            new Style({
                image: new Icon({
                    anchor: [0.5, 25],
                    rotation: feature
                        .getProperties()
                        .features[0].getProperties().direction,
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: planeImg,
                    color: theme.palette.text.primary,
                    width: 24,
                    height: 24,
                }),
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
            image: new Icon({
                anchor: [0.5, 20],
                rotation: feature.getProperties().features[0].getProperties()
                    .direction,
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: planeImg,
                color: theme.palette.hoverColor.main,
                width: 24,
                height: 24,
            }),
        });
    }
    return style;
};

const Map = ({ children, zoom, center }) => {
    const mapRef = useRef();
    const [map, setMap] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [modalClosed, setModalClosed] = useState(true);
    const [isBlackTheme, setIsBlackTheme] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState(null);
    const [inAir, setInAir] = React.useState(null);
    const [aircraftType, setAircraftType] = React.useState(null);

    const { palette } = createTheme();
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    hoverColor: palette.augmentColor({
                        color: {
                            main: isBlackTheme ? '#00b4ff' : '#ff8500',
                        },
                    }),
                    background: {
                        default: isBlackTheme ? '#121212' : '#ededed',
                    },
                    mode: isBlackTheme ? 'dark' : 'light',
                },
            }),
        [isBlackTheme]
    );

    const interaction = new Select({
        condition: function (evt) {
            return evt.type == 'pointermove' || evt.type == 'singleclick';
        },
        style: (f) =>
            selectStyleFunction(
                f,
                selectedFeature,
                setSelectedFeature,
                theme,
                isBlackTheme
            ),
    });

    // on component mount
    useEffect(() => {
        let view;
        if (map?.getView()) {
            view = new ol.View({
                zoom: map?.getView().getZoom(),
                center: map?.getView().getCenter(),
            });
        } else {
            view = new ol.View({ zoom, center });
        }
        let options = {
            view,
            layers: [],
            controls: [],
            overlays: [],
            interactions: defaultInteractions().extend([interaction]),
        };
        let mapObject = new ol.Map(options);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);

        return () => mapObject.setTarget(undefined);
    }, [isBlackTheme]);
    // zoom change handler
    useEffect(() => {
        console.log('zoomed');
        if (!map) return;
        map.getView().setZoom(zoom);
    }, [zoom]);
    // center change handler
    useEffect(() => {
        if (!map) return;
        map.getView().setCenter(center);
    }, [center]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MapContext.Provider
                value={{
                    map,
                    selectedFeature,
                    setSelectedFeature,
                    interaction,
                    modalClosed,
                    setModalClosed,
                    isBlackTheme,
                    setIsBlackTheme,
                    selectedCountry,
                    setSelectedCountry,
                    inAir,
                    setInAir,
                    aircraftType,
                    setAircraftType,
                }}
            >
                <div ref={mapRef} className="ol-map">
                    {children}
                </div>
            </MapContext.Provider>
        </ThemeProvider>
    );
};
export default Map;
