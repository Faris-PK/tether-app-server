export interface UpdatePostDTO {
    userId: string;
    caption?: string;
    postType: 'image' | 'video' | 'note';
    location?: string;
    audience: string;
    mediarUrl:string
  }