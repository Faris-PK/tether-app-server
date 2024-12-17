"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveStreamController = void 0;
class LiveStreamController {
    constructor(liveStreamRepository, userRepository) {
        this.liveStreamRepository = liveStreamRepository;
        this.userRepository = userRepository;
    }
    async createLiveStream(req, res) {
        try {
            const { userId, roomId } = req.body;
            // Verify user exists
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }
            // Create live stream
            const liveStream = await this.liveStreamRepository.create({
                host: userId,
                roomId,
                isActive: true
            });
            return res.status(201).json(liveStream);
        }
        catch (error) {
            console.error('Error creating live stream:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create live stream'
            });
        }
    }
    async getLiveStreams(req, res) {
        try {
            const userId = req.userId;
            // Get active live streams from followed users
            const liveStreams = await this.liveStreamRepository.getActiveLiveStreams(userId !== null && userId !== void 0 ? userId : "");
            return res.status(200).json({
                status: 'success',
                data: liveStreams
            });
        }
        catch (error) {
            console.error('Error fetching live streams:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch live streams'
            });
        }
    }
    async joinLiveStream(req, res) {
        try {
            const { liveStreamId } = req.params;
            const userId = req.userId;
            const liveStream = await this.liveStreamRepository.joinLiveStream(liveStreamId, userId !== null && userId !== void 0 ? userId : "");
            return res.status(200).json(liveStream);
        }
        catch (error) {
            console.error('Error joining live stream:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to join live stream'
            });
        }
    }
    async leaveLiveStream(req, res) {
        try {
            const { liveStreamId } = req.params;
            const userId = req.userId;
            const liveStream = await this.liveStreamRepository.leaveLiveStream(liveStreamId, userId !== null && userId !== void 0 ? userId : "");
            return res.status(200).json(liveStream);
        }
        catch (error) {
            console.error('Error leaving live stream:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to leave live stream'
            });
        }
    }
}
exports.LiveStreamController = LiveStreamController;
//# sourceMappingURL=LiveStreamController.js.map