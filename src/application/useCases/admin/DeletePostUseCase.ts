import { PostRepository } from "../../../infrastructure/repositories/PostRepository";

export class DeletePostUseCase {
    constructor(private postRepository: PostRepository) {}
  
    async execute(postId: string): Promise<void> {
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      await this.postRepository.delete(postId);
    }
  }
  