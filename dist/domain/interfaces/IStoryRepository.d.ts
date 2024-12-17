import { IStory } from "../../domain/entities/Story";
export interface IStoryRepository {
    save(story: IStory): Promise<IStory>;
    findById(id: string): Promise<IStory | null>;
    findByUserId(userId: string): Promise<IStory[]>;
    delete(id: string): Promise<void>;
    findFollowingStories(userId: string): Promise<IStory[]>;
    addView(storyId: string, userId: string): Promise<IStory | null>;
}
