"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersUseCase = void 0;
class GetUsersUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        return await this.productRepository.findAll();
    }
}
exports.GetUsersUseCase = GetUsersUseCase;
//# sourceMappingURL=GetProductsUseCase.js.map