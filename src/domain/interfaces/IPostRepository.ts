import { IPost } from '../entities/Post';

export interface IPostRepository {
  save(post: IPost): Promise<IPost>;
  findById(id: string): Promise<IPost | null>;
  findByUserId(userId: string): Promise<IPost[]>;
  update(id: string, postData: Partial<IPost>): Promise<IPost | null>;
}