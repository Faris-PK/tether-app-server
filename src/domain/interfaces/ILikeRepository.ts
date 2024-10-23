import { ILike } from '../entities/Like';

export interface ILikeRepository {
  save(like: ILike): Promise<ILike>;
  findByUserAndPost(userId: string, postId: string): Promise<ILike | null>;
  delete(id: string): Promise<boolean>;
}