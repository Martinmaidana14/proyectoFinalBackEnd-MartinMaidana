
import dotenv from 'dotenv';

dotenv.config();

const varenv = {
    mongo_url: process.env.MONGO_DB_URL,
    session_secret: process.env.SESSION_SECRET,
    cookies_secret: process.env.COOKIES_SECRET,
    salt: parseInt(process.env.SALT),
    jwt_secret: process.env.JWT_SECRET
};

export default varenv;