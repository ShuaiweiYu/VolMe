import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
//import {Box, Grid, inputLabelClasses} from "@mui/material";

const SearchBar = ({searchTermProp, setSearchTermProp, onSearchProp, onClearProp,label}) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchProp();
        }
    };

    return (
            <TextField
                id="searchInput"
                label={label}
                sx={{paddingBottom:'20px'}}
                value={searchTermProp}
                onChange={(e) => setSearchTermProp(e.target.value)}
                onKeyDown={handleKeyDown}
                InputLabelProps={{shrink: true}}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onSearchProp}
                                color="primary.main"
                                aria-label="Search"
                                edge="end"
                            >
                                <SearchIcon/>
                            </IconButton>
                            {searchTermProp && (
                                <IconButton
                                    onClick={onClearProp}
                                    edge="end"
                                >
                                    <ClearIcon/>
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                }}
            />
    );
};

export default SearchBar;
