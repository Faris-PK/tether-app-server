export declare class MailService {
    sendOTP(email: string, otp: string): Promise<void>;
    sendPasswordResetLink(email: string, resetLink: string): Promise<void>;
}
