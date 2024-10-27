import { PostRepository } from "../../../infrastructure/repositories/PostRepository";

export class GetPostsUseCase {
    constructor(private postRepository: PostRepository) {}
  
    async execute() {
      const posts = await this.postRepository.findAllPosts();
      return posts.map(post => ({
        ...post,
        comments: post.comments?.length || 0,
        likes: post.likes?.length || 0
      }));
    }
  }