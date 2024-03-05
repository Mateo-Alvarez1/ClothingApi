import cors from 'cors'

export const corsMiddleware = () => cors({
    origin: function (origin, callback) {
        return callback(null, true);
    }
        
})