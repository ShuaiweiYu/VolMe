import {Checkbox, FormControlLabel, } from "@mui/material";


const FilterContent = ({ handleChange,value,label}) => {
    return (
            <FormControlLabel sx={{padding:0 ,margin:0}} control={<Checkbox sx={{padding:0.5}} value={value} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }}/>} label={label}></FormControlLabel>
    );
};

export default FilterContent;


