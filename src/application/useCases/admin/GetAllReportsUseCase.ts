import { ReportRepository } from "../../../infrastructure/repositories/ReportRepository";

export class GetAllReportsUseCase {
    constructor(private reportRepository: ReportRepository) {}
  
    async execute(filter?: string) {
      try {
        if (filter && filter !== 'all') {
          return await this.reportRepository.findByStatus(filter);
        }
        return await this.reportRepository.findAllWithDetails();
      } catch (error) {
        throw error;
      }
    }
  }