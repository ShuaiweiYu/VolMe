import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    useCreateEventMutation,
} from "../../redux/events/eventApiSlice";
import {toast} from "react-toastify";
import {
    TextField,
    Button,
    Typography, Container, Stack,
    Box,
    Grid, FormControlLabel, Checkbox, Divider, MenuItem, FormControl, InputLabel, Select, IconButton, Tooltip
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {DatePicker, DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Country, State, City} from 'country-state-city';
import Map from '../../components/GoogleMap/Map';
import DescriptionEditor from "../../components/CreateEventPage/DescriptionEditor";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import ImageUploadBox from "../../components/Upload/ImageUploadBox";
import {useCheckSubscriptionValidityMutation} from '../../redux/payment/paymentApiSlice'
import {useGetUserByUserIdQuery} from '../../redux/users/usersApiSlice'
import {useGetEventCountByIdMutation} from '../../redux/events/eventApiSlice'
import {useUpdateUserMutation} from '../../redux/users/usersApiSlice'
import {styled} from "@mui/system";
import {useTranslation} from "react-i18next";
import LockIcon from '@mui/icons-material/Lock';
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import {LoginModal, SignUpModal} from "../credentials/LoginModal";
import Dialog from "@mui/material/Dialog";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import DialogContent from "@mui/material/DialogContent";

const StyledButton = styled(Button)(({theme, variant}) => ({
    padding: '10px 20px',
    width: '200px',  // Set a fixed width
    height: '50px',
    borderRadius: '30px',
    ...(variant === 'outlined' && {
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
            color: "white",
        },
    }),
    ...(variant === 'contained' && {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
}));

const FullWidthDateTimePicker = styled(DateTimePicker)(({theme}) => ({
    width: '100%',
    margin: theme.spacing(1, 0),
}));

const CreateEvent = () => {
    const {t} = useTranslation();

    const organizerID = useSelector(selectCurrentUserId);

    const {data: organizerObj, isLoading: isGetOrganizerLoading} = useGetUserByUserIdQuery(organizerID)
    const [createEvent] = useCreateEventMutation();
    const [checkValidity] = useCheckSubscriptionValidityMutation()
    const [getEventCount] = useGetEventCountByIdMutation()
    const [updateUser] = useUpdateUserMutation()

    const [title, setTitle] = useState("");

    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [address, setAddress] = useState("");
    const [houseNumber, setHouseNumber] = useState(null);
    const [zipCode, setZipCode] = useState(null);
    const location = `${address} ${houseNumber}, ${zipCode} ${selectedCity?.name || ""},
     ${selectedState?.name || ""}, ${selectedCountry?.name || ""}`;

    useEffect(() => {
        setCountry(Country.getAllCountries());
    }, []);

    const handleCountryChange = (event, value) => {
        setSelectedCountry(value);
        setSelectedState(null);
        setSelectedCity(null);
        setState(value ? State.getStatesOfCountry(value.isoCode) : []);
        setCity([]);
    };

    const handleStateChange = (event, value) => {
        setSelectedState(value);
        setSelectedCity(null);
        setCity(value ? City.getCitiesOfState(selectedCountry.isoCode, value.isoCode) : []);
    };

    const handleCityChange = (event, value) => {
        setSelectedCity(value);
    };

    const handleEditorChange = (content) => {
        setDescription(content);
    };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [description, setDescription] = useState("");
    const [uploadURL, setUploadURL] = useState([]);
    const [peopleNeeded, setPeopleNeeded] = useState(null);

    const [category, setCategory] = useState("");
    const categoryList = [
        {key: "CS", value: t("events.CS")},
        {key: "EL", value: t("events.EL")},
        {key: "EC", value: t("events.EC")},
        {key: "HM", value: t("events.HM")},
        {key: "AW", value: t("events.AW")},
        {key: "AC", value: t("events.AC")},
        {key: "DR", value: t("events.DR")},
        {key: "YC", value: t("events.YC")},
        {key: "SE", value: t("events.SE")},
        {key: "SR", value: t("events.SR")},
        {key: "HR", value: t("events.HR")},
        {key: "SJ", value: t("events.SJ")},
        {key: "HH", value: t("events.HH")},
        {key: "HF", value: t("events.HF")},
        {key: "MH", value: t("events.MH")},
        {key: "IV", value: t("events.IV")},
        {key: "CI", value: t("events.CI")},
        {key: "OT", value: t("events.OT")}
    ];

    const [languages, setLanguages] = useState([]);
    const languagesList = [
        {key: "EN", value: t("events.en")},
        {key: "DE", value: t("events.de")},
        {key: "IT", value: t("events.it")},
        {key: "ES", value: t("events.es")},
        {key: "FR", value: t("events.fr")},
        {key: "CN", value: t("events.zh")}
    ]

    const handleLanguageChange = (event) => {
        const language = event.target.name;
        console.log(language)
        if (languages.includes(language)) {
            setLanguages(languages.filter(element => element !== language));
        } else {
            setLanguages([...languages, language]);
        }
        console.log(languages)
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // return to the previous page if cancel creating event
    };

    const defaultOptions = ['Resume', 'Motivation Letter'];
    const [requiredFiles, setRequiredFiles] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [newOption, setNewOption] = useState('');

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prevSelectedOptions =>
            prevSelectedOptions.includes(option)
                ? prevSelectedOptions.filter(opt => opt !== option)
                : [...prevSelectedOptions, option]
        );
    };

    const handleAddOption = () => {
        if (newOption && !requiredFiles.includes(newOption)) {
            setRequiredFiles([...requiredFiles, newOption]);
            setSelectedOptions([...selectedOptions, newOption]); // Automatically select the new option
            setNewOption('');
        }
    };

    const handleURLChange = (newURLs) => {
        setUploadURL(newURLs);
    };

    const canBePublished = title && startDate && endDate && selectedCountry && selectedState && selectedCity && address && houseNumber && zipCode && description && peopleNeeded && category && languages;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (postingPlan === "FREE") {
            const {data: count} = await getEventCount({id: organizerID, creationPlan: "FREE"})
            if (peopleNeeded > 5) {
                toast.error("Free Plan can only have 5 participants!");
                return
            } else if (count.response.eventCount >= 1) {
                toast.error("You have reached the monthly event creation limit");
                return
            }
        } else if (postingPlan === "PAYASYOUGO") {
            if (organizerObj.response.unusedPaidSubscription > 0) {
                const newAmount = organizerObj.response.unusedPaidSubscription - 1
                const user = await updateUser({userId: organizerID, updateData: {unusedPaidSubscription: newAmount}})
                if (user.data.response.unusedPaidSubscription === 0) {
                    await updateUser({userId: organizerID, updateData: {subscriptionType: "FREE"}})
                }
            } else {
                toast.error("Your unused Pay As You Go plan is not enough!");
                return
            }
            return
        } else if (postingPlan === "BASIC") {
            const {data: count} = await getEventCount({id: organizerID, creationPlan: "BASIC"})
            const result = await checkValidity({userID: organizerObj.response._id})
            if (result.data.status !== 'ACTIVE') {
                toast.error("Your subscription is invalid!");
                updateUser({userId: organizerID, updateData: {subscriptionType: "FREE"}})
                return
            } else if (count.response.eventCount >= 5) {
                toast.error("You have reached the monthly event creation limit");
                return
            }
        } else if (postingPlan === "PREMIUM") {
            const {data: count} = await getEventCount({id: organizerID, creationPlan: "PREMIUM"})
            const result = await checkValidity({userID: organizerObj.response._id})
            if (result.data.status !== 'ACTIVE') {
                toast.error("Your subscription is invalid!");
                return
            } else if (count.response.eventCount > 20) {
                toast.error("You have reached the monthly event creation limit");
                return
            }
        }

        try {
            let eventData = {
                "title": title,
                "organiser": organizerID.toString(),
                "isDraft": false,
                "startDate": startDate,
                "endDate": endDate,
                "selectedCountry": selectedCountry,
                "selectedState": selectedState,
                "selectedCity": selectedCity,
                "address": address,
                "houseNumber": houseNumber,
                "zipCode": zipCode,
                "description": description,
                "peopleNeeded": peopleNeeded,
                "category": "",
                "requiredFiles": requiredFiles,
                "languages": languages,
                "uploadURL": uploadURL,
                "creationPlan": organizerObj.response.subscriptionType
            };

            const event = await createEvent(eventData);

            if (event.error) {
                toast.error("Failed to create event. Please try again.");
            } else {
                toast.success(`${title} is created`);
                navigate(`/events/${event.data.response.event._id}`);
            }
        } catch (error) {
            toast.error("Failed to create event. Please try again.");
        }
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();

        try {
            let eventData = {
                "title": title,
                "organiser": organizerID.toString(),
                "isDraft": true,
                "startDate": startDate,
                "endDate": endDate,
                "selectedCountry": selectedCountry,
                "selectedState": selectedState,
                "selectedCity": selectedCity,
                "address": address,
                "houseNumber": houseNumber,
                "zipCode": zipCode,
                "description": description,
                "peopleNeeded": peopleNeeded,
                "category": "",
                "requiredFiles": requiredFiles,
                "languages": languages,
                "uploadURL": uploadURL,
                "creationPlan": organizerObj.response.subscriptionType
            };

            const event = await createEvent(eventData);

            if (event.error) {
                toast.error("Failed to create event. Please try again.");
            } else {
                toast.success(`${title} is created`);
                navigate(`/events/${event.data.response.event._id}`);
            }
        } catch (error) {
            toast.error("Failed to create event. Please try again.");
        }
    };

    const [customQuestions, setCustomQuestions] = useState([])
    const [customQuestion, setCustomQuestion] = useState("")
    const [requireSummary, setRequireSummary] = useState(false)
    const [options, setOptions] = useState([]);

    const addOption = () => {
        setOptions([...options, '']); // 每次点击时添加一个新输入框
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value; // 更新对应索引的输入框内容
        setOptions(newOptions);
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index); // 过滤掉对应索引的输入框
        setOptions(newOptions);
    };

    const createCustomQuestion = () => {
        const question = {
            question: customQuestion,
            options: options,
            requireSummary: requireSummary
        }
        setCustomQuestions([...customQuestions, question])
        setCustomQuestion("")
        setOptions([])
        setRequireSummary(false)
    }

    const [lockCustomQuestion, setLockCustomQuestion] = useState(false)
    const [lockCustomDocument, setLockCustomDocument] = useState(false)
    const [postingPlan, setPostingPlan] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        if (postingPlan === "PAYASYOUGO") {
            setLockCustomQuestion(false)
            setLockCustomDocument(false)
        } else if (postingPlan === "BASIC") {
            setLockCustomQuestion(false)
            setLockCustomDocument(true)
        } else if (postingPlan === "PREMIUM") {
            setLockCustomQuestion(false)
            setLockCustomDocument(false)
        }
        setOpenModal(false)
    }
    const [plans, setPlans] = useState([])

    useEffect(() => {
        if (!isGetOrganizerLoading && organizerObj) {
            if (organizerObj.response.subscriptionType === "FREE") {
                setLockCustomQuestion(true)
                setLockCustomDocument(true)
                setPostingPlan("FREE")
            } else if (organizerObj.response.subscriptionType === "PAYASYOUGO") {
                setLockCustomQuestion(false)
                setLockCustomDocument(false)
                setPostingPlan("PAYASYOUGO")
            } else {
                if (organizerObj.response.unusedPaidSubscription > 0) {
                    const plan = []
                    plan.push("PAY AS YOU GO")
                    plan.push(organizerObj.response.subscriptionType)
                    setPlans(plan)
                    setOpenModal(true)
                } else if (organizerObj.response.subscriptionType === "BASIC") {
                    setLockCustomQuestion(false)
                    setLockCustomDocument(true)
                    setPostingPlan("BASIC")
                } else if (organizerObj.response.subscriptionType === "PREMIUM") {
                    setLockCustomQuestion(false)
                    setLockCustomDocument(false)
                    setPostingPlan("PREMIUM")
                }
            }
        }
    }, [organizerObj, isGetOrganizerLoading]);

    console.log(organizerObj)

    const ChoosePlanModal = () => {
        return (
            <Box sx={{
                width: '400px',
                height: '200px',
                margin: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: '20px',
                paddingBottom: '20px',
            }}>
                <Alert severity="warning">
                    <AlertTitle>
                        You have multiple plans, please chose one to post the event
                    </AlertTitle>
                </Alert>
                <Typography sx={{paddingTop: "10px"}}>I will use</Typography>
                <Autocomplete
                    options={plans}
                    value={postingPlan}
                    onChange={(event, value) => setPostingPlan(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"choose plan"}
                            margin="normal"
                            fullWidth
                        />
                    )}
                />
                <Typography sx={{paddingBottom: "10px"}}>to post this event</Typography>
                <Button variant="contained" onClick={handleClose}>Confirm</Button>
            </Box>
        )
    }


    return (
        <Box id="create-event">
            <Container component="main" maxWidth="md">
                <Box sx={{marginTop: 8}}>
                    <Typography variant="h1" align="center" gutterBottom>{t("createEvent.postEvent")}</Typography>
                    <Divider sx={{margin: '20px 0'}}/>
                    <Stack
                        component="form"
                        noValidate
                        sx={{mt: 3}}
                    >
                        <Dialog
                            onClose={handleClose}
                            aria-labelledby="customized-dialog-title"
                            open={openModal}
                            sx={{
                                borderRadius: '15px',
                                backdropFilter: 'blur(0px)',
                                backgroundColor: 'rgba(255, 255, 255, 0)',
                            }}
                        >
                            <DialogContent
                                sx={{
                                    width: '450px',  // 设置白色内容部分的固定宽度
                                    height: '300px', // 设置白色内容部分的固定高度
                                }}
                            >
                            <Box>
                                <ChoosePlanModal/>
                            </Box>
                            </DialogContent>
                        </Dialog>

                        {/*标题*/}
                        <Stack container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h2"
                                            sx={{margin: '20px 0'}}>{t("createEvent.nameEvent")}</Typography>
                                <TextField
                                    required
                                    fullWidth
                                    id="eventtitle"
                                    label={t("createEvent.eventTitle")}
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    sx={{borderRadius: '30px'}}
                                />
                            </Grid>

                            {/*地点*/}
                            <Divider sx={{margin: '20px 0'}}/>
                            <Typography variant="h2">{t("createEvent.place")}</Typography>
                            <Stack>
                                <Stack direction="row">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <Autocomplete
                                                options={country}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedCountry}
                                                onChange={handleCountryChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={t("createEvent.country")}
                                                        margin="normal"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Autocomplete
                                                options={state}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedState}
                                                onChange={handleStateChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={t("createEvent.state")}
                                                        margin="normal"
                                                        fullWidth
                                                        disabled={!selectedCountry}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Autocomplete
                                                options={city}
                                                getOptionLabel={(option) => option.name}
                                                value={selectedCity}
                                                onChange={handleCityChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={t("createEvent.city")}
                                                        margin="normal"
                                                        fullWidth
                                                        disabled={!selectedState}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                                <Stack direction="row">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label={t("createEvent.address")}
                                                value={address}
                                                onChange={(event) => setAddress(event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                required
                                                fullWidth
                                                label={t("createEvent.houseNumber")}
                                                value={houseNumber}
                                                onChange={(event) => setHouseNumber(event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                required
                                                fullWidth
                                                label={t("createEvent.zipCode")}
                                                value={zipCode}
                                                onChange={(event) => setZipCode(event.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Stack>

                            {/*地图*/}
                            {/*todo：国内打开会报错*/}
                            <Grid item xs={12} sm={6}>
                                <Box sx={{width: '100%'}}>
                                    {location !== "" && (
                                        <Map
                                            address={`${location}, ${selectedCity?.name || ""}, ${selectedState?.name || ""}, ${selectedCountry?.name || ""}`}
                                        />
                                    )}
                                </Box>
                            </Grid>

                            {/*日期*/}
                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2"
                                                sx={{margin: '20px 0'}}>{t("createEvent.date")}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack direction="row" spacing={2}>
                                            <FullWidthDateTimePicker
                                                label={t("createEvent.startDate")}
                                                value={startDate}
                                                minDate={dayjs()}
                                                maxDate={dayjs().add(10, "year")}
                                                onChange={(newValue) => setStartDate(newValue)}
                                                renderInput={(props) => (
                                                    <TextField
                                                        {...props}
                                                        fullWidth
                                                        margin="normal"
                                                        required
                                                    />
                                                )}
                                            />
                                            <FullWidthDateTimePicker
                                                label={t("createEvent.endDate")}
                                                value={endDate}
                                                minDate={startDate || dayjs()}
                                                maxDate={dayjs().add(10, "year")}
                                                onChange={(newValue) => setEndDate(newValue)}
                                                renderInput={(props) => (
                                                    <TextField
                                                        {...props}
                                                        fullWidth
                                                        margin="normal"
                                                        required
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Box>
                            </Grid>

                            {/*文本编辑*/}
                            <Divider sx={{margin: '20px 0'}}/>
                            <Typography variant="h2" sx={{margin: '20px 0'}}>{t("createEvent.description")}</Typography>
                            <Grid item xs={12} sm={6}>
                                <DescriptionEditor
                                    value={description}
                                    onChange={handleEditorChange}
                                />
                            </Grid>

                            {/*图片上传*/}
                            {/*todo: 之后再修ImageUploadBox，这个经常用null查询*/}
                            {/*<Grid item xs={12} sm={6}>*/}
                            {/*    <Typography variant="h2"*/}
                            {/*                sx={{margin: '20px 0'}}>{t("createEvent.addPictures")}</Typography>*/}
                            {/*    <ImageUploadBox onURLChange={handleURLChange}/>*/}
                            {/*</Grid>*/}

                            {/*类别和人数*/}
                            <Divider sx={{margin: '20px 0'}}/>
                            <Typography variant="h2">{t("createEvent.peopleNeededAndCategory")}</Typography>
                            <Stack direction="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label={t("createEvent.peopleNeeded")}
                                            type="number"
                                            value={peopleNeeded}
                                            placeholder="min 1"
                                            InputProps={{inputProps: {min: 1}}}
                                            onChange={(event) => setPeopleNeeded(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <FormControl fullWidth required>
                                            <InputLabel id="category-label">Category</InputLabel>
                                            <Select
                                                labelId="category-label"
                                                id="category-select"
                                                value={category}
                                                label={t("createEvent.category")}
                                                onChange={(event) => setCategory(event.target.value)}
                                            >
                                                {categoryList?.map((cat) => (
                                                    <MenuItem key={cat.key} value={cat.key}>
                                                        {cat.value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Stack>

                            {/*选择语言*/}
                            <Box sx={{marginTop: 2,}}>
                                <Divider sx={{margin: '20px 0'}}/>
                                <Typography variant="h2">{t("createEvent.selectWorkingLanguages")}</Typography>
                                <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2}}>
                                    {languagesList.map((language) => (
                                        <FormControlLabel
                                            key={language.key}
                                            control={
                                                <Checkbox
                                                    checked={languages.includes(language.key)}
                                                    onChange={handleLanguageChange}
                                                    name={language.key}
                                                />
                                            }
                                            label={language.value}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/*自定义问题*/}
                            <Box sx={{position: 'relative', marginTop: 2}}>
                                {!lockCustomQuestion && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 1,
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <Tooltip title="免费计划不支持自定义问题">
                                            <IconButton sx={{color: 'white'}}>
                                                <LockIcon fontSize="large"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}
                                <Box sx={{
                                    opacity: lockCustomQuestion ? 1 : 0.4,
                                    pointerEvents: lockCustomQuestion ? 'auto' : 'none'
                                }}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2">添加自定义问题</Typography>
                                    <Stack direction="row" spacing={2} sx={{marginTop: 2, alignItems: "center"}}>
                                        <TextField
                                            label="Add Custom Option"
                                            value={customQuestion}
                                            onChange={(e) => setCustomQuestion(e.target.value)}
                                            fullWidth
                                        />
                                        <Button variant="contained" onClick={addOption}>添加预设回答选项</Button>
                                        <FormControlLabel
                                            key={"是否需要提供总结"}
                                            control={
                                                <Checkbox
                                                    checked={requireSummary}
                                                    onChange={() => setRequireSummary(!requireSummary)}
                                                    name={"是否需要提供总结"}
                                                />
                                            }
                                            label={"是否需要提供总结"}
                                        />
                                        <Button variant="contained"
                                                onClick={createCustomQuestion}>添加自定义问题</Button>
                                    </Stack>
                                    <Stack direction="column" spacing={1} sx={{marginTop: 2}}>
                                        {options.map((option, index) => (
                                            <>
                                                <Stack direction="row" spacing={2} sx={{marginTop: 2}}>
                                                    <TextField
                                                        type="text"
                                                        value={option}
                                                        onChange={(event) => handleOptionChange(index, event)}
                                                        fullWidth
                                                        placeholder="Add Custom Option"
                                                    />
                                                    <Button variant="contained"
                                                            onClick={() => removeOption(index)}>删除</Button>
                                                </Stack>
                                            </>
                                        ))}
                                    </Stack>
                                    {customQuestions.length > 0 && (
                                        <Typography variant="h2" sx={{marginTop: 2}}>自定义问题预览</Typography>
                                    )}
                                    <Grid container spacing={1}>
                                        {customQuestions.map((question, index) => (
                                            <>
                                                <Grid item xs={4}>
                                                    <Typography variant="h4"
                                                                sx={{marginTop: 1}}>{question.question}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {question.options.length > 0 ? (<>
                                                        <Autocomplete
                                                            id={"preview" + index}
                                                            options={question.options}
                                                            filterSelectedOptions
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label={question.question}
                                                                    fullWidth
                                                                />
                                                            )}
                                                        />
                                                    </>) : (<>
                                                        <TextField
                                                            label={question.question}
                                                            fullWidth
                                                        />
                                                    </>)}
                                                </Grid>
                                            </>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>

                            {/*选择文件*/}
                            <Box sx={{position: 'relative', marginTop: 2}}>
                                {!lockCustomDocument && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 1,
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <Tooltip title="升级你的订阅计划来解锁选择文件">
                                            <IconButton sx={{color: 'white'}}>
                                                <LockIcon fontSize="large"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}
                                <Box sx={{
                                    opacity: lockCustomDocument ? 1 : 0.4,
                                    pointerEvents: lockCustomDocument ? 'auto' : 'none'
                                }}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2">Select Required Documents</Typography>
                                    <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2}}>
                                        {[...defaultOptions, ...requiredFiles].map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        checked={selectedOptions.includes(option)}
                                                        onChange={() => handleCheckboxChange(option)}
                                                    />
                                                }
                                                label={option}
                                            />
                                        ))}
                                    </Box>
                                    <Stack direction="row" spacing={2} sx={{marginTop: 2}}>
                                        <TextField
                                            label="Add Custom Option"
                                            value={newOption}
                                            onChange={(e) => setNewOption(e.target.value)}
                                            fullWidth
                                        />
                                        <Button variant="contained" onClick={handleAddOption}>Add</Button>
                                    </Stack>
                                </Box>
                            </Box>

                            <br/>

                            {/*确认按钮*/}
                            <Stack direction="row">
                                <Grid container spacing={5}>
                                    <Grid item xs={12} sm={4}>
                                        <StyledButton
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            disabled={!canBePublished}
                                            sx={{
                                                width: "100%",
                                                height: "60px",
                                            }}
                                        >
                                            <Typography variant="h3">{t("createEvent.create")}</Typography>
                                        </StyledButton>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <StyledButton
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveDraft}
                                            sx={{
                                                width: "100%",
                                                height: "60px",
                                            }}
                                        >
                                            <Typography variant="h3">Save to draft</Typography>
                                        </StyledButton>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <StyledButton
                                            variant="outlined"
                                            onClick={handleGoBack}
                                            sx={{
                                                width: "100%",
                                                height: "60px",
                                                color: "primary",
                                                borderColor: "primary",
                                            }}
                                        >
                                            <Typography variant="h3"
                                                        color="primary">{t("createEvent.cancel")}</Typography>
                                        </StyledButton>
                                    </Grid>
                                </Grid>
                            </Stack>

                            <br/>

                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateEvent;