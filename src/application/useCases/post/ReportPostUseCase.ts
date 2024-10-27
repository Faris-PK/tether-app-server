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

    // Create report
    const report = await this.reportRepository.create({
      postId,
      reportedBy: userId,
      reason
    });

    // If post gets reported multiple times, you might want to automatically block it
    // const reports = await this.reportRepository.findByPostId(postId);
    // if (reports.length >= 5) { // You can adjust this threshold
    //   await this.postRepository.blockPost(postId);
    // }

    return report;
  }
}