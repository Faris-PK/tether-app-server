import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
export declare class DeletePostUseCase {
    private postRepository;
    private s3Service;
    private userRepository;
    constructor(postRepository: PostRepository, s3Service: S3Service, userRepository: UserRepository);
    execute(postId: string, userId: string): Promise<void>;
}
