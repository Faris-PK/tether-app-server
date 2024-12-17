export declare class S3Service {
    private s3Client;
    upload: any;
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        Location: string;
        Expiration?: string;
        ETag?: string;
        ChecksumCRC32?: string;
        ChecksumCRC32C?: string;
        ChecksumSHA1?: string;
        ChecksumSHA256?: string;
        ServerSideEncryption?: import("@aws-sdk/client-s3").ServerSideEncryption;
        VersionId?: string;
        SSECustomerAlgorithm?: string;
        SSECustomerKeyMD5?: string;
        SSEKMSKeyId?: string;
        SSEKMSEncryptionContext?: string;
        BucketKeyEnabled?: boolean;
        RequestCharged?: import("@aws-sdk/client-s3").RequestCharged;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    deleteFile(fileUrl: string): Promise<void>;
}
