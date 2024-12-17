"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReportStatusUseCase = void 0;
class UpdateReportStatusUseCase {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async execute(reportId, status) {
        try {
            const validStatuses = ['pending', 'reviewed', 'resolved'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid status');
            }
            return await this.reportRepository.updateStatus(reportId, status);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UpdateReportStatusUseCase = UpdateReportStatusUseCase;
//# sourceMappingURL=UpdateReportStatusUseCase.js.map