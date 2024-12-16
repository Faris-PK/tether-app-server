import { AdminRepository } from '../../../infrastructure/repositories/AdminRepository';
import { IUser } from '../../../domain/entities/User';

export class GetUsersUseCase {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
  }> {
    return await this.adminRepository.findAllUsers(params);
  }
}