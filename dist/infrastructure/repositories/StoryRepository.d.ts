import { IStory } from "../../domain/entities/Story";
import { IStoryRepository } from "../../domain/interfaces/IStoryRepository";
export declare class StoryRepository implements IStoryRepository {
    save(story: IStory): Promise<IStory>;
    findById(id: string): Promise<IStory | null>;
    findByUserId(userId: string): Promise<IStory[]>;
    delete(id: string): Promise<void>;
    findFollowingStories(userId: string): Promise<IStory[]>;
    addView(storyId: string, userId: string): Promise<IStory | null>;
    toggleLike(storyId: string, userId: string): Promise<IStory | null>;
}
