import { ILike, Like } from '../../domain/entities/Like';
import { ILikeRepository } from '../../domain/interfaces/ILikeRepository';

export class LikeRepository implements ILikeRepository {
  async save(like: ILike): Promise<ILike> {
    return await like.save();
  }

  async findByUserAndPost(userId: string, postId: string): Promise<ILike | null> {
    return await Like.findOne({ userId, postId });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Like.findByIdAndDelete(id);
    return result !== null;
  }
}
