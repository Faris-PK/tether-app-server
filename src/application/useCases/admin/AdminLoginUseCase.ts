import { AdminRepository } from '../../../infrastructure/repositories/AdminRepository';
import { AdminLoginDTO } from '../../dto/AdminLoginDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAdmin } from '../../../domain/entities/Admin';

export class AdminLoginUseCase {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(loginData: AdminLoginDTO): Promise<{ accessToken: string; refreshToken: string; admin: IAdmin }> {
    const { email, password } = loginData;
    console.log('password from body', password);
    

    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    console.log('password from db:', admin.password);
   
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log(isPasswordValid);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials ');
    }

    const accessToken = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_ADMIN_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_ADMIN_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken, admin };
  }
}