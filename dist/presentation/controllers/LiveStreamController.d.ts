import { Request, Response } from "express";
import { LiveStreamRepository } from "../../infrastructure/repositories/LiveStreamRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
export declare class LiveStreamController {
    private liveStreamRepository;
    private userRepository;
    constructor(liveStreamRepository: LiveStreamRepository, userRepository: UserRepository);
    createLiveStream(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getLiveStreams(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    joinLiveStream(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    leaveLiveStream(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
