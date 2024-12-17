import { ReportRepository } from '../../../infrastructure/repositories/ReportRepository';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
export declare class ReportPostUseCase {
    private reportRepository;
    private postRepository;
    constructor(reportRepository: ReportRepository, postRepository: PostRepository);
    execute(postId: string, userId: string, reason: string): Promise<import("../../../domain/entities/Report").IReport>;
}
