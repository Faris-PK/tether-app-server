import { IOTP } from '../../domain/entities/OTP';
import { IOTPRepository } from '../../domain/interfaces/IOTPRepository';
export declare class OTPRepository implements IOTPRepository {
    save(otp: IOTP): Promise<IOTP>;
    findByEmail(email: string): Promise<IOTP | null>;
    deleteByEmail(email: string): Promise<void>;
}
