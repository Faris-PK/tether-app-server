"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsUseCase = void 0;
class GetPostsUseCase {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async execute(params) {
        return await this.adminRepository.findAllPosts(params);
    }
}
exports.GetPostsUseCase = GetPostsUseCase;
//# sourceMappingURL=GetPostsUseCase.js.map