import { PostRepository } from "../../../infrastructure/repositories/PostRepository";

export class UnblockPostUseCase {
    constructor(private postRepository: PostRepository) {}
  
    async execute(postId: string) {
      const post = await this.postRepository.unblockPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    }
  }