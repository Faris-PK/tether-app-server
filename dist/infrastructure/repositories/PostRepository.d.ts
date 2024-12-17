import { IPost } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
export declare class PostRepository implements IPostRepository {
    save(post: IPost): Promise<IPost>;
    findById(id: string): Promise<IPost | null>;
    findByUserId(userId: string): Promise<IPost[]>;
    findWithUserDetails(userId: string): Promise<any[]>;
    update(id: string, postData: Partial<IPost>): Promise<IPost | null>;
    delete(id: string): Promise<void>;
    likePost(postId: string, userId: string): Promise<IPost | null>;
    unlikePost(postId: string, userId: string): Promise<IPost | null>;
    isLikedByUser(postId: string, userId: string): Promise<boolean>;
    findUserPosts(userId: string): Promise<any[]>;
    findFollowingPosts(userId: string): Promise<any[]>;
    findAllRelevantPosts({ userId, page, limit }: {
        userId: string;
        page: number;
        limit: number;
    }): Promise<{
        posts: any[];
        totalPosts: number;
        totalPages: number;
    }>;
    findAllPosts(): Promise<any[]>;
    blockPost(postId: string): Promise<IPost | null>;
    unblockPost(postId: string): Promise<IPost | null>;
}
