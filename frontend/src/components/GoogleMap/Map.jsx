import React, { useState, useEffect } from 'react';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;

const Map = ({ address }) => {
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                setCoordinates({ lat, lng });
            }
        };

        fetchCoordinates().catch(console.error);
    }, [address]);

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '15px',
        overflow: 'hidden' // Ensure the border radius is applied correctly
    };

    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY });

    if (!isLoaded || !coordinates) {
        return null;
    } else {
        return <>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={coordinates}
                zoom={14}
            >
                <Marker position={coordinates} />
            </GoogleMap>
        </>
    }
};

export default Map;
