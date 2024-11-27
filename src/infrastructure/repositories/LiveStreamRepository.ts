import { LiveStream, ILiveStream } from "../../domain/entities/LiveStream";
import { User } from "../../domain/entities/User";

export class LiveStreamRepository {
    async create(liveStreamData: Partial<ILiveStream>): Promise<ILiveStream> {
        const liveStream = new LiveStream(liveStreamData);
        return await liveStream.save();
    }

    async getActiveLiveStreams(userId: string): Promise<ILiveStream[]> {
        // Find the user and get their following list
        const user = await User.findById(userId).select("following");
        if (!user) return [];

        // Find active live streams from followed users
        return await LiveStream.find({
            host: { $in: user.following },
            isActive: true
        })
        .populate('host', 'username profile_picture')
        .sort({ startedAt: -1 });
    }

    async findById(liveStreamId: string): Promise<ILiveStream | null> {
        return await LiveStream.findById(liveStreamId)
            .populate('host', 'username profile_picture')
            .populate('viewers', 'username profile_picture');
    }

    async joinLiveStream(liveStreamId: string, userId: string): Promise<ILiveStream | null> {
        return await LiveStream.findByIdAndUpdate(
            liveStreamId,
            { $addToSet: { viewers: userId } },
            { new: true }
        );
    }

    async leaveLiveStream(liveStreamId: string, userId: string): Promise<ILiveStream | null> {
        const liveStream = await LiveStream.findById(liveStreamId);
        
        if (!liveStream) return null;

        // If host leaves, end the live stream
        if (liveStream.host.toString() === userId) {
            liveStream.isActive = false;
            liveStream.endedAt = new Date();
            return await liveStream.save();
        }

        // Remove viewer if not the host
        return await LiveStream.findByIdAndUpdate(
            liveStreamId,
            { $pull: { viewers: userId } },
            { new: true }
        );
    }
}