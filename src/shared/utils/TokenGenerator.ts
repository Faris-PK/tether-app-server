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

const generatePasswordResetToken = (userId: string, email: string) => {
    return jwt.sign(
      { userId, email },
      process.env.PASSWORD_RESET_SECRET as string,
      { expiresIn: '1h' } // Reset token expires in 1 hour
    );
  };

export {generateAccessToken, generateRefreshToken , generatePasswordResetToken}