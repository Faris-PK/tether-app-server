import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { RegisterUserDTO } from '../../dto/RegisterUserDTO';
import bcrypt from 'bcryptjs';
import { User } from '../../../domain/entities/User';
import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
import { generateOTP } from '../../../shared/utils/OTPGenerator';
import { OTP } from '../../../domain/entities/OTP'; 

export class RegisterUserUseCase {
  private userRepository: UserRepository;
  private otpRepository: OTPRepository;
  private mailService: MailService;

  constructor(userRepository: UserRepository, otpRepository: OTPRepository, mailService: MailService) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.mailService = mailService;
  }

  async execute(userData: RegisterUserDTO): Promise<void> {
    const { username, email, password, mobile } = userData;
    //console.log('userData from useCase', userData);
    

    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile
      
    });

    console.log('newUser: ',newUser);
    
    // Save the new user
    await this.userRepository.save(newUser);

    // Generate OTP
    const otp = generateOTP();
    console.log('Yout OTP: ',otp);
    

    // Create a new OTP instance and save it
    const otpRecord = new OTP({
      email,
      otp,
      createdAt: new Date(),
    });
    await this.otpRepository.save(otpRecord);

    // Send OTP to the user's email
    await this.mailService.sendOTP(email, otp);
  }
}
