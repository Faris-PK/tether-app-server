import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { LoginUserDTO } from '../../dto/LoginUserDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {IUser} from '../../../domain/entities/User'
export class LoginUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(loginData: LoginUserDTO): Promise<{ accessToken: string; refreshToken: string , user :IUser }> {
    const { email, password } = loginData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log('user : ', user);
    if(user.isBlocked) {
      throw new Error('This user already blocked');
    }
    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );
    

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );
    console.log(jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string));
    

    return { accessToken, refreshToken , user};
  }
}