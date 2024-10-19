export interface CreatePostDTO {
  userId: string;
  caption: string;
  postType: 'image' | 'video' | 'note';
  location?: string;
  audience: string;
}