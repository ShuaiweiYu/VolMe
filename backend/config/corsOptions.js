import allowedOrigins from './allowedOrigins.js';

const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.environment === 'development') {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        } else {
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }

    },
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['ETag']
}

export default corsOptions