import { IReport, Report } from '../../domain/entities/Report';
import { IReportRepository } from '../../domain/interfaces/IReportRepository';

export class ReportRepository implements IReportRepository {
  async save(report: IReport): Promise<IReport> {
    return await report.save();
  }

  async findByUserAndPost(userId: string, postId: string): Promise<IReport | null> {
    return await Report.findOne({ userId, postId });
  }
}