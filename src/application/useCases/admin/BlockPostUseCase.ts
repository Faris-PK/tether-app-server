import { PostRepository } from "../../../infrastructure/repositories/PostRepository";

export class BlockPostUseCase {
    constructor(private postRepository: PostRepository) {}
  
    async execute(postId: string) {
      const post = await this.postRepository.blockPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    }
  }