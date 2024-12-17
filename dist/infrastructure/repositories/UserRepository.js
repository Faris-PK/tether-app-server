"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mongoose_1 = require("mongoose");
const User_1 = require("../../domain/entities/User");
class UserRepository {
    async save(user) {
        return await user.save();
    }
    async findByEmail(email) {
        return await User_1.User.findOne({ email });
    }
    async findByUsername(username) {
        return await User_1.User.findOne({ username });
    }
    async findById(id) {
        const objectId = new mongoose_1.Types.ObjectId(id);
        return await User_1.User.findById(objectId);
    }
    async findByGoogleId(googleId) {
        return await User_1.User.findOne({ googleId });
    }
    async findAll() {
        return await User_1.User.find();
    }
    async update(id, updateData) {
        // Convert string to ObjectId if necessary
        const objectId = typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
        const updatedUser = await User_1.User.findByIdAndUpdate(objectId, updateData, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    async findPotentialConnections(userId, following, limit) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        return await User_1.User.find({
            _id: { $ne: objectId, $nin: following },
        })
            .select('username profile_picture bio createdAt premium_status')
            .limit(limit);
    }
    async getFollowers(userId) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        const user = await User_1.User.findById(objectId)
            .populate({
            path: 'followers',
            select: 'username profile_picture bio'
        })
            .lean();
        return (user === null || user === void 0 ? void 0 : user.followers) || [];
    }
    async getFollowing(userId) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        const user = await User_1.User.findById(objectId)
            .populate({
            path: 'following',
            select: 'username profile_picture bio'
        })
            .lean();
        return (user === null || user === void 0 ? void 0 : user.following) || [];
    }
    async searchUsers({ page = 1, limit = 8, searchTerm } = {}) {
        const query = User_1.User.find();
        // Search filter for username and email
        if (searchTerm) {
            query.find({
                $or: [
                    { username: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        }
        const skip = (page - 1) * limit;
        // Execute query with pagination
        const [users, totalUsers] = await Promise.all([
            query
                .select('username email profile_picture bio premium_status') // Select only necessary fields
                .skip(skip)
                .limit(limit)
                .lean(),
            User_1.User.countDocuments(query.getFilter())
        ]);
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            users,
            totalUsers,
            totalPages
        };
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map