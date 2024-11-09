import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export class S3Service {
  private s3Client: S3Client;
  upload: any;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = '') {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    const data = await this.s3Client.send(command);

    return {
      ...data,
      Location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
    };
  }

  async deleteFile(fileUrl: string) {
    const key = fileUrl.split('.com/')[1];
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
  }
}