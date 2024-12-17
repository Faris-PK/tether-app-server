"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostUseCase = void 0;
const Post_1 = require("../../../domain/entities/Post");
const User_1 = require("../../../domain/entities/User"); // Import the User model
class CreatePostUseCase {
    constructor(postRepository, s3Service) {
        this.postRepository = postRepository;
        this.s3Service = s3Service;
    }
    async execute(postData, file) {
        let mediaUrl;
        if (file && (postData.postType === 'image' || postData.postType === 'video')) {
            const uploadResult = await this.s3Service.uploadFile(file, `posts/${postData.postType}s`);
            mediaUrl = uploadResult.Location;
        }
        else {
            // If there's no file, ensure the postType is set to 'note'
            postData.postType = 'note';
        }
        const newPost = new Post_1.Post({
            ...postData,
            mediaUrl,
        });
        const savedPost = await this.postRepository.save(newPost);
        // Update the user's post list
        const user = await User_1.User.findById(postData.userId);
        if (user) {
            user.posts.push(savedPost._id); // Explicitly cast savedPost._id to ObjectId
            await user.save(); // Save the updated user
        }
        return savedPost;
    }
}
exports.CreatePostUseCase = CreatePostUseCase;
//# sourceMappingURL=CreatePostUseCase.js.map