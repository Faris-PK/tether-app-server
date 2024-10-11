import { IUser } from '../entities/User';

export interface IUserRepository {
  save(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
}