import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import {UpdateUserProfileDTO} from '../../dto/UpdateUserProfileDTO'
import { IUser } from '../../../domain/entities/User';

export class UpdateUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, updateData: UpdateUserProfileDTO): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user fields
    const updatedUSer = Object.assign(user, updateData);
  //  console.log('updatedUSer : ', updatedUSer);
  
    await this.userRepository.save(user);
    return user;
  }
}  