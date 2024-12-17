"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }],
    social_links: [{ type: String }],
    blocked_users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    stripeCustomerId: { type: String },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map