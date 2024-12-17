"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storyController_1 = require("../controllers/storyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const StoryRepository_1 = require("../../infrastructure/repositories/StoryRepository");
const S3Service_1 = require("../../infrastructure/services/S3Service");
const storyRepository = new StoryRepository_1.StoryRepository();
const s3Service = new S3Service_1.S3Service();
const storyController = new storyController_1.StoryController(storyRepository, s3Service);
const storyRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
storyRouter.get('/spotify/search', authMiddleware_1.authMiddleware, (req, res) => storyController.searchSpotifyTracks(req, res));
storyRouter.post('/create', authMiddleware_1.authMiddleware, upload.single('file'), (req, res) => storyController.createStory(req, res));
storyRouter.get('/', authMiddleware_1.authMiddleware, (req, res) => storyController.getFollowingStories(req, res));
storyRouter.post('/view/:storyId', authMiddleware_1.authMiddleware, (req, res) => storyController.viewStory(req, res));
storyRouter.post('/like/:storyId', authMiddleware_1.authMiddleware, (req, res) => storyController.toggleLike(req, res));
storyRouter.delete('/delete/:storyId', authMiddleware_1.authMiddleware, (req, res) => storyController.deleteStory(req, res));
exports.default = storyRouter;
//# sourceMappingURL=storyRoutes.js.map