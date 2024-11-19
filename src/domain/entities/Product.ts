import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  userId: Types.ObjectId;
  title: string;
  price: number;
  category: string;
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  images: string[];
  isBlocked: boolean;
  isPromoted: boolean;
  promotionExpiry: Date | null;
  isApproved: boolean;
}

const ProductSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  isBlocked: { type: Boolean, default: false },
  isPromoted: { type: Boolean, default: false },
  promotionExpiry: { type: Date, default: null },
  isApproved: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);