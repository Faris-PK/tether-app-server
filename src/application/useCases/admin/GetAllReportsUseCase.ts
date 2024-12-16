import { ReportRepository } from "../../../infrastructure/repositories/ReportRepository";

export class GetAllReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(options: {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
  }) {
    try {
      const { page, limit, filter = 'all', search = '' } = options;
      
      const skip = (page - 1) * limit;

      // Prepare filter conditions
      let filterConditions: any = {};
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
    } catch (error) {
      throw error;
    }
  }
}