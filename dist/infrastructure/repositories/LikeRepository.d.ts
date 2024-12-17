import { ILike } from '../../domain/entities/Like';
import { ILikeRepository } from '../../domain/interfaces/ILikeRepository';
export declare class LikeRepository implements ILikeRepository {
    save(like: ILike): Promise<ILike>;
    findByUserAndPost(userId: string, postId: string): Promise<ILike | null>;
    delete(id: string): Promise<boolean>;
}
