"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserBlockedMiddleware = void 0;
const User_1 = require("../../domain/entities/User");
const checkUserBlockedMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked' });
        }
        next();
    }
    catch (error) {
        console.error('Error in checkUserBlockedMiddleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.checkUserBlockedMiddleware = checkUserBlockedMiddleware;
//# sourceMappingURL=checkUserBlockedMiddleware.js.map