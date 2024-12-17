export declare class SpotifyService {
    private clientId;
    private clientSecret;
    constructor();
    getAccessToken(): Promise<string>;
    searchTracks(params: {
        query: string;
        type?: string;
        limit?: number;
    }): Promise<any>;
}
