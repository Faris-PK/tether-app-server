declare const generateAccessToken: (userId: string) => string;
declare const generateRefreshToken: (userId: string) => string;
declare const generatePasswordResetToken: (userId: string, email: string) => string;
export { generateAccessToken, generateRefreshToken, generatePasswordResetToken };
