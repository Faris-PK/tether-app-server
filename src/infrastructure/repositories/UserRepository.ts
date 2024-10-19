import { User, IUser } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async save(user: IUser): Promise<IUser> {
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
  
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }

  async findAll(): Promise<IUser[]> {
    return await User.find();
  }
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
 
  
}