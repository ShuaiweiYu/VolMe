import imageCompression from 'browser-image-compression';

const compressImage = async (file, options = {}) => {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        maxIteration: 10,
        initialQuality: 0.8
    };

    const compressionOptions = { ...defaultOptions, ...options };

    try {
        const compressedFile = await imageCompression(file, compressionOptions);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing file:', error);
        throw error;
    }
};

export default compressImage;