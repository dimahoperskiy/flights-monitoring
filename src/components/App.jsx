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
    const [flightsLoading, setFlightsLoading] = useState(true);
    const [cardModalOpen, setCardModalOpen] = React.useState(false);
    const [filterModalOpen, setFilterModalOpen] = React.useState(false);
    const [selectedFlight, setSelectedFlight] = React.useState(null);
    const { isBlackTheme, setIsBlackTheme } = useContext(MapContext);

    useEffect(() => {
        baseApi.get(`states/all?extended=1`).then((res) => {
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
            }, 100000);
        });
    }, []);

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
            </Layers>
        </>
    );
};

export default App;
