import { IReport } from '../entities/Report';
export interface IReportRepository {
    save(report: IReport): Promise<IReport>;
    findByUserAndPost(userId: string, postId: string): Promise<IReport | null>;
}
