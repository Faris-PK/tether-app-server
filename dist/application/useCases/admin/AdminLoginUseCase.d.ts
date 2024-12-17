import { AdminRepository } from '../../../infrastructure/repositories/AdminRepository';
import { AdminLoginDTO } from '../../dto/AdminLoginDTO';
import { IAdmin } from '../../../domain/entities/Admin';
export declare class AdminLoginUseCase {
    private adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(loginData: AdminLoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
        admin: IAdmin;
    }>;
}
