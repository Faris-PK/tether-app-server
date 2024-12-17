"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRepository = void 0;
const Like_1 = require("../../domain/entities/Like");
class LikeRepository {
    async save(like) {
        return await like.save();
    }
    async findByUserAndPost(userId, postId) {
        return await Like_1.Like.findOne({ userId, postId });
    }
    async delete(id) {
        const result = await Like_1.Like.findByIdAndDelete(id);
        return result !== null;
    }
}
exports.LikeRepository = LikeRepository;
//# sourceMappingURL=LikeRepository.js.map