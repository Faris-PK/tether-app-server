"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class S3Service {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async uploadFile(file, folder = '') {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        const data = await this.s3Client.send(command);
        return {
            ...data,
            Location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
        };
    }
    async deleteFile(fileUrl) {
        const key = fileUrl.split('.com/')[1];
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        };
        const command = new client_s3_1.DeleteObjectCommand(params);
        await this.s3Client.send(command);
    }
}
exports.S3Service = S3Service;
//# sourceMappingURL=S3Service.js.map