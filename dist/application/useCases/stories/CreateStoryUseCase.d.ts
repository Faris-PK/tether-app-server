import { IStory } from "../../../domain/entities/Story";
import { StoryRepository } from "../../../infrastructure/repositories/StoryRepository";
import { S3Service } from "../../../infrastructure/services/S3Service";
import { CreateStoryDTO } from "../../dto/CreateStoryDTO";
export declare class CreateStoryUseCase {
    private storyRepository;
    private s3Service;
    constructor(storyRepository: StoryRepository, s3Service: S3Service);
    execute(storyData: CreateStoryDTO, file?: Express.Multer.File): Promise<IStory>;
}
