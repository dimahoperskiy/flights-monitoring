import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useState } from 'react';

import baseApi from '../api/api';
import MapContext from '../utils/MapContext';
import {
    FlightCard,
    FlightsFilterButton,
    FlightsFilterModal,
    PlaneCluster,
    SearchButton,
    ThemeSwitch,
    TileLayer,
} from './index';

const App = () => {
    const [flights, setFlights] = useState([]);
    const [flightsLoading, setFlightsLoading] = useState(true);
    const [cardModalOpen, setCardModalOpen] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const { isBlackTheme, setIsBlackTheme, searchedFlight } =
        useContext(MapContext);

    useEffect(() => {
        baseApi
            .get(`states/all?extended=1`)
            .then((res) => {
                setFlights(res.data.states);
                setFlightsLoading(false);
                setInterval(() => {
                    baseApi.get('states/all?extended=1').then((res2) => {
                        setFlights(res2.data.states);
                        setSelectedFlight((prevSelectedFlight) => {
                            if (!prevSelectedFlight) {
                                return null;
                            }
                            return res2.data.states.filter(
                                (el) => el[0] === prevSelectedFlight[0]
                            )[0];
                        });
                    });
                }, 5000);
            })
            .catch(() => {
                alert(
                    'Произошла ошибка при отправке запроса, попробуйте еще раз'
                );
                setFlightsLoading(false);
            });
    }, []);

    return (
        <>
            <TileLayer isBlackTheme={isBlackTheme} />
            <ThemeSwitch
                onClick={() => setIsBlackTheme(!isBlackTheme)}
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    right: 5,
                    top: '10px',
                }}
            />
            <SearchButton flights={flights} />
            {!searchedFlight && (
                <FlightsFilterButton setFilterModalOpen={setFilterModalOpen} />
            )}
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
                    setSelectedFlight={setSelectedFlight}
                    setCardModalOpen={setCardModalOpen}
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
        </>
    );
};

export default App;
