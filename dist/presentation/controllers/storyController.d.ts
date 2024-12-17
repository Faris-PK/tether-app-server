import { StoryRepository } from '../../infrastructure/repositories/StoryRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { Request, Response } from "express";
export declare class StoryController {
    private storyRepository;
    private s3Service;
    private spotifyService;
    private createStoryUseCase;
    constructor(storyRepository: StoryRepository, s3Service: S3Service);
    searchSpotifyTracks(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createStory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getFollowingStories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    viewStory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    toggleLike(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteStory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
