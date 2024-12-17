import { IComment } from '../../domain/entities/Comment';
export declare class CommentRepository {
    create(comment: Partial<IComment>): Promise<IComment>;
    findById(commentId: string): Promise<IComment | null>;
    findByPostId(postId: string): Promise<IComment[]>;
    update(commentId: string, content: string): Promise<IComment | null>;
    delete(commentId: string): Promise<void>;
    isCommentOwner(commentId: string, userId: string): Promise<boolean>;
    findRepliesByCommentId(commentId: string): Promise<IComment[]>;
}
