import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  stripeCustomerId: string;
  createdAt: any;
  username: string;
  email: string;
  password: string;
  mobile: string;
  googleId?: string;
  isBlocked: boolean;
  bio?: string;
  profile_picture?: string;
  cover_photo?: string;
  premium_status: boolean;
  userLocation: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  premium_expiration?: Date;
  dob?: Date; 
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  posts: Types.ObjectId[];
  social_links?: string[];
  blocked_users: Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true },
  mobile: { type: String, unique: false },
  isBlocked: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  userLocation: {
    name: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  profile_picture: { type: String, default: 'https://www.trendycovers.com/default_propic.jpg' },  
  cover_photo: { type: String, default: 'https://notepd.s3.amazonaws.com/default-cover.png' },     
  premium_status: { type: Boolean, default: false },
  premium_expiration: { type: Date },
  dob: { type: Date }, 
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  social_links: [{ type: String }],
  blocked_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  stripeCustomerId: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
