import { Router } from 'express';
import { LiveStreamController } from '../controllers/LiveStreamController'; 
import { authMiddleware } from '../middleware/authMiddleware';
import { LiveStreamRepository } from '../../infrastructure/repositories/LiveStreamRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const liveStreamRepository = new LiveStreamRepository();
const userRepository = new UserRepository();

const liveStreamController = new LiveStreamController(
  liveStreamRepository, 
  userRepository
);

const liveStreamRouter = Router();

// Create a new live stream
liveStreamRouter.post(
  '/create', 
  authMiddleware, 
  (req, res) => liveStreamController.createLiveStream(req, res)
);

// Get active live streams
liveStreamRouter.get(
  '/', 
  authMiddleware, 
  (req, res) => liveStreamController.getLiveStreams(req, res)
);

// Join a live stream
liveStreamRouter.post(
  '/:liveStreamId/join', 
  authMiddleware, 
  (req, res) => liveStreamController.joinLiveStream(req, res)
);

// Leave a live stream
liveStreamRouter.post(
  '/:liveStreamId/leave', 
  authMiddleware, 
  (req, res) => liveStreamController.leaveLiveStream(req, res)
);

export default liveStreamRouter;