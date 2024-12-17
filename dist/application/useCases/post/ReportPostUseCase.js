"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPostUseCase = void 0;
class ReportPostUseCase {
    constructor(reportRepository, postRepository) {
        this.reportRepository = reportRepository;
        this.postRepository = postRepository;
    }
    async execute(postId, userId, reason) {
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
exports.ReportPostUseCase = ReportPostUseCase;
//# sourceMappingURL=ReportPostUseCase.js.map