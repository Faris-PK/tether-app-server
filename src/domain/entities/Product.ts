import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  userId: Types.ObjectId;
  title: string;
  price: number;
  category: string;
  location: string;
  description: string;
  images: string[];
  isBlocked: boolean;
}

const ProductSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  isBlocked: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);