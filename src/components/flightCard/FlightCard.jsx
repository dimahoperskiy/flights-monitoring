import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HeightIcon from '@mui/icons-material/Height';
import RoundaboutRightIcon from '@mui/icons-material/RoundaboutRight';
import SpeedIcon from '@mui/icons-material/Speed';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

import aeroApi from '../../api/aeroApi';
import aircraftTypes from '../../utils/aircraftTypes';
import { countriesList } from '../../utils/countriesList';
import MapContext from '../../utils/MapContext';

const currentFlightMock = {
    number: 'BA 180',
    airline: {
        name: 'British Airways',
    },
    aircraft: {
        model: 'Boeing 787-10',
    },
    departure: {
        airport: {
            iata: 'CPH',
            municipalityName: 'Copenhagen',
            location: {
                lat: 55.6179,
                lon: 12.656,
            },
            countryCode: 'DK',
        },
        scheduledTimeLocal: '2023-04-17 07:55-04:00',
        actualTimeLocal: '2023-04-17 08:09-04:00',
    },
    arrival: {
        airport: {
            iata: 'LAX',
            municipalityName: 'Los Angeles',
            location: {
                lat: 33.9425,
                lon: -118.408,
            },
            countryCode: 'US',
        },
        scheduledTimeLocal: '2023-04-17 19:50+01:00',
        actualTimeLocal: '2023-04-17 19:18+01:00',
    },
};

const InfoCard = styled(Card)({
    minWidth: 275,
    marginTop: '15px',
    display: 'flex',
    background: 'inherit',
    boxShadow: 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
});

const AirportInfo = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '30%',
});

