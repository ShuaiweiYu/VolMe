// src/uploadToS3.js
import AWS from 'aws-sdk';

const uploadFile = async (file, config) => {
    if (!file) {
        return ""
    }
    
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region,
    });

    const s3 = new AWS.S3();
    const params = {
        Bucket: config.bucketName,
        Key: file.name,
        Body: file,
        ContentType: file.type,
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // 返回文件在S3中的URL
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

const deleteFile = async (filePath, config) => {
    if (!filePath) {
        return ""
    }
    
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region,
    });

    const s3 = new AWS.S3();
    const params = {
        Bucket: config.bucketName,
        Key: filePath.replace(`https://${config.bucketName}.s3.${config.region}.amazonaws.com/`, ''),
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

export { uploadFile, deleteFile };
