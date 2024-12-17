import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { LoginUserDTO } from '../../dto/LoginUserDTO';
import { IUser } from '../../../domain/entities/User';
export declare class LoginUserUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(loginData: LoginUserDTO): Promise<{
        accessToken: string;
        refreshToken: string;
        user: IUser;
    }>;
}
