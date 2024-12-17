"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostUseCase = void 0;
class DeletePostUseCase {
    constructor(postRepository, s3Service, userRepository) {
        this.postRepository = postRepository;
        this.s3Service = s3Service;
        this.userRepository = userRepository;
    }
    async execute(postId, userId) {
        const existingPost = await this.postRepository.findById(postId);
        // console.log('existingPost : ', existingPost);
        if (!existingPost) {
            console.log('error  : 1 ');
            throw new Error('Post not found');
        }
        if (existingPost.userId._id.toString() !== userId) {
            console.log('error : 2');
            throw new Error('Unauthorized to delete this post');
        }
        // Delete associated file if it exists
        if (existingPost.mediaUrl) {
            await this.s3Service.deleteFile(existingPost.mediaUrl);
        }
        // Delete the post
        await this.postRepository.delete(postId);
        // Remove the post ID from the user's posts array
        const user = await this.userRepository.findById(userId);
        console.log('user for deleting the post: ', user);
        if (user) {
            user.posts = user.posts.filter((id) => id.toString() !== postId);
            await this.userRepository.save(user);
        }
    }
}
exports.DeletePostUseCase = DeletePostUseCase;
//# sourceMappingURL=DeletePostUseCase.js.map