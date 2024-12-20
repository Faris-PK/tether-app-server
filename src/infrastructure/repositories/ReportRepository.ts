import { Report, IReport } from '../../domain/entities/Report';

export class ReportRepository {
  async create(reportData: {
    postId: string;
    reportedBy: string;
    reason: string;
  }): Promise<IReport> {
    const report = new Report(reportData);
    return await report.save();
  }

  async findByPostId(postId: string): Promise<IReport[]> {
    return await Report.find({ postId })
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });
  }

  async findByUser(userId: string): Promise<IReport[]> {
    return await Report.find({ reportedBy: userId })
      .populate('postId')
      .sort({ createdAt: -1 });
  }
  async findByPostAndUser(postId: string, userId: string): Promise<IReport | null> {
    return await Report.findOne({
      postId,
      reportedBy: userId
    });
  }

  async findAllWithDetails(): Promise<IReport[]> {
    return await Report.find()
      .populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username profile_picture'
        }
      })
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });
  }

  async findByStatus(status: string): Promise<IReport[]> {
    return await Report.find({ status })
      .populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username profile_picture'
        }
      })
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });
  }

  async updateStatus(reportId: string, status: string): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    ).populate([
      {
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username profile_picture'
        }
      },
      { path: 'reportedBy', select: 'username' }
    ]);
  }

  async countReports(filterConditions: any = {}): Promise<number> {
    return await Report.countDocuments(filterConditions);
  }

  async findReportsWithPagination(options: {
    skip: number;
    limit: number;
    filterConditions?: any;
  }): Promise<IReport[]> {
    const { skip, limit, filterConditions = {} } = options;

    return await Report.find(filterConditions)
      .populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username profile_picture'
        }
      })
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }
}