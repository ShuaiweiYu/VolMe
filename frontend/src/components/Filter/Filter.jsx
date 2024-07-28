import React from 'react';
import FilterContent from "./FilterContent";
import FilterItem from "./FilterItem";
import {Stack, Typography} from "@mui/material";
import {volmeTheme} from "../../theme";
import {ThemeProvider} from "@mui/material/styles";

const styles = {
    filter: {
        width: '200px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        textAlign: 'left',
    },
    filterList: {
        listStyle: 'none',
        padding: 0,
        textAlign: 'left',
    },

};


const Filter = ({handleChange,handleTimeChange,handleLanguageChange}) => {

    return (
        <ThemeProvider theme={volmeTheme}>
            <Stack style={styles.filter}>
                <Typography variant="h3" sx={{margin: 0}}>Filters</Typography>
                <ul style={styles.filterList}>
                    <FilterItem title="Location">
                        {/* Content for Location filter */}
                        <Stack sx={{alignItems: 'left'}}>
                            <FilterContent handleChange={handleChange} value="Munich" label="Munich"/>
                            <FilterContent handleChange={handleChange} value="Garching bei München" label="Garching bei München"/>
                        </Stack>
                    </FilterItem>
                    <FilterItem title="Date">
                        <Stack sx={{alignItems: 'left'}}>
                            <FilterContent handleChange={handleTimeChange} value="Past" label="Past"/>
                            <FilterContent handleChange={handleTimeChange} value="Future" label="Future"/>
                        </Stack>
                    </FilterItem>
                    <FilterItem title="Languages">
                        <Stack sx={{alignItems: 'left'}}>
                            <FilterContent handleChange={handleLanguageChange} value="English" label="English"/>
                            <FilterContent handleChange={handleLanguageChange} value="German" label="German"/>
                            <FilterContent handleChange={handleLanguageChange} value="Italian" label="Italian"/>
                            <FilterContent handleChange={handleLanguageChange} value="Spanish" label="Spanish"/>
                        </Stack>
                    </FilterItem>
                </ul>
            </Stack>
        </ThemeProvider>
    );
};

export default Filter;

