import './styles.css';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Map as OLMap, View } from 'ol';
import { pointerMove } from 'ol/events/condition.js';
import { defaults as defaultInteractions, Select } from 'ol/interaction.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import MapContext from '../../utils/MapContext';
import getHoverStyleFunction from '../../utils/styles/getHoverStyleFunction';

const Map = ({ children, zoom, center }) => {
    const mapRef = useRef();
    const [map, setMap] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [cardModalClosed, setCardModalClosed] = useState(true);
    const [isBlackTheme, setIsBlackTheme] = useState(false);
    // filters
    const [searchedFlight, setSearchedFlight] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [inAir, setInAir] = useState(null);
    const [aircraftType, setAircraftType] = useState(null);

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

    map?.on('pointermove', function (evt) {
        const feature = map.forEachFeatureAtPixel(
            evt.pixel,
            function (feature) {
                return feature;
            }
        );
        if (feature === undefined) {
            document.body.style.cursor = '';
            setSelectedFeature(null);
        }
    });

    const interaction = new Select({
        condition: pointerMove,
        style: (f) =>
            getHoverStyleFunction(
                f,
                selectedFeature,
                setSelectedFeature,
                theme
            ),
    });

    useEffect(() => {
        let view;
        if (map?.getView()) {
            view = new View({
                zoom: map?.getView().getZoom(),
                center: map?.getView().getCenter(),
            });
        } else {
            view = new View({ zoom, center });
        }
        let options = {
            view,
            layers: [],
            controls: [],
            overlays: [],
            interactions: defaultInteractions().extend([interaction]),
        };
        let mapObject = new OLMap(options);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);

        return () => mapObject.setTarget(undefined);
    }, [isBlackTheme]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MapContext.Provider
                value={{
                    map,
                    selectedFeature,
                    setSelectedFeature,
                    interaction,
                    cardModalClosed,
                    setCardModalClosed,
                    isBlackTheme,
                    setIsBlackTheme,
                    selectedCountry,
                    setSelectedCountry,
                    inAir,
                    setInAir,
                    aircraftType,
                    setAircraftType,
                    searchedFlight,
                    setSearchedFlight,
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
