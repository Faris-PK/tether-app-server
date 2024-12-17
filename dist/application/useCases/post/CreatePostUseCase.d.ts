import { IPost } from '../../../domain/entities/Post';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { CreatePostDTO } from '../../dto/CreatePostDTO';
export declare class CreatePostUseCase {
    private postRepository;
    private s3Service;
    constructor(postRepository: PostRepository, s3Service: S3Service);
    execute(postData: CreatePostDTO, file?: Express.Multer.File): Promise<IPost>;
}
