import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import React, { useContext, useState } from 'react';

import aircraftTypes from '../common/aircraftTypes';
import { countriesListRussian } from '../common/countriesList';
import MapContext from '../map/MapContext';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .Mui-checked': {
        color: theme.palette.hoverColor.main,
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#000 !important',
    },
}));

const FlightsFilterModal = ({ filterModalOpen, setFilterModalOpen }) => {
    const theme = useTheme();
    const [countryInputValue, setCountryInputValue] = useState('');
    const [aircraftInputValue, setAircraftInputValue] = useState('');
    const {
        selectedCountry,
        setSelectedCountry,
        inAir,
        setInAir,
        aircraftType,
        setAircraftType,
    } = useContext(MapContext);

    const handleClose = () => {
        setFilterModalOpen(false);
    };

    const handleReset = () => {
        setCountryInputValue(null);
        setSelectedCountry(null);
        setAircraftInputValue(null);
        setAircraftType(null);
        setInAir(null);
    };

    const handleCountryChange = (newValue) => {
        if (newValue) {
            setSelectedCountry(newValue);
        } else {
            setSelectedCountry('');
        }
    };

    const handleAircraftChange = (newValue) => {
        if (newValue) {
            setAircraftType(newValue);
        } else {
            setAircraftType(null);
        }
    };

    const handleCountryInputChange = (newInputValue) => {
        setCountryInputValue(newInputValue);
    };

    const handleAircraftInputChange = (newInputValue) => {
        setAircraftInputValue(newInputValue);
    };

    const handleSwitchChange = (e) => {
        setInAir(e.target.checked);
    };

    const countriesOptions = countriesListRussian.map((country, index) => {
        return { label: country.name, id: index, code: country.code };
    });

    const aircraftOptions = aircraftTypes
        .map((el, index) => {
            return { label: el, id: index };
        })
        .filter((filt) => filt.label !== 'Нет информации');

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
            open={filterModalOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <>
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ backgroundColor: theme.palette.hoverColor.main }}
                >
                    Фильтр
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            mt: '15px',
                            mb: '10px',
                            pb: '10px',
                        }}
                    >
                        Страна регистрации самолета
                    </DialogContentText>
                    <FormControl
                        fullWidth
                        sx={{
                            borderBottom:
                                '1px solid' + theme.palette.hoverColor.main,
                            pb: '20px',
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            id="countries-select"
                            options={countriesOptions}
                            value={selectedCountry}
                            inputValue={countryInputValue}
                            onChange={(event, newValue) => {
                                handleCountryChange(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                handleCountryInputChange(newInputValue);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Страна" />
                            )}
                        />
                    </FormControl>

                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            mt: '15px',
                            mb: '10px',
                            pb: '10px',
                        }}
                    >
                        Категория воздушного судна
                    </DialogContentText>
                    <FormControl
                        fullWidth
                        sx={{
                            borderBottom:
                                '1px solid' + theme.palette.hoverColor.main,
                            pb: '20px',
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            id="aircraft-select"
                            options={aircraftOptions}
                            value={aircraftType}
                            inputValue={aircraftInputValue}
                            onChange={(event, newValue) => {
                                handleAircraftChange(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                handleAircraftInputChange(newInputValue);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Категория" />
                            )}
                        />
                    </FormControl>

                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            mt: '15px',
                            pb: '5px',
                        }}
                    >
                        Только самолеты в воздухе
                    </DialogContentText>
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={inAir === true}
                                onChange={handleSwitchChange}
                            />
                        }
                        label="В воздухе"
                    />
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            // mt: '5px',
                            pb: '5px',
                        }}
                    >
                        Показаны{inAir === null && ' все'} самолеты{' '}
                        {(inAir === true && 'в воздухе') ||
                            (inAir === false && 'на земле')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ color: theme.palette.hoverColor.main }}
                        onClick={handleReset}
                    >
                        Сбросить фильтры
                    </Button>
                    <Button
                        sx={{ color: theme.palette.hoverColor.main }}
                        onClick={handleClose}
                    >
                        Закрыть
                    </Button>
                </DialogActions>
            </>
        </Dialog>
    );
};

export default FlightsFilterModal;
