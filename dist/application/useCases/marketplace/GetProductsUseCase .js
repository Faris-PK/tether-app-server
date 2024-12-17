"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsUseCase = void 0;
class GetProductsUseCase {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async execute(params) {
        try {
            return await this.adminRepository.findAllProducts(params);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.GetProductsUseCase = GetProductsUseCase;
//# sourceMappingURL=GetProductsUseCase%20.js.map