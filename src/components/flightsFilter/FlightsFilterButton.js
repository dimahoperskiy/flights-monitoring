import FilterListIcon from '@mui/icons-material/FilterList';
import { IconButton, useTheme } from '@mui/material';
import React from 'react';

const FlightsFilterButton = ({ setFilterModalOpen }) => {
    const theme = useTheme();
    const handleClick = () => {
        setFilterModalOpen(true);
    };

    return (
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
            <FilterListIcon />
        </IconButton>
    );
};

export default FlightsFilterButton;
