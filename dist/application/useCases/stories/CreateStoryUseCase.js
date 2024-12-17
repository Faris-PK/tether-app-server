"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStoryUseCase = void 0;
const Story_1 = require("../../../domain/entities/Story");
class CreateStoryUseCase {
    constructor(storyRepository, s3Service) {
        this.storyRepository = storyRepository;
        this.s3Service = s3Service;
    }
    async execute(storyData, file) {
        let mediaUrl;
        if (file) {
            const uploadResult = await this.s3Service.uploadFile(file, 'stories');
            mediaUrl = uploadResult.Location;
        }
        const newStory = new Story_1.Story({
            ...storyData,
            mediaUrl,
        });
        const savedStory = await this.storyRepository.save(newStory);
        return savedStory;
    }
}
exports.CreateStoryUseCase = CreateStoryUseCase;
//# sourceMappingURL=CreateStoryUseCase.js.map