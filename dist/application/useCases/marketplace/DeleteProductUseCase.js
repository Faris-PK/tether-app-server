"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductUseCase = void 0;
class DeleteProductUseCase {
    constructor(productRepository, s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
    }
    async execute(productId, userId) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.userId._id.toString() !== userId) {
            throw new Error('Unauthorized to delete this product');
        }
        try {
            const deletePromises = product.images.map(imageUrl => this.s3Service.deleteFile(imageUrl));
            await Promise.all(deletePromises);
            await this.productRepository.delete(productId);
        }
        catch (error) {
            throw new Error('Failed to delete product: ' + error);
        }
    }
}
exports.DeleteProductUseCase = DeleteProductUseCase;
//# sourceMappingURL=DeleteProductUseCase.js.map