const PlaneSvgOrange = (
    <svg
        style={{
            transform: 'rotate(90deg)',
            border: '1px solid white',
            borderRadius: '50%',
            backgroundColor: 'white',
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
    >
        <path d="M20.36 18" />
        <path
            fill="#ff8500"
            d="M42 32v-4l-16-10v-11c0-1.66-1.34-3-3-3s-3 1.34-3 3v11l-16 10v4l16-5v11l-4 3v3l7-2 7 2v-3l-4-3v-11l16 5z"
        />
        <path d="M0 0h48v48h-48z" fill="none" />
    </svg>
);

const PlaneSvgBlue = (
    <svg
        style={{
            transform: 'rotate(90deg)',
            border: '1px solid white',
            borderRadius: '50%',
            backgroundColor: 'white',
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
    >
        <path d="M20.36 18" />
        <path
            fill="#00b4ff"
            d="M42 32v-4l-16-10v-11c0-1.66-1.34-3-3-3s-3 1.34-3 3v11l-16 10v4l16-5v11l-4 3v3l7-2 7 2v-3l-4-3v-11l16 5z"
        />
        <path d="M0 0h48v48h-48z" fill="none" />
    </svg>
);

const VerticalLine = styled('div')({
    width: '2px',
    height: '50px',
    backgroundColor: 'black',
});

const InfoRow = styled('div')({
    display: 'flex',
    marginTop: '15px',
    alignItems: 'center',
});

const FlightCard = ({
    cardModalOpen,
    setCardModalOpen,
    selectedFlight,
    setSelectedFlight,
}) => {
    const theme = useTheme();
    const { setSelectedFeature, setCardModalClosed, isBlackTheme } =
        useContext(MapContext);
    const [currentFlight, setCurrentFlight] = useState(undefined);
    const [flightLoading, setFlightLoading] = useState(true);

    const handleClose = () => {
        setSelectedFeature(null);
        setCardModalOpen(false);
        setCardModalClosed(true);
        setSelectedFlight(null);
        setCurrentFlight(undefined);
    };

    if (!selectedFlight) {
        handleClose();
    }

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
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source,
        category,
    ] = selectedFlight;
    /* eslint-enable no-unused-vars */

    useEffect(() => {
        const TESTING = true;
        if (icao24) {
            if (TESTING) {
                const fetchData = new Promise((resolve) =>
                    resolve(currentFlightMock)
                );

                fetchData.then((res) => {
                    setCurrentFlight(res);
                });
                setFlightLoading(false);

                setCurrentFlight(currentFlightMock);
            } else {
                aeroApi
                    .get(icao24)
                    .then((res) => {
                        let currentFlightVariable;
                        if (res.data.length > 1) {
                            currentFlightVariable = res.data.find(
                                (el) => el.callSign?.trim() === callsign.trim()
                            );
                            if (currentFlightVariable === undefined) {
                                currentFlightVariable = res.data.find(
                                    (el) => el.status === 'EnRoute'
                                );
                            }
                        } else {
                            currentFlightVariable = res.data[0];
                        }
                        setCurrentFlight(currentFlightVariable);
                        setFlightLoading(false);
                    })
                    .catch(() => {
                        alert(
                            'Произошла ошибка при отправке запроса, попробуйте еще раз'
                        );
                    });
            }
        }
    }, [icao24]);

    const countryCode = countriesList.find(
        (el) => el.name === origin_country
    )?.code;

    const getFormattedTime = (time) => {
        if (!time) {
            return ' ???';
        }
        const hours = new Date(time).getHours();
        const minutes = new Date(time).getMinutes();
        let minutesFormatted = minutes;
        if (String(minutes).length === 1) {
            minutesFormatted = '0' + String(minutes);
        }
        return ` ${hours}:${minutesFormatted}`;
    };

    return (
        <Dialog
            PaperProps={{
                sx: {
                    position: 'absolute',
                    right: '-20px',
                    height: '80%',
                    maxWidth: '400px',
                    padding: '0',
                    backgroundColor: theme.palette.background.default,
                },
            }}
            maxWidth="xs"
            fullWidth
            open={cardModalOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {flightLoading ? (
                <CircularProgress
                    style={{ color: theme.palette.hoverColor.main }}
                    sx={{
                        position: 'absolute',
                        left: '45%',
                        top: '45%',
                    }}
                />
            ) : (
                <>
                    <DialogTitle
                        id="alert-dialog-title"
                        sx={{ backgroundColor: theme.palette.hoverColor.main }}
                    >
                        {currentFlight?.number} / {callsign} / {icao24}
                    </DialogTitle>
                    <DialogContent sx={{ padding: '0 24px' }}>
                        <InfoCard>
                            <div style={{ width: '47%' }}>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Авиакомпания
                                </Typography>
                                <Typography
                                    sx={{ fontSize: 14 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {currentFlight?.airline?.name}
                                </Typography>
                            </div>
                            <VerticalLine />
                            <div style={{ width: '47%' }}>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Модель самолета
                                </Typography>
                                <Typography
                                    sx={{ fontSize: 14 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {currentFlight?.aircraft?.model}
                                </Typography>
                            </div>
                        </InfoCard>
                        <DialogContentText
                            id="alert-dialog-description"
                            sx={{
                                mt: '15px',
                                textAlign: 'center',
                                pb: '10px',
                            }}
                        >
                            Страна регистрации:
                            <ReactCountryFlag
                                countryCode={countryCode}
                                svg
                                style={{
                                    width: '2em',
                                    height: '2em',
                                    marginLeft: '15px',
                                }}
                                title={origin_country}
                            />
                        </DialogContentText>
                        <DialogContentText
                            id="alert-dialog-description"
                            sx={{
                                borderBottom:
                                    '1px solid' + theme.palette.hoverColor.main,
                                textAlign: 'center',
                                pb: '10px',
                            }}
                        >
                            Тип самолета: {aircraftTypes[category]}
                        </DialogContentText>
                        <InfoCard sx={{ justifyContent: 'space-around' }}>
                            <AirportInfo>
                                <Typography
                                    sx={{ fontSize: 32 }}
                                    color="text.secondary"
                                >
                                    {currentFlight?.departure?.airport?.iata}
                                </Typography>
                                <ReactCountryFlag
                                    countryCode={
                                        currentFlight?.departure?.airport
                                            ?.countryCode
                                    }
                                    svg
                                    style={{
                                        width: '2em',
                                        height: '2em',
                                        alignSelf: 'center',
                                    }}
                                    title={
                                        currentFlight?.departure?.airport
                                            ?.countryCode
                                    }
                                />
                                <Typography
                                    sx={{ fontSize: 14 }}
                                    color="text.secondary"
                                >
                                    {
                                        currentFlight?.departure?.airport
                                            ?.municipalityName
                                    }
                                </Typography>
                            </AirportInfo>
                            <div>
                                {isBlackTheme ? PlaneSvgBlue : PlaneSvgOrange}
                            </div>
                            <AirportInfo>
                                <Typography
                                    sx={{ fontSize: 32 }}
                                    color="text.secondary"
                                >
                                    {currentFlight?.arrival?.airport?.iata}
                                </Typography>
                                <ReactCountryFlag
                                    countryCode={
                                        currentFlight?.arrival?.airport
                                            ?.countryCode
                                    }
                                    svg
                                    style={{
                                        width: '2em',
                                        height: '2em',
                                        alignSelf: 'center',
                                    }}
                                    title={
                                        currentFlight?.arrival?.airport
                                            ?.countryCode
                                    }
                                />
                                <Typography
                                    sx={{ fontSize: 14 }}
                                    color="text.secondary"
                                >
                                    {
                                        currentFlight?.arrival?.airport
                                            ?.municipalityName
                                    }
                                </Typography>
                            </AirportInfo>
                        </InfoCard>
                        <InfoCard
                            sx={{
                                borderBottom:
                                    '1px solid' + theme.palette.hoverColor.main,
                                pb: '10px',
                                borderRadius: 0,
                            }}
                        >
                            <div style={{ width: '47%' }}>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Время вылета
                                </Typography>
                                <Typography
                                    sx={{ fontSize: 14, textAlign: 'start' }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Плановове:
                                    {getFormattedTime(
                                        currentFlight?.departure
                                            ?.scheduledTimeLocal
                                    )}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: 14, textAlign: 'start' }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Фактическое:
                                    {getFormattedTime(
                                        currentFlight?.departure
                                            ?.actualTimeLocal
                                    )}
                                </Typography>
                            </div>
                            <VerticalLine sx={{ height: '70px' }} />
                            <div style={{ width: '47%' }}>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Время прилета
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        textAlign: 'start',
                                        ml: '5px',
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Плановое:
                                    {getFormattedTime(
                                        currentFlight?.arrival
                                            ?.scheduledTimeLocal
                                    )}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        textAlign: 'start',
                                        ml: '5px',
                                    }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Фактическое:
                                    {getFormattedTime(
                                        currentFlight?.arrival?.actualTimeLocal
                                    )}
                                </Typography>
                            </div>
                        </InfoCard>
                        <InfoRow>
                            <FlightTakeoffIcon
                                sx={{
                                    mr: '15px',
                                    color: theme.palette.hoverColor.main,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    margin: '0',
                                    width: '136px',
                                }}
                                color="text.secondary"
                                gutterBottom
                            >
                                Долгота: {longitude}
                            </Typography>
                            <VerticalLine sx={{ height: '15px' }} />
                            <Typography
                                sx={{ fontSize: 14, margin: '0 0 0 15px' }}
                                color="text.secondary"
                                gutterBottom
                            >
                                Широта: {latitude}
                            </Typography>
                        </InfoRow>
                        <InfoRow>
                            <HeightIcon
                                sx={{
                                    mr: '15px',
                                    color: theme.palette.hoverColor.main,
                                }}
                            />
                            <Typography
                                sx={{ fontSize: 14, margin: '0 22px 0 0' }}
                                color="text.secondary"
                                gutterBottom
                            >
                                Высота (м): {Math.round(baro_altitude)}
                            </Typography>
                        </InfoRow>
                        <InfoRow>
                            <SpeedIcon
                                sx={{
                                    mr: '15px',
                                    color: theme.palette.hoverColor.main,
                                }}
                            />
                            <Typography
                                sx={{ fontSize: 14, margin: '0 22px 0 0' }}
                                color="text.secondary"
                                gutterBottom
                            >
                                Скорость (км/ч): {(velocity * 3.6).toFixed()}
                            </Typography>
                        </InfoRow>
                        <InfoRow>
                            <RoundaboutRightIcon
                                sx={{
                                    mr: '15px',
                                    color: theme.palette.hoverColor.main,
                                }}
                            />
                            <Typography
                                sx={{ fontSize: 14, margin: '0 22px 0 0' }}
                                color="text.secondary"
                                gutterBottom
                            >
                                Направление: {true_track}°
                            </Typography>
                        </InfoRow>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            sx={{ color: theme.palette.hoverColor.main }}
                            onClick={handleClose}
                        >
                            Закрыть
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default FlightCard;
