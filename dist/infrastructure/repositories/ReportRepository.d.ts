import { IReport } from '../../domain/entities/Report';
export declare class ReportRepository {
    create(reportData: {
        postId: string;
        reportedBy: string;
        reason: string;
    }): Promise<IReport>;
    findByPostId(postId: string): Promise<IReport[]>;
    findByUser(userId: string): Promise<IReport[]>;
    findByPostAndUser(postId: string, userId: string): Promise<IReport | null>;
    findAllWithDetails(): Promise<IReport[]>;
    findByStatus(status: string): Promise<IReport[]>;
    updateStatus(reportId: string, status: string): Promise<IReport | null>;
    countReports(filterConditions?: any): Promise<number>;
    findReportsWithPagination(options: {
        skip: number;
        limit: number;
        filterConditions?: any;
    }): Promise<IReport[]>;
}
