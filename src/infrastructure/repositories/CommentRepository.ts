import { Comment, IComment } from '../../domain/entities/Comment';

export class CommentRepository {
  async create(comment: Partial<IComment>): Promise<IComment> {
    const newComment = new Comment(comment);
    return await newComment.save();
  }

  async findById(commentId: string): Promise<IComment | null> {
    return await Comment.findById(commentId)
      .populate('userId', 'username profile_picture');
  }

  async findByPostId(postId: string): Promise<IComment[]> {
    return await Comment.find({ postId, isDeleted: false, parentCommentId: null })
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 });
  }

  async update(commentId: string, content: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    ).populate('userId', 'username profile_picture');
  }

  async delete(commentId: string): Promise<void> {
    await Comment.findByIdAndUpdate(commentId, { isDeleted: true });
  }

  async isCommentOwner(commentId: string, userId: string): Promise<boolean> {
    const comment = await Comment.findById(commentId);
    return comment?.userId.toString() === userId;
  }
  async findRepliesByCommentId(commentId: string): Promise<IComment[]> {
    return await Comment.find({ 
      parentCommentId: commentId, 
      isDeleted: false 
    })
    .populate('userId', 'username profile_picture')
    .sort({ createdAt: 1 });
  }
  
}