import { AdminRepository } from '../../../infrastructure/repositories/AdminRepository';
import { IPost } from '../../../domain/entities/Post';

export class GetPostsUseCase {
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
    posts: IPost[];
    totalPosts: number;
    totalPages: number;
  }> {
    return await this.adminRepository.findAllPosts(params);
  }
}