import { CreateStoryDTO } from '../../application/dto/CreateStoryDTO';
import { CreateStoryUseCase } from '../../application/useCases/stories/CreateStoryUseCase';
import { StoryRepository } from '../../infrastructure/repositories/StoryRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { SpotifyService } from '../../infrastructure/services/SpotifyService';
import { Request, Response } from "express";


export class StoryController {
    private spotifyService: SpotifyService;
    private createStoryUseCase: CreateStoryUseCase;

    constructor(
      private storyRepository: StoryRepository,
      private s3Service: S3Service
    ) {

        this.spotifyService = new SpotifyService(); 
        this.createStoryUseCase = new CreateStoryUseCase(storyRepository, s3Service);
 
    }

    async searchSpotifyTracks(req: Request, res: Response) {
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
            type: type as string,
            limit: limit ? parseInt(limit as string) : undefined
          });

          return res.status(200).json({ status: 'success', data: result });
        } catch (error) {
          console.error('Spotify search error:', error);
          return res.status(500).json({ 
            status: 'error', 
            message: 'Failed to search Spotify tracks' 
          });
        }
      }

      async createStory(req: Request, res: Response) {
        try {
          const userId = req.userId;
          const file = req.file;
          const { caption, musicTrackId, musicPreviewUrl, musicName } = req.body;
          console.log('triggeres');
          
    
          if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
          }
    
          const storyData: CreateStoryDTO = {
            userId,
            caption,
            musicTrackId,
            musicPreviewUrl,
            musicName
          };
    
          const newStory = await this.createStoryUseCase.execute(storyData, file);
          return res.status(201).json(newStory);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }


      async getFollowingStories(req: Request, res: Response) {
        try {
          const userId = req.userId;
          const stories = await this.storyRepository.findFollowingStories(userId??'');
          return res.status(200).json({ status: 'success', data: stories });
        } catch (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch stories'
          });
        }
      }
    
      async viewStory(req: Request, res: Response) {
        try {
          const { storyId } = req.params;
          const userId = req.userId;
    
          const story = await this.storyRepository.addView(storyId, userId??'');
          return res.status(200).json({ status: 'success', data: story });
        } catch (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Failed to mark story as viewed'
          });
        }
      }

      async toggleLike(req: Request, res: Response) {
        try {
          const { storyId } = req.params;
          const userId = req.userId;
    
          const story = await this.storyRepository.toggleLike(storyId, userId??'');
          return res.status(200).json({ status: 'success', data: story });
        } catch (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Failed to toggle story like'
          });
        }
      }
      
      async deleteStory(req: Request, res: Response) {
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
        } catch (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Failed to delete story'
          });
        }
      }
      
      
}