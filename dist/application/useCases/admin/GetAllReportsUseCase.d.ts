import { ReportRepository } from "../../../infrastructure/repositories/ReportRepository";
export declare class GetAllReportsUseCase {
    private reportRepository;
    constructor(reportRepository: ReportRepository);
    execute(options: {
        page: number;
        limit: number;
        filter?: string;
        search?: string;
    }): Promise<{
        reports: import("../../../domain/entities/Report").IReport[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalReports: number;
        };
    }>;
}
