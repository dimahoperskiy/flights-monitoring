import { useTheme } from '@mui/material/styles';
import { createEmpty, extend } from 'ol/extent.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';
import { Cluster, Vector as VectorSource } from 'ol/source.js';
import { Style } from 'ol/style.js';
import { useContext, useEffect } from 'react';

import { countriesList } from '../../utils/countriesList';
import MapContext from '../../utils/MapContext';
import getClusterStyle from '../../utils/styles/getClusterStyle';
import getIconStyle from '../../utils/styles/getIconStyle';

const PlaneCluster = ({
    flights,
    setSelectedFlight,
    setCardModalOpen,
    isBlackTheme,
}) => {
    const {
        map,
        selectedFeature,
        setSelectedFeature,
        cardModalClosed,
        setCardModalClosed,
        selectedCountry,
        setSelectedCountry,
        inAir,
        setInAir,
        aircraftType,
        setAircraftType,
        searchedFlight,
    } = useContext(MapContext);
    const theme = useTheme();

    map.on('click', async (evt) => {
        document.body.style.cursor = '';
        const feature = map.forEachFeatureAtPixel(
            evt.pixel,
            function (feature) {
                return feature;
            }
        );
        if (feature?.getProperties()?.features?.length === 1) {
            const { icao, longitude, latitude } =
                feature?.getProperties()?.features[0]?.getProperties() || {};
            setTimeout(() => {
                map.getView().animate(
                    {
                        center: fromLonLat([longitude, latitude]),
                    },
                    (completed) => {
                        setCardModalClosed(completed);
                        setTimeout(() => {
                            document.body.style.cursor = 'auto';
                        }, 50);
                    }
                );
                setSelectedFlight(flights.filter((el) => el[0] === icao)[0]);
                setCardModalOpen(true);
                setSelectedFeature(feature);
            }, 0);
        } else if (!feature?.getProperties()?.features) {
            return false;
        } else {
            const view = map.getView();
            const clusterMembers = feature?.getProperties()?.features;
            const extent = createEmpty();
            clusterMembers.forEach((feature) =>
                extend(extent, feature.getGeometry().getExtent())
            );
            view.fit(extent, {
                duration: 500,
                padding: [500, 500, 500, 500],
                maxZoom: 15,
            });
        }
    });

    useEffect(() => {
        if (!map) return;

        let flightsFiltered = flights;

        if (searchedFlight) {
            setSelectedCountry(null);
            setAircraftType(null);
            setInAir(null);
            flightsFiltered = [searchedFlight];
        } else {
            if (selectedCountry) {
                const countryCode = selectedCountry.code;
                const countryName = countriesList.find(
                    (el) => el.code === countryCode
                ).name;
                flightsFiltered = flightsFiltered.filter(
                    (el) => el[2] === countryName
                );
            }

            if (aircraftType !== null) {
                flightsFiltered = flightsFiltered.filter(
                    (el) => el[17] === aircraftType.id
                );
            }

            if (inAir === true) {
                flightsFiltered = flightsFiltered.filter((el) => !el[8]);
            } else if (inAir === false) {
                flightsFiltered = flightsFiltered.filter((el) => el[8]);
            }
        }

        const features = flightsFiltered.map((el) => {
            /* eslint-disable no-unused-vars */
            const [
                icao24,
                callsign,
                origin_country,
                time_position,
                last_contact,
                longitude,
                latitude,
                baro_altitude,
                on_ground,
                velocity,
                true_track,
                vertical_rate,
            ] = el;
            /* eslint-enable no-unused-vars */

            const directionInRadians = true_track * (Math.PI / 180);

            return new Feature({
                geometry: new Point(fromLonLat([longitude, latitude])),
                style: new Style({
                    image: getIconStyle(
                        directionInRadians,
                        theme.palette.text.primary
                    ),
                }),
                direction: directionInRadians,
                icao: icao24,
                longitude,
                latitude,
            });
        });
        const distanceInput = 20;
        const minDistanceInput = 20;
        const source = new VectorSource({
            features: features,
        });

        const clusterSource = new Cluster({
            distance: distanceInput,
            minDistance: minDistanceInput,
            source: source,
        });

        const clusters = new VectorLayer({
            source: clusterSource,
            style: (feature) => {
                return getClusterStyle(feature, selectedFeature, theme);
            },
        });

        map.addLayer(clusters);
        clusters.setZIndex(0);
        return () => {
            if (map) {
                map.removeLayer(clusters);
            }
        };
    }, [
        map,
        flights,
        cardModalClosed,
        isBlackTheme,
        selectedCountry,
        inAir,
        aircraftType,
        searchedFlight,
    ]);
    return null;
};
export default PlaneCluster;
