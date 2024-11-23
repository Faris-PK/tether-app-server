import { IStory, Story } from "../../../domain/entities/Story";
import { User } from "../../../domain/entities/User";
import { StoryRepository } from "../../../infrastructure/repositories/StoryRepository";
import { S3Service } from "../../../infrastructure/services/S3Service";
import { CreateStoryDTO } from "../../dto/CreateStoryDTO";

export class CreateStoryUseCase {
    constructor(
      private storyRepository: StoryRepository,
      private s3Service: S3Service
    ) {}
  
    async execute(storyData: CreateStoryDTO, file?: Express.Multer.File): Promise<IStory> {
      let mediaUrl: string | undefined;
  
      if (file) {
        const uploadResult = await this.s3Service.uploadFile(file, 'stories');
        mediaUrl = uploadResult.Location;
      }
  
      const newStory = new Story({
        ...storyData,
        mediaUrl,
      });
  
      const savedStory = await this.storyRepository.save(newStory);
  
     
      return savedStory;
    }
  }