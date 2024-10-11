import { Request, Response } from 'express';
import { AdminLoginUseCase } from '../../application/useCases/admin/AdminLoginUseCase';
import { BlockUserUseCase } from '../../application/useCases/admin/BlockUserUseCase';
import { UnblockUserUseCase } from '../../application/useCases/admin/UnblockUserUseCase';
import { AdminRepository } from '../../infrastructure/repositories/AdminRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { GetUsersUseCase } from '../../application/useCases/admin/GetUsersUseCase';

export class AdminController {
  private adminLoginUseCase: AdminLoginUseCase;
  private blockUserUseCase: BlockUserUseCase;
  private unblockUserUseCase: UnblockUserUseCase;
  private getUsersUseCase: GetUsersUseCase;

  constructor(
    private adminRepository: AdminRepository,
    private userRepository: UserRepository
  ) {
    this.adminLoginUseCase = new AdminLoginUseCase(adminRepository);
    this.blockUserUseCase = new BlockUserUseCase(userRepository);
    this.unblockUserUseCase = new UnblockUserUseCase(userRepository);
    this.getUsersUseCase = new GetUsersUseCase(userRepository);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
     // console.log('From body...',req.body);
      
      const { accessToken, refreshToken, admin } = await this.adminLoginUseCase.execute({ email, password });

      res.cookie('adminAccessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.cookie('adminRefreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({ message: 'Admin login successful', admin });
    } catch (error) {
      if (error instanceof Error) {
        console.log('message', error.message);
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('adminAccessToken');
    res.clearCookie('adminRefreshToken');
    return res.status(200).json({ message: 'Admin logged out successfully' });
  }

  async blockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      await this.blockUserUseCase.execute(userId);
      return res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async unblockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      await this.unblockUserUseCase.execute(userId);
      return res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.getUsersUseCase.execute();
      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}