import { Router } from 'express';
import { StoryController } from '../controllers/storyController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';
import { StoryRepository } from '../../infrastructure/repositories/StoryRepository';
import { S3Service } from '../../infrastructure/services/S3Service';


const storyRepository = new StoryRepository();
const s3Service = new S3Service();

const storyController = new StoryController(storyRepository, s3Service);

const storyRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });


storyRouter.get('/spotify/search', authMiddleware, (req, res) =>  storyController.searchSpotifyTracks(req, res) );
storyRouter.post('/create', authMiddleware, upload.single('file'), (req, res) => storyController.createStory(req, res));
storyRouter.get('/', authMiddleware, (req, res) => storyController.getFollowingStories(req, res));
storyRouter.post('/view/:storyId', authMiddleware, (req, res) => storyController.viewStory(req, res));

storyRouter.post('/like/:storyId', authMiddleware, (req, res) => storyController.toggleLike(req, res));
storyRouter.delete('/delete/:storyId', authMiddleware, (req, res) => storyController.deleteStory(req, res));



export default storyRouter;      