import {deleteFile, uploadFile} from "./fileUploader";
import compressImage from "./imageCompressor";

const config = {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
};

const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg','image/bmp', 'image/webp', 'image/tiff', 'application/pdf'];

const upload = async (file, fileType, userId) => {
    validateFile(file)
    const timestamp = Date.now();
    try {
        if (fileType === "pdf") {
            const pdf = await uploadFile(renameFile(timestamp, file, userId, "original"), config);
            return pdf.replace(/-(original|preview|display)(?=\.\w+$)/, "");
        } else {
            if (fileType === "icon") {
                const previewIcon = await compressImage(renameFile(timestamp, file, userId, "preview"), {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 120,
                    initialQuality: 0.7
                });
                const displayIcon = await compressImage(renameFile(timestamp, file, userId, "display"), {
                    maxSizeMB: 0.6,
                    maxWidthOrHeight: 300,
                    initialQuality: 0.8
                });
                const url = await uploadFile(previewIcon, config);
                await uploadFile(displayIcon, config);
                return url.replace(/-(original|preview|display)(?=\.\w+$)/, "");
            } else if (fileType === "image") {
                const previewImage = await compressImage(renameFile(timestamp, file, userId, "preview"), {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 600,
                    initialQuality: 0.8
                });
                const displayImage = await compressImage(renameFile(timestamp, file, userId, "display"), {
                    maxSizeMB: 1.0,
                    maxWidthOrHeight: 1000,
                    initialQuality: 0.8
                });
                const originalImage = await compressImage(renameFile(timestamp, file, userId, "original"), {
                    maxSizeMB: 2.0,
                    maxWidthOrHeight: 2000,
                    initialQuality: 0.8
                });
                const url = await uploadFile(previewImage, config);
                await uploadFile(displayImage, config);
                await uploadFile(originalImage, config);
                return url.replace(/-(original|preview|display)(?=\.\w+$)/, "");
            }

        }
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

const renameFile = (timestamp, file, userId, size) => {
    const extension = file.name.split('.').pop();
    const newName = `${userId}/${timestamp}-${size}.${extension}`;
    return new File([file], newName, { type: file.type });
};

const getFileUrl = (url, type, size) => {
    if (!url) {
        return ""
    }
    const sizeSuffixMap = {
        'pdf': '-original',
        'image': {
            'preview': '-preview',
            'display': '-display',
            'default': '-original'
        },
        'icon': {
            'preview': '-preview',
            'display': '-display',
            'default': '-display'
        }
    };

    if (!sizeSuffixMap[type]) {
        return url;
    }

    const typeConfig = sizeSuffixMap[type];
    let suffix = '';

    if (typeof typeConfig === 'string') {
        suffix = typeConfig;
    } else {
        suffix = typeConfig[size] || typeConfig['default'];
    }

    return url.replace(/\.(\w+)$/, `${suffix}.$1`);
};

const deleteAllFile = async (baseUrl) => {
    try {
        const suffixes = ['-original', '-preview', '-display'];
        const urlsToDelete = suffixes.map(suffix => baseUrl.replace(/\.(\w+)$/, `${suffix}.$1`));

        for (let url of urlsToDelete) {
            await deleteFile(url, config);
        }
    } catch (error) {
        console.error('Error deleting files:', error);
    }
};

const validateFile = (file) => {
    const type = file.type;
    if (!validImageTypes.includes(type)) {
        throw Error("TypeError")
    } else if (file.size > 5 * 1024 * 1024) {
        throw Error("SizeError")
    }
}

export {upload, getFileUrl, validateFile, deleteAllFile}