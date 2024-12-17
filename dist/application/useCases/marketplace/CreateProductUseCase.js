"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductUseCase = void 0;
const Product_1 = require("../../../domain/entities/Product");
class CreateProductUseCase {
    constructor(productRepository, s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
    }
    async execute(productData, files) {
        var _a, _b, _c, _d, _e;
        try {
            // console.log('hggsdjhg');
            // Validate location data
            if (!((_a = productData.location) === null || _a === void 0 ? void 0 : _a.name) ||
                !((_c = (_b = productData.location) === null || _b === void 0 ? void 0 : _b.coordinates) === null || _c === void 0 ? void 0 : _c.latitude) ||
                !((_e = (_d = productData.location) === null || _d === void 0 ? void 0 : _d.coordinates) === null || _e === void 0 ? void 0 : _e.longitude)) {
                throw new Error('Invalid location data');
            }
            // Upload images to S3
            const uploadPromises = files.map(file => this.s3Service.uploadFile(file, 'products'));
            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map(result => result.Location);
            const product = new Product_1.Product({
                ...productData,
                images: imageUrls,
            });
            console.log('product : ', product);
            return await this.productRepository.save(product);
        }
        catch (error) {
            // Clean up any uploaded images if there's an error
            try {
                const uploadedImages = files.map(file => file.filename).filter(Boolean);
                await Promise.all(uploadedImages.map(imageUrl => this.s3Service.deleteFile(imageUrl)));
            }
            catch (cleanupError) {
                console.error('Error cleaning up uploaded files:', cleanupError);
            }
            throw error;
        }
    }
}
exports.CreateProductUseCase = CreateProductUseCase;
//# sourceMappingURL=CreateProductUseCase.js.map