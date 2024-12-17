"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductUseCase = void 0;
class UpdateProductUseCase {
    constructor(productRepository, s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
    }
    async execute(productId, userId, productData, files) {
        var _a, _b;
        try {
            const existingProduct = await this.productRepository.findById(productId);
            if (!existingProduct) {
                throw new Error('Product not found');
            }
            if (existingProduct.userId._id.toString() !== userId) {
                throw new Error('Unauthorized to update this product');
            }
            if (productData.location &&
                (!productData.location.name ||
                    !((_a = productData.location.coordinates) === null || _a === void 0 ? void 0 : _a.latitude) ||
                    !((_b = productData.location.coordinates) === null || _b === void 0 ? void 0 : _b.longitude))) {
                throw new Error('Invalid location data');
            }
            // Parse existingImages from the request
            let existingImages = [];
            if (productData.existingImages) {
                try {
                    existingImages = JSON.parse(productData.existingImages);
                }
                catch (error) {
                    console.error('Error parsing existingImages:', error);
                    existingImages = [];
                }
            }
            // Upload new images if any
            let newUploadedImages = [];
            if (files && files.length > 0) {
                const uploadPromises = files.map(file => this.s3Service.uploadFile(file, 'products'));
                const uploadResults = await Promise.all(uploadPromises);
                newUploadedImages = uploadResults.map(result => result.Location);
            }
            // Combine existing and new images
            const finalImages = [...existingImages, ...newUploadedImages];
            // Remove deleted images from S3
            const deletedImages = existingProduct.images.filter(img => !existingImages.includes(img));
            await Promise.all(deletedImages.map(imageUrl => this.s3Service.deleteFile(imageUrl)));
            const updatedData = {
                ...productData,
                images: finalImages,
            };
            return await this.productRepository.update(productId, updatedData);
        }
        catch (error) {
            // Cleanup any newly uploaded images if there's an error
            if (files) {
                try {
                    const uploadedImages = files.map(file => file.filename).filter(Boolean);
                    await Promise.all(uploadedImages.map(imageUrl => this.s3Service.deleteFile(imageUrl)));
                }
                catch (cleanupError) {
                    console.error('Error cleaning up uploaded files:', cleanupError);
                }
            }
            throw error;
        }
    }
}
exports.UpdateProductUseCase = UpdateProductUseCase;
//# sourceMappingURL=UpdateProductUseCase.js.map