"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersUseCase = void 0;
class GetUsersUseCase {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async execute(params) {
        return await this.adminRepository.findAllUsers(params);
    }
}
exports.GetUsersUseCase = GetUsersUseCase;
//# sourceMappingURL=GetUsersUseCase.js.map