import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_BUCKET || '';
    const region = process.env.AWS_REGION || 'us-east-1';
    
    // We only initialize credentials if they are provided, otherwise AWS SDK
    // will attempt to load them from the environment or EC2 instance metadata.
    const config: any = { region };
    
    if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      };
    }
    
    this.s3Client = new S3Client(config);
  }

  /**
   * Uploads a file buffer to S3 and returns the public URL.
   * @param file The multer file object
   * @param prefix The S3 prefix/folder (e.g., 'images/uploads/states')
   * @returns The public S3 URL of the uploaded file
   */
  async uploadFile(file: Express.Multer.File, prefix: string): Promise<string> {
    if (!this.bucket) {
      throw new InternalServerErrorException('AWS_BUCKET environment variable is not defined.');
    }

    // Generate a unique filename using random hex or uuid
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const extension = extname(file.originalname);
    const filename = `${randomName}${extension}`;
    
    // Ensure prefix doesn't end with a slash if we're adding one
    const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
    const key = `${cleanPrefix}/${filename}`;

    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }));

      return filename;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  /**
   * Uploads a raw buffer to S3 and returns the public URL.
   * Useful for generated files (like thumbnails).
   * @param buffer The file buffer
   * @param mimetype The file MIME type (e.g., 'image/jpeg')
   * @param filename The raw filename (e.g., '123.jpg') to return.
   * @returns The raw filename.
   */
  async uploadBuffer(buffer: Buffer, mimetype: string, key: string, filename: string): Promise<string> {
    if (!this.bucket) {
      throw new InternalServerErrorException('AWS_BUCKET environment variable is not defined.');
    }

    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      }));

      return filename;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload buffer to S3');
    }
  }
}
