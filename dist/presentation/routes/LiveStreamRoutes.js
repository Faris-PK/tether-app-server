"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LiveStreamController_1 = require("../controllers/LiveStreamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const LiveStreamRepository_1 = require("../../infrastructure/repositories/LiveStreamRepository");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const liveStreamRepository = new LiveStreamRepository_1.LiveStreamRepository();
const userRepository = new UserRepository_1.UserRepository();
const liveStreamController = new LiveStreamController_1.LiveStreamController(liveStreamRepository, userRepository);
const liveStreamRouter = (0, express_1.Router)();
// Create a new live stream
liveStreamRouter.post('/create', authMiddleware_1.authMiddleware, (req, res) => liveStreamController.createLiveStream(req, res));
// Get active live streams
liveStreamRouter.get('/', authMiddleware_1.authMiddleware, (req, res) => liveStreamController.getLiveStreams(req, res));
// Join a live stream
liveStreamRouter.post('/:liveStreamId/join', authMiddleware_1.authMiddleware, (req, res) => liveStreamController.joinLiveStream(req, res));
// Leave a live stream
liveStreamRouter.post('/:liveStreamId/leave', authMiddleware_1.authMiddleware, (req, res) => liveStreamController.leaveLiveStream(req, res));
exports.default = liveStreamRouter;
//# sourceMappingURL=LiveStreamRoutes.js.map