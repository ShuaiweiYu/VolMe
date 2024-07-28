import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { getFileUrl } from "../../util/fileUploaderWrapper";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);



function ImageWindow({ uploadURL }) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const maxSteps = uploadURL.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    React.useEffect(() => {
        console.log("Upload URLs:", uploadURL);
        uploadURL.forEach((url, index) => {
            const fileUrl = getFileUrl(url, "image", "default");
            console.log(`Generated URL for image ${index + 1}:`, fileUrl);
        });
    }, [uploadURL]);


    return (
        <Box sx={{ maxWidth: "100%", maxHeight: "100%", flexGrow: 1 }}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {uploadURL.map((url, index) => (
                    <div key={index}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                component="img"
                                sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    width: '100%',
                                    maxHeight: 400,
                                }}
                                src={getFileUrl(url, "image", "display")}
                                alt={`Image ${index + 1}`}
                                onError={(e) => {
                                    console.error(`Error loading image at ${getFileUrl(url, "image", "display")}`, e);
                                    e.target.src = 'https://via.placeholder.com/400'; // Fallback image
                                }}
                            />
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Box>
    );
}

export default ImageWindow;




