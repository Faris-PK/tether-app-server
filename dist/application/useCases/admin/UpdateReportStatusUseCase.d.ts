import { ReportRepository } from "../../../infrastructure/repositories/ReportRepository";
export declare class UpdateReportStatusUseCase {
    private reportRepository;
    constructor(reportRepository: ReportRepository);
    execute(reportId: string, status: string): Promise<import("../../../domain/entities/Report").IReport | null>;
}
