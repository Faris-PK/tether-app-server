"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const Report_1 = require("../../domain/entities/Report");
class ReportRepository {
    async create(reportData) {
        const report = new Report_1.Report(reportData);
        return await report.save();
    }
    async findByPostId(postId) {
        return await Report_1.Report.find({ postId })
            .populate('reportedBy', 'username')
            .sort({ createdAt: -1 });
    }
    async findByUser(userId) {
        return await Report_1.Report.find({ reportedBy: userId })
            .populate('postId')
            .sort({ createdAt: -1 });
    }
    async findByPostAndUser(postId, userId) {
        return await Report_1.Report.findOne({
            postId,
            reportedBy: userId
        });
    }
    async findAllWithDetails() {
        return await Report_1.Report.find()
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
    async findByStatus(status) {
        return await Report_1.Report.find({ status })
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
    async updateStatus(reportId, status) {
        return await Report_1.Report.findByIdAndUpdate(reportId, { status }, { new: true }).populate([
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
    async countReports(filterConditions = {}) {
        return await Report_1.Report.countDocuments(filterConditions);
    }
    async findReportsWithPagination(options) {
        const { skip, limit, filterConditions = {} } = options;
        return await Report_1.Report.find(filterConditions)
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
exports.ReportRepository = ReportRepository;
//# sourceMappingURL=ReportRepository.js.map