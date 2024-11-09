import { Types } from 'mongoose';
import { User, IUser } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { PopulatedUser } from '../../domain/types/PopulatedUser';

export class UserRepository implements IUserRepository {
  async save(user: IUser): Promise<IUser > {
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async findById(id: string): Promise<IUser | null> {
    const objectId = new Types.ObjectId(id);
    return await User.findById(objectId);
  }
  
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }

  async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  async update(id: string | Types.ObjectId, updateData: Partial<IUser>): Promise<IUser> {
    // Convert string to ObjectId if necessary
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const updatedUser = await User.findByIdAndUpdate(objectId, updateData, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async findPotentialConnections(
    userId: string,
    following: Types.ObjectId[],
    limit: number
  ): Promise<IUser[]> {
    const objectId = new Types.ObjectId(userId);
    return await User.find({
      _id: { $ne: objectId, $nin: following },
    })
      .select('username profile_picture bio createdAt')
      .limit(limit);
  }

  async getFollowers(userId: string): Promise<PopulatedUser[]> {
    const objectId = new Types.ObjectId(userId);

    const user = await User.findById(objectId)
      .populate<{ followers: PopulatedUser[] }>({
        path: 'followers',
        select: 'username profile_picture bio'
      })
      .lean();

    return user?.followers || [];
  }

  async getFollowing(userId: string): Promise<PopulatedUser[]> {
    const objectId = new Types.ObjectId(userId);

    const user = await User.findById(objectId)
      .populate<{ following: PopulatedUser[] }>({
        path: 'following',
        select: 'username profile_picture bio'
      })
      .lean();

    return user?.following || [];
  }
}
