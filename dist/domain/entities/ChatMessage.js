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
exports.Chat = exports.Message = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    fileUrl: { type: String },
    fileType: { type: String, enum: ['image', 'video'] },
    read: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    replyTo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });
const ChatSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });
exports.Message = mongoose_1.default.model('Message', MessageSchema);
exports.Chat = mongoose_1.default.model('Chat', ChatSchema);
//# sourceMappingURL=ChatMessage.js.map