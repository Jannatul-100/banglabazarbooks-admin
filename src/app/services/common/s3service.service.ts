import {Injectable} from '@angular/core';
import {PutObjectCommandInput, S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private bucketName = 'Banglabazarbooks';
  private region = 'ap-southeast-1';
  private accessKeyId = 'AKIA6ODU7NUOJIEURH6B';
  private secretAccessKey = '+YzUY5kdqK5ws2pReqDP8$n03RxkYwsyuJE05ga';

  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      }
    });
  }

  async uploadFile(file: File): Promise<string> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: `${Date.now()}-${file.name}`,
      Body: file,
      ContentType: file.type,
      // ACL is removed here since the bucket doesn't support ACLs
    };

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: uploadParams
      });

      const result = await upload.done();
      // return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${uploadParams.Key}`;
      return `https://dqwuqztz1eyyr.cloudfront.net/${uploadParams.Key}`;
    } catch (error) {
      console.error('File upload failed:', error); // Log the error for debugging
      throw error;
    }
  }
}
