"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveStreamRepository = void 0;
const LiveStream_1 = require("../../domain/entities/LiveStream");
const User_1 = require("../../domain/entities/User");
class LiveStreamRepository {
    async create(liveStreamData) {
        const liveStream = new LiveStream_1.LiveStream(liveStreamData);
        return await liveStream.save();
    }
    async getActiveLiveStreams(userId) {
        // Find the user and get their following list
        const user = await User_1.User.findById(userId).select("following");
        if (!user)
            return [];
        // Find active live streams from followed users
        return await LiveStream_1.LiveStream.find({
            host: { $in: user.following },
            isActive: true
        })
            .populate('host', 'username profile_picture')
            .sort({ startedAt: -1 });
    }
    async findById(liveStreamId) {
        return await LiveStream_1.LiveStream.findById(liveStreamId)
            .populate('host', 'username profile_picture')
            .populate('viewers', 'username profile_picture');
    }
    async joinLiveStream(liveStreamId, userId) {
        return await LiveStream_1.LiveStream.findByIdAndUpdate(liveStreamId, { $addToSet: { viewers: userId } }, { new: true });
    }
    async leaveLiveStream(liveStreamId, userId) {
        const liveStream = await LiveStream_1.LiveStream.findById(liveStreamId);
        if (!liveStream)
            return null;
        // If host leaves, end the live stream
        if (liveStream.host.toString() === userId) {
            liveStream.isActive = false;
            liveStream.endedAt = new Date();
            return await liveStream.save();
        }
        // Remove viewer if not the host
        return await LiveStream_1.LiveStream.findByIdAndUpdate(liveStreamId, { $pull: { viewers: userId } }, { new: true });
    }
}
exports.LiveStreamRepository = LiveStreamRepository;
//# sourceMappingURL=LiveStreamRepository.js.map