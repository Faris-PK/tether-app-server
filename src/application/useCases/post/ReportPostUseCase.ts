import { ReportRepository } from '../../../infrastructure/repositories/ReportRepository';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';

export class ReportPostUseCase {
  constructor(
    private reportRepository: ReportRepository,
    private postRepository: PostRepository
  ) {}

  async execute(postId: string, userId: string, reason: string) {
    // Check if post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const existingReport = await this.reportRepository.findByPostAndUser(postId, userId);
    if (existingReport) {
      throw new Error('You have already reported this post');
    }

    // Create report
    const report = await this.reportRepository.create({
      postId,
      reportedBy: userId,
      reason
    });



    return report;
  }
}