import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCreateEventMutation,
    useUploadEventImageMutation,
} from "../../redux/events/eventApiSlice";
import { useFetchCategoriesQuery } from "../../redux/events/categoryApiSlice";
import { toast } from "react-toastify";
import {
    TextField,
    Button,
    Typography,
} from '@mui/material';
import {Card, CardActions, CardContent } from "@mui/material";
import {t} from "i18next";
import Stack from "@mui/material/Stack";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";

import "./EventList.css";


const EventList = () => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(null);
    const [organiser, setOrganiser] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [peopleNeeded, setPeopleNeeded] = useState(0);
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const [uploadEventImage] = useUploadEventImageMutation();
    const [createEvent] = useCreateEventMutation();
    const {data: categories} = useFetchCategoriesQuery();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const eventData = new FormData();
            eventData.append("title", title);
            eventData.append("date", date);
            eventData.append("organiser", organiser);
            eventData.append("location", location);
            eventData.append("description", description);
            eventData.append("peopleNeeded", peopleNeeded);
            eventData.append("category", category);
            eventData.append("image", image);
            eventData.append("imageUrl", imageUrl);

            const { data } = await createEvent(eventData);

            if (data.error) {
                toast.error("Failed to create event. Please try again.");
            } else {
                toast.success(`${data.title} is created`);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create event. Please try again.");
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            const res = await uploadEventImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
            setImageUrl(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    /*
    const FullWidthDatePicker = styled(DatePicker)(({theme}) => ({
        width: '100%',
        margin: theme.spacing(1, 0),
    }));

     */

    return (
        <Card
            sx={{
                px: 2,
                py: 1,
                borderRadius: 4,
                width: "80%",
                backgroundColor:  "#FFF",
            }}
        >
            <CardContent>
                <Stack
                    direction={{ xs: "row", lg: "row" }}
                    spacing={3}
                    //key={booking._id}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Typography variant="h6">
                        {t("Create new event")}
                    </Typography>

                    <TextField
                        label="Event Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            //label={t('credentials.signUp.step2VolunteerBirthday')}
                            value={date}
                            maxDate={dayjs(new Date())}
                            onChange={(newValue) => setDate(newValue)}
                            slots={{
                                textField: (props) => <TextField {...props} fullWidth margin="normal" required/>
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="Event organiser"
                        value={organiser}
                        onChange={(event) => setOrganiser(event.target.value)}
                    />

                    <TextField
                        label="Event Location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                    />

                    <TextField
                        label="Event Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />

                    <TextField
                        label="People Needed"
                        value={peopleNeeded}
                        onChange={(event) => setPeopleNeeded(event.target.value)}
                    />

                    <TextField
                        label="Category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    />


                    {imageUrl && (
                        <div className="text-center">
                            <img
                                src={imageUrl}
                                alt="product"
                                className="block mx-auto max-h-[200px]"
                            />
                        </div>
                    )}
                </Stack>

            </CardContent>

            <CardContent>
                <div className="mb-3">
                    <label
                        className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                        {image ? image.name : "Upload Image"}

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={uploadFileHandler}
                            className={!image ? "hidden" : "text-white"}
                        />
                    </label>
                </div>
            </CardContent>

            <CardActions>
                <Stack
                    sx={{width: "100%"}}
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                    <Button type="submit" onClick={handleSubmit}>
                        Create
                    </Button>

                    <Button variant="contained" color="secondary" sx={{width: "100%"}}>
                        Cancel
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};
export default EventList;
