"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyService = void 0;
const axios_1 = __importDefault(require("axios"));
class SpotifyService {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
    }
    async getAccessToken() {
        try {
            const tokenResponse = await axios_1.default.post('https://accounts.spotify.com/api/token', null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
                },
                params: {
                    grant_type: 'client_credentials'
                }
            });
            return tokenResponse.data.access_token;
        }
        catch (error) {
            console.error('Spotify access token error:', error);
            throw new Error('Failed to obtain Spotify access token');
        }
    }
    async searchTracks(params) {
        try {
            const accessToken = await this.getAccessToken();
            const searchResponse = await axios_1.default.get('https://api.spotify.com/v1/search', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    q: params.query,
                    type: params.type || 'track',
                    limit: params.limit || 10
                }
            });
            return searchResponse.data;
        }
        catch (error) {
            console.error('Spotify search error:', error);
            throw new Error('Failed to search Spotify');
        }
    }
}
exports.SpotifyService = SpotifyService;
//# sourceMappingURL=SpotifyService.js.map