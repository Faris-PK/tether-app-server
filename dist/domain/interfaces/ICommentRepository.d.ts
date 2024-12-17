import { IComment } from '../entities/Comment';
export interface ICommentRepository {
    save(comment: IComment): Promise<IComment>;
    findById(id: string): Promise<IComment | null>;
    findByPostId(postId: string): Promise<IComment[]>;
    update(id: string, comment: Partial<IComment>): Promise<IComment | null>;
    delete(id: string): Promise<boolean>;
}
