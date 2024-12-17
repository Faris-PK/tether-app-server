"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const CreateStoryUseCase_1 = require("../../application/useCases/stories/CreateStoryUseCase");
const SpotifyService_1 = require("../../infrastructure/services/SpotifyService");
class StoryController {
    constructor(storyRepository, s3Service) {
        this.storyRepository = storyRepository;
        this.s3Service = s3Service;
        this.spotifyService = new SpotifyService_1.SpotifyService();
        this.createStoryUseCase = new CreateStoryUseCase_1.CreateStoryUseCase(storyRepository, s3Service);
    }
    async searchSpotifyTracks(req, res) {
        try {
            const { query, type, limit } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search query is required'
                });
            }
            const result = await this.spotifyService.searchTracks({
                query,
                type: type,
                limit: limit ? parseInt(limit) : undefined
            });
            return res.status(200).json({ status: 'success', data: result });
        }
        catch (error) {
            console.error('Spotify search error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to search Spotify tracks'
            });
        }
    }
    async createStory(req, res) {
        try {
            const userId = req.userId;
            const file = req.file;
            const { caption, musicTrackId, musicPreviewUrl, musicName } = req.body;
            console.log('triggeres');
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const storyData = {
                userId,
                caption,
                musicTrackId,
                musicPreviewUrl,
                musicName
            };
            const newStory = await this.createStoryUseCase.execute(storyData, file);
            return res.status(201).json(newStory);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getFollowingStories(req, res) {
        try {
            const userId = req.userId;
            const stories = await this.storyRepository.findFollowingStories(userId !== null && userId !== void 0 ? userId : '');
            return res.status(200).json({ status: 'success', data: stories });
        }
        catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch stories'
            });
        }
    }
    async viewStory(req, res) {
        try {
            const { storyId } = req.params;
            const userId = req.userId;
            const story = await this.storyRepository.addView(storyId, userId !== null && userId !== void 0 ? userId : '');
            return res.status(200).json({ status: 'success', data: story });
        }
        catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to mark story as viewed'
            });
        }
    }
    async toggleLike(req, res) {
        try {
            const { storyId } = req.params;
            const userId = req.userId;
            const story = await this.storyRepository.toggleLike(storyId, userId !== null && userId !== void 0 ? userId : '');
            return res.status(200).json({ status: 'success', data: story });
        }
        catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to toggle story like'
            });
        }
    }
    async deleteStory(req, res) {
        try {
            const { storyId } = req.params;
            const userId = req.userId;
            // Find the story
            const story = await this.storyRepository.findById(storyId);
            if (!story) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Story not found'
                });
            }
            // Check if the user owns the story
            if (story.userId.toString() !== userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Unauthorized to delete this story'
                });
            }
            // Delete the story
            await this.storyRepository.delete(storyId);
            return res.status(200).json({
                status: 'success',
                message: 'Story deleted successfully'
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete story'
            });
        }
    }
}
exports.StoryController = StoryController;
//# sourceMappingURL=storyController.js.map