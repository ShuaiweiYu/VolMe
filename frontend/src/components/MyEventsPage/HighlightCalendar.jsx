import React from "react";
import dayjs from "dayjs";
import {Box, Typography} from "@mui/material";
import { TextField, styled } from '@mui/material';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderColor: 'divider',
    },
}));

const ServerDay = (props) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth &&
        highlightedDays.includes(day.format("YYYY-MM-DD"));

    return (
        <HighlightedDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            selected={isSelected}
        />
    );
};

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        fontSize: '1.5rem', // Set your desired font size here
    },
}));

const HighlightCalendar = ({ highlightedDays }) => {
    const today = dayjs();

    return (
        <Box flex={2} p={2} sx={{ display: { xs: "none", sm: "block" }}}>
            <br/>
            <Box position="fixed">
                <Typography variant="h3" align="center" gutterBottom>
                    {today.format("MMMM DD, YYYY")}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        //defaultValue={today}
                        renderInput={(params) => <StyledTextField {...params} />}
                        minDate={today}
                        maxDate={today.add(2, "year")}
                        slots={{day: ServerDay}}
                        slotProps={{day: {highlightedDays}}}
                        onChange={() => {}}  // Disable date change
                        sx={{
                            boxShadow: 0,
                            bgcolor: "transparent",
                            backdropFilter: 'blur(24px)',
                            borderRadius: '15px',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                </LocalizationProvider>
            </Box>
        </Box>
    );
};

export default HighlightCalendar;


















