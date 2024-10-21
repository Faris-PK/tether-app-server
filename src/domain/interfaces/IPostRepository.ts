import { IPost } from '../entities/Post';

export interface IPostRepository {
  save(post: IPost): Promise<IPost>;
  findById(id: string): Promise<IPost | null>;
  findByUserId(userId: string): Promise<IPost[]>;
  update(id: string, postData: Partial<IPost>): Promise<IPost | null>;
  delete(id: string): Promise<void>;  
  likePost(postId: string, userId: string): Promise<IPost | null>;  
  unlikePost(postId: string, userId: string): Promise<IPost | null>;
  isLikedByUser(postId: string, userId: string): Promise<boolean>;  
  findWithUserDetails(userId: string): Promise<any[]>;  
}
