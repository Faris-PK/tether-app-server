import { ILiveStream } from "../../domain/entities/LiveStream";
export declare class LiveStreamRepository {
    create(liveStreamData: Partial<ILiveStream>): Promise<ILiveStream>;
    getActiveLiveStreams(userId: string): Promise<ILiveStream[]>;
    findById(liveStreamId: string): Promise<ILiveStream | null>;
    joinLiveStream(liveStreamId: string, userId: string): Promise<ILiveStream | null>;
    leaveLiveStream(liveStreamId: string, userId: string): Promise<ILiveStream | null>;
}
