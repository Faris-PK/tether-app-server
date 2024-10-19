import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/useCases/user/RegisterUserUseCase';
import { VerifyOTPUseCase } from '../../application/useCases/user/VerifyOTPUseCase';
import { LoginUserUseCase } from '../../application/useCases/user/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/user/RefreshTokenUseCase';
import { ResendOTPUseCase } from '../../application/useCases/user/ResendOTPUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { OTPRepository } from '../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../infrastructure/mail/MailService';

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private verifyOTPUseCase: VerifyOTPUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private refreshTokenUseCase: RefreshTokenUseCase;
  private resendOTPUseCase: ResendOTPUseCase;

  constructor(
    private userRepository: UserRepository,
    private otpRepository: OTPRepository,
    private mailService: MailService
  ) {
    this.registerUserUseCase = new RegisterUserUseCase(userRepository, otpRepository, mailService);
    this.verifyOTPUseCase = new VerifyOTPUseCase(otpRepository);
    this.loginUserUseCase = new LoginUserUseCase(userRepository);
    this.refreshTokenUseCase = new RefreshTokenUseCase(userRepository);
    this.resendOTPUseCase = new ResendOTPUseCase(otpRepository, mailService);
  }
  async register(req: Request, res: Response) {
    try {
      const userData = req.body;
    //  console.log('userData : ',userData);
      
      await this.registerUserUseCase.execute(userData);
      return res.status(201).json({ message: 'User registered and OTP sent' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const isValidOTP = await this.verifyOTPUseCase.execute({ email, otp });
      if (!isValidOTP) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      return res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }


  async resendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this.resendOTPUseCase.execute(email);
      return res.status(200).json({ message: 'New OTP sent successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await this.loginUserUseCase.execute({ email, password });
    
      res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
  

  

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }

      const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken);

      res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

      return res.status(200).json({ message: 'Access token refreshed' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}