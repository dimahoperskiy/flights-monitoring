import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useState } from 'react';

import baseApi from '../api/api';
import MapContext from '../utils/MapContext';
import { basic } from '../utils/source';
import {
    FlightCard,
    FlightsFilterButton,
    FlightsFilterModal,
    Layers,
    PlaneCluster,
    ThemeSwitch,
    TileLayer,
} from './index';

const App = () => {
    const [flights, setFlights] = useState([]);
    const [flightsFuture, setFlightsFuture] = useState([]);
    const [flightsLoading, setFlightsLoading] = useState(true);
    const [cardModalOpen, setCardModalOpen] = React.useState(false);
    const [filterModalOpen, setFilterModalOpen] = React.useState(false);
    const [selectedFlight, setSelectedFlight] = React.useState(null);
    const [, setMapZoom] = React.useState(0);
    // const [intervalId, setIntervalId] = React.useState(0);

    const { isBlackTheme, setIsBlackTheme } = useContext(MapContext);

    useEffect(() => {
        // const unixTimestamp = Math.floor(new Date().getTime() / 1000);

        // baseApi.get(`states/all?time=${unixTimestamp - 10}`).then((res) => {
        baseApi.get(`states/all?extended=1`).then((res) => {
            setFlights(res.data.states);
            baseApi.get('states/all?extended=1').then((res2) => {
                setFlightsFuture(res2.data.states);
                setFlightsLoading(false);

                setInterval(() => {
                    baseApi.get('states/all?extended=1').then((res3) => {
                        setFlightsFuture((prevFlightsFuture) => {
                            setFlights(prevFlightsFuture);
                            setSelectedFlight((prevSelectedFlight) => {
                                if (!prevSelectedFlight) {
                                    return null;
                                }
                                return prevFlightsFuture.filter(
                                    (el) => el[0] === prevSelectedFlight[0]
                                )[0];
                            });
                        });
                        setFlightsFuture(res3.data.states);
                    });
                }, 100000);
            });
        });
    }, []);

    // useEffect(() => {
    //     clearInterval(intervalId);
    //     if (!flightsLoading && mapZoom > 6) {
    //         const interval = setInterval(() => {
    //             // console.log('int');
    //             const newFlights = flights.map((el) => {
    //                 const currentFuture = flightsFuture.find(
    //                     (fut) => fut[0] === el[0]
    //                 );
    //                 if (currentFuture) {
    //                     const futureLongitude = currentFuture[5];
    //                     const futureLatitude = currentFuture[6];
    //                     const lonDif = (futureLongitude - el[5]) / 10;
    //                     const latDif = (futureLatitude - el[6]) / 10;
    //                     // if (currentFuture[0] === 'a53eef') {
    //                     //     console.log('dif', lonDif, latDif);
    //                     // }
    //                     // console.log('dif', lonDif, latDif);
    //                     // console.log('difDiv', lonDif / 10, latDif / 10);
    //                     let lonNew = el[5] + lonDif;
    //                     let latNew = el[6] + latDif;
    //                     el[5] = lonNew;
    //                     el[6] = latNew;
    //                 }
    //                 return el;
    //             });
    //             setFlights(newFlights);
    //         }, 1000);
    //         setIntervalId(interval);
    //
    //         setTimeout(() => {
    //             clearInterval(interval);
    //         }, 9000);
    //     }
    // }, [flightsFuture, mapZoom]);

    return (
        <>
            <Layers>
                <TileLayer
                    source={basic()}
                    zIndex={0}
                    isBlackTheme={isBlackTheme}
                />
                <ThemeSwitch
                    onClick={() => setIsBlackTheme(!isBlackTheme)}
                    sx={{
                        position: 'absolute',
                        zIndex: 1,
                        right: 5,
                        top: '10px',
                    }}
                />
                <FlightsFilterButton setFilterModalOpen={setFilterModalOpen} />
                {flightsLoading && (
                    <CircularProgress
                        sx={{
                            zIndex: 1,
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            margin: 'auto',
                        }}
                    />
                )}
                {!flightsLoading && (
                    <PlaneCluster
                        flights={flights}
                        flightsFuture={flightsFuture}
                        setSelectedFlight={setSelectedFlight}
                        setCardModalOpen={setCardModalOpen}
                        setMapZoom={setMapZoom}
                        flightsLoading={flightsLoading}
                        isBlackTheme={isBlackTheme}
                    />
                )}
                {!flightsLoading && selectedFlight !== null && (
                    <FlightCard
                        cardModalOpen={cardModalOpen}
                        setCardModalOpen={setCardModalOpen}
                        selectedFlight={selectedFlight}
                        setSelectedFlight={setSelectedFlight}
                    />
                )}
                {filterModalOpen && (
                    <FlightsFilterModal
                        filterModalOpen={filterModalOpen}
                        setFilterModalOpen={setFilterModalOpen}
                    />
                )}
            </Layers>
        </>
    );
};

export default App;
