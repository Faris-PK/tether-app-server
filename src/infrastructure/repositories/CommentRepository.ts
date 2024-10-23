import { IComment, Comment } from '../../domain/entities/Comment';
import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';

export class CommentRepository implements ICommentRepository {
  async save(comment: IComment): Promise<IComment> {
    return await comment.save();
  }

  async findById(id: string): Promise<IComment | null> {
    return await Comment.findById(id);
  }

  async findByPostId(postId: string): Promise<IComment[]> {
    return await Comment.find({ postId }).sort({ createdAt: -1 });
  }

  async update(id: string, comment: Partial<IComment>): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(id, comment, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Comment.findByIdAndDelete(id);
    return result !== null;
  }
}