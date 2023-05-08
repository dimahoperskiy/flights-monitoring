import SearchIcon from '@mui/icons-material/Search';
import {
    Button,
    IconButton,
    Popover,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { fromLonLat } from 'ol/proj';
import React, { useContext, useState } from 'react';

import MapContext from '../../utils/MapContext';
const SearchButton = ({ flights }) => {
    const theme = useTheme();
    const { map, setSearchedFlight } = useContext(MapContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState('');

    const handleInputChange = (e) => setValue(e.target.value);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFind = () => {
        const searchedFlightLocal = flights.find(
            (el) => el[0] === value || el[1].trim() === value
        );
        if (searchedFlightLocal) {
            setSearchedFlight(searchedFlightLocal);
            const coordinates = fromLonLat([
                searchedFlightLocal[5],
                searchedFlightLocal[6],
            ]);
            map.getView().animate({
                center: coordinates,
            });
        } else {
            alert('Самолет не найден');
        }
    };

    const handleReset = () => {
        setValue('');
        setSearchedFlight(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <IconButton
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    right: '10px',
                    top: '55px',
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.default,
                }}
                onClick={handleClick}
            >
                <SearchIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px',
                    }}
                >
                    <Typography sx={{ p: 2 }}>
                        Поиск по icao24 / позывному
                    </Typography>
                    <TextField
                        value={value}
                        onChange={handleInputChange}
                        label="Поиск"
                        variant="outlined"
                    />
                    <div
                        style={{
                            display: 'flex',
                            marginTop: '10px',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            disabled={!value}
                            sx={{ width: '48%' }}
                            onClick={handleFind}
                        >
                            Найти
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={!value}
                            sx={{ width: '48%' }}
                            onClick={handleReset}
                        >
                            Сбросить
                        </Button>
                    </div>
                </div>
            </Popover>
        </>
    );
};

export default SearchButton;
