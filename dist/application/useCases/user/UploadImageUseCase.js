"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadImageUseCase = void 0;
class UploadImageUseCase {
    constructor(userRepository, s3Service) {
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }
    async execute(userId, file, type) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const uploadResult = await this.s3Service.uploadFile(file);
        if (type === 'profile') {
            user.profile_picture = uploadResult.Location;
        }
        else {
            user.cover_photo = uploadResult.Location;
        }
        await this.userRepository.save(user);
        return user;
    }
}
exports.UploadImageUseCase = UploadImageUseCase;
//# sourceMappingURL=UploadImageUseCase.js.map