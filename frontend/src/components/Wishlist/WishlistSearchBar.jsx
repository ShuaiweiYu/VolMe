import React, { useState } from 'react';
import {
    TextField,
    IconButton,
    InputAdornment,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {useTranslation} from "react-i18next";

const WishlistSearchBar = ({ items, setFilteredItems }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResultMessage, setSearchResultMessage] = useState('');
    const {t} = useTranslation();

    const searchItem = () => {
        if (!items || !Array.isArray(items)) return; // Guard against undefined or non-array items
        const filtered = items.filter(item =>
            item.event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
        setSearchResultMessage(`Search for "${searchTerm}", ${filtered.length} results found`);
    };

    const clearSearch = () => {
        setSearchTerm('');
        if (typeof setFilteredItems === 'function') {
            setFilteredItems(items); // Reset to show all items
            setSearchResultMessage('');
        }
    };

    return (
        <div className="search-bar" style={{ marginBottom: '20px' }}>
            <TextField
                id="searchInput"
                label={t("wishlist.enterEventName")}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        searchItem();
                    }
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={searchItem}
                                color="primary"
                                aria-label="Search"
                                edge="end"
                            >
                                <SearchIcon />
                            </IconButton>
                            {searchTerm && (
                                <IconButton onClick={clearSearch} edge="end">
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                }}
            />
            {searchResultMessage && (
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                    {searchResultMessage}
                </Typography>
            )}
        </div>
    );
};

export default WishlistSearchBar;
