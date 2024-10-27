import { ReportRepository } from "../../../infrastructure/repositories/ReportRepository";

export class UpdateReportStatusUseCase {
    constructor(private reportRepository: ReportRepository) {}
  
    async execute(reportId: string, status: string) {
      try {
        const validStatuses = ['pending', 'reviewed', 'resolved'];
        if (!validStatuses.includes(status)) {
          throw new Error('Invalid status');
        }
        return await this.reportRepository.updateStatus(reportId, status);
      } catch (error) {
        throw error;
      }
    }
  }