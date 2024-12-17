"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllReportsUseCase = void 0;
class GetAllReportsUseCase {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async execute(options) {
        try {
            const { page, limit, filter = 'all', search = '' } = options;
            const skip = (page - 1) * limit;
            // Prepare filter conditions
            let filterConditions = {};
            if (filter !== 'all') {
                filterConditions.status = filter;
            }
            // Add search condition if search term is provided
            if (search) {
                filterConditions.$or = [
                    { 'postId.content': { $regex: search, $options: 'i' } },
                    { 'reportedBy.username': { $regex: search, $options: 'i' } }
                ];
            }
            // Fetch total count for pagination
            const totalReports = await this.reportRepository.countReports(filterConditions);
            // Fetch paginated and filtered reports
            const reports = await this.reportRepository.findReportsWithPagination({
                skip,
                limit,
                filterConditions
            });
            return {
                reports,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalReports / limit),
                    totalReports
                }
            };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.GetAllReportsUseCase = GetAllReportsUseCase;
//# sourceMappingURL=GetAllReportsUseCase.js.map