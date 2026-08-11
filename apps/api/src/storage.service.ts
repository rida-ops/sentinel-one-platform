import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

@Injectable()
export class StorageService {
  async uploadFile(
    bucket: string,
    file: Buffer,
    contentType: string,
    folder?: string
  ): Promise<{ key: string; url: string }> {
    const fileName = `${uuidv4()}`;
    const objectName = folder ? `${folder}/${fileName}` : fileName;

    await minioClient.putObject(bucket, objectName, file, file.length, {
      'Content-Type': contentType,
    });

    const url = `${process.env.STORAGE_URL || 'http://localhost:9000'}/${bucket}/${objectName}`;

    return { key: objectName, url };
  }

  async deleteFile(bucket: string, objectName: string): Promise<void> {
    await minioClient.removeObject(bucket, objectName);
  }

  async getFileUrl(bucket: string, objectName: string): Promise<string> {
    return minioClient.presignedGetObject(bucket, objectName, 24 * 60 * 60); // 24 hours
  }
}

export const storageService = new StorageService();
