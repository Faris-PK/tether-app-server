import jwt from 'jsonwebtoken'

const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId },process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '15m', //Access token expires in 15 minutes
    });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string ,{
        expiresIn: '7d' // Refresh token expires in 7 days
    });
}

export {generateAccessToken, generateRefreshToken}