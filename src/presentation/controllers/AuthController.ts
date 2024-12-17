import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/useCases/user/RegisterUserUseCase';
import { VerifyOTPUseCase } from '../../application/useCases/user/VerifyOTPUseCase';
import { LoginUserUseCase } from '../../application/useCases/user/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/user/RefreshTokenUseCase';
import { ResendOTPUseCase } from '../../application/useCases/user/ResendOTPUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { OTPRepository } from '../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../infrastructure/mail/MailService';
import { ForgotPasswordUseCase } from '../../application/useCases/user/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/useCases/user/ResetPasswordUseCase';


export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private verifyOTPUseCase: VerifyOTPUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private refreshTokenUseCase: RefreshTokenUseCase;
  private resendOTPUseCase: ResendOTPUseCase;
  private forgotPasswordUseCase: ForgotPasswordUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;

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
    this.forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, mailService);
    this.resetPasswordUseCase = new ResetPasswordUseCase(userRepository);
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
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const { accessToken, refreshToken, user } = await this.loginUserUseCase.execute({ 
        email, 
        password 
      });
  
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
  
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Login error:', error); // Log the full error for debugging
  
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message || 'Authentication failed' });
      }
  
      return res.status(500).json({ message: 'Internal server error' });
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

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const resetToken = await this.forgotPasswordUseCase.execute(email);
      return res.status(200).json({
        message: 'Password reset link has been sent to your email',
        resetToken // In production, don't send this in response, only send via email
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await this.resetPasswordUseCase.execute({ token, newPassword });
      return res.status(200).json({
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